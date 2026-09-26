// NachhaltigCheck – Static-Site-Client (GitHub Pages). Portiert die Server-Logik aus server.js,
// damit die App ohne Node-Backend läuft: Daten kommen aus data.json (Build-Output aus data/*.js).

let DATA = null;

// ---------- Suche (identisch zu server.js) ----------
const norm = (s) => s.toLowerCase()
  .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
  .replace(/[^a-z0-9/ ]+/g, " ").replace(/\s+/g, " ").trim();

function lev(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}

function scoreMaterial(q, mat) {
  const nq = norm(q);
  if (!nq) return 0;
  const terms = [mat.name, ...mat.aliases].map(norm);
  let best = 0;
  const shortQuery = nq.split(" ").length <= 2;
  for (const t of terms) {
    if (t === nq) return 100;
    const comparable = shortQuery || t.length >= nq.length * 0.6;
    if (comparable && (t.startsWith(nq) || nq.startsWith(t))) best = Math.max(best, 85);
    if (comparable && (t.includes(nq) || nq.includes(t))) best = Math.max(best, 70);
    const qw = nq.split(" "), tw = t.split(" ");
    let hits = 0;
    for (const w of qw) for (const x of tw) {
      if (w.length < 3) continue;
      if (x === w) { hits += 1; break; }
      if (x.includes(w) || w.includes(x)) { hits += 0.7; break; }
      if (w.length >= 5 && lev(w, x) <= Math.floor(w.length / 4)) { hits += 0.6; break; }
    }
    if (hits) best = Math.max(best, Math.min(90, 30 + 25 * hits));
  }
  return best;
}

function search(q, limit = 6) {
  return DATA.materials.map(m => ({ m, s: scoreMaterial(q, m) }))
    .filter(x => x.s >= 40).sort((a, b) => b.s - a.s).slice(0, limit)
    .map(x => ({ id: x.m.id, name: x.m.name, cat: x.m.cat, score: x.s }));
}

function detail(id) {
  const m = DATA.materials.find(x => x.id === id);
  if (!m) return null;
  const systems = DATA.systems;
  const out = { id: m.id, name: m.name, cat: m.cat, summary: m.summary, systems: [] };
  for (const sysId of Object.keys(systems)) {
    const sys = systems[sysId];
    const entries = (m.map[sysId] || []).map(e => ({
      code: e.crit, title: (sys.criteria[e.crit] || {}).title || e.crit, topic: (sys.criteria[e.crit] || {}).topic || "",
      url: (sys.criteria[e.crit] || {}).url || sys.url, relevance: e.rel, productGroup: e.grp, requirement: e.req, evidence: e.ev
    }));
    const covered = new Set(entries.map(e => e.code));
    const notAffected = Object.keys(sys.criteria).filter(c => !covered.has(c)).map(c => ({ code: c, title: sys.criteria[c].title, topic: sys.criteria[c].topic }));
    const w = { hoch: 3, mittel: 2, gering: 1 };
    const level = entries.reduce((a, e) => Math.max(a, w[e.relevance] || 0), 0);
    out.systems.push({ id: sysId, name: sys.name, short: sys.short, color: sys.color, url: sys.url, level: ["keine", "gering", "mittel", "hoch"][level], entries, notAffected });
  }
  const ev = new Map();
  for (const s of out.systems) for (const e of s.entries) for (const d of e.evidence) {
    if (!ev.has(d)) ev.set(d, new Set());
    ev.get(d).add(s.short + " " + e.code);
  }
  out.evidenceChecklist = [...ev.entries()].map(([doc, uses]) => ({ doc, usedBy: [...uses] })).sort((a, b) => b.usedBy.length - a.usedBy.length);
  return out;
}

function evaluate({ brand = "", model = "", text = "", system = "" }) {
  const systems = DATA.systems;
  const hits = search(text, 5);
  const sysId = systems[system] ? system : null;
  const base = { brand, model, query: text, systemId: sysId, systemName: sysId ? systems[sysId].name : null };
  if (!hits.length) return { ...base, match: null, candidates: [] };
  const top = hits[0];
  const d = detail(top.id);
  const sys = sysId ? d.systems.find(s => s.id === sysId) : null;
  return {
    ...base,
    match: { id: d.id, name: d.name, cat: d.cat, summary: d.summary, score: top.score },
    candidates: hits.slice(1).map(h => ({ id: h.id, name: h.name, score: h.score })),
    system: sys || null,
    evidenceChecklist: sys ? d.evidenceChecklist.filter(c => c.usedBy.some(u => u.startsWith(sys.short + " "))) : []
  };
}

function bulk(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean).slice(0, 60);
  return lines.map(line => {
    const hits = search(line, 1);
    if (!hits.length) return { input: line, match: null };
    const d = detail(hits[0].id);
    return { input: line, match: { id: d.id, name: d.name, score: hits[0].score, levels: Object.fromEntries(d.systems.map(s => [s.id, s.level])), topCriteria: d.systems.flatMap(s => s.entries.filter(e => e.relevance === "hoch").map(e => s.short + " " + e.code)) } };
  });
}

// ---------- UI ----------
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const badge = l => `<span class="badge b-${l}">${l}</span>`;

function wireUI() {
  document.querySelectorAll(".tabs button").forEach(b => b.onclick = () => {
    document.querySelectorAll(".tabs button").forEach(x => x.classList.toggle("on", x === b));
    $("#single").hidden = b.dataset.tab !== "single"; $("#bulk").hidden = b.dataset.tab !== "bulk"; $("#eval").hidden = b.dataset.tab !== "eval";
  });

  $("#chips").innerHTML = DATA.materials.map(m => `<span data-id="${m.id}">${esc(m.name.split(" (")[0])}</span>`).join("");
  $("#chips").querySelectorAll("span").forEach(s => s.onclick = () => load(s.dataset.id));

  $("#evSystem").innerHTML = Object.values(DATA.systems).map(s => `<option value="${s.id}">${esc(s.name)}</option>`).join("");
  const runEvaluate = () => {
    const body = { brand: $("#evBrand").value.trim(), model: $("#evModel").value.trim(), text: $("#evText").value.trim(), system: $("#evSystem").value };
    if (!body.text) { $("#evalResult").innerHTML = `<div class="head"><p>Bitte eine detaillierte Materialbezeichnung eingeben.</p></div>`; return; }
    renderEvaluate(evaluate(body));
  };
  $("#evBtn").onclick = runEvaluate;
  [$("#evBrand"), $("#evModel"), $("#evText")].forEach(el => el.addEventListener("keydown", e => { if (e.key === "Enter") runEvaluate(); }));

  let t, active = -1, sugg = [];
  $("#q").addEventListener("input", e => {
    clearTimeout(t); const q = e.target.value.trim();
    if (q.length < 2) { $("#sugg").hidden = true; return; }
    t = setTimeout(() => {
      sugg = search(q); active = -1;
      $("#sugg").innerHTML = sugg.length ? sugg.map(s => `<div data-id="${s.id}"><span>${esc(s.name)}</span><small>${esc(s.cat)} · ${s.score}%</small></div>`).join("")
        : `<div><small>Kein Treffer – bitte anderes Stichwort (z. B. Materialart statt Markenname).</small></div>`;
      $("#sugg").hidden = false;
      $("#sugg").querySelectorAll("div[data-id]").forEach(d => d.onclick = () => { $("#sugg").hidden = true; load(d.dataset.id); });
    }, 120);
  });
  $("#q").addEventListener("keydown", e => {
    const items = $("#sugg").querySelectorAll("div[data-id]");
    if (e.key === "ArrowDown") { active = Math.min(active + 1, items.length - 1); }
    else if (e.key === "ArrowUp") { active = Math.max(active - 1, 0); }
    else if (e.key === "Enter") { const pick = items[active >= 0 ? active : 0]; if (pick) { $("#sugg").hidden = true; load(pick.dataset.id); } return; }
    else if (e.key === "Escape") { $("#sugg").hidden = true; return; } else return;
    items.forEach((d, i) => d.classList.toggle("active", i === active)); e.preventDefault();
  });
  document.addEventListener("click", e => { if (!e.target.closest(".search")) $("#sugg").hidden = true; });

  $("#bulkBtn").onclick = () => {
    const rows = bulk($("#bulkText").value);
    const sysIds = ["DGNB", "QNG", "LEED", "BREEAM", "EUTAX", "BNB"];
    $("#bulkResult").innerHTML = `<div class="head bulk"><table><thead><tr><th>Position</th><th>Zuordnung</th>${sysIds.map(s => `<th>${s === "EUTAX" ? "EU-Tax" : s}</th>`).join("")}<th>Kriterien mit hoher Relevanz</th></tr></thead><tbody>
    ${rows.map(r => r.match ? `<tr><td>${esc(r.input)}</td><td><a href="#" onclick="document.querySelector('[data-tab=single]').click();load('${r.match.id}');return false">${esc(r.match.name)}</a><br><small style="color:var(--muted)">${r.match.score}% Übereinstimmung</small></td>${sysIds.map(s => `<td>${badge(r.match.levels[s])}</td>`).join("")}<td style="font-size:13px">${r.match.topCriteria.map(esc).join(", ")}</td></tr>`
        : `<tr><td>${esc(r.input)}</td><td colspan="8" style="color:var(--muted)">keine Materialgruppe erkannt – manuell zuordnen</td></tr>`).join("")}
    </tbody></table></div>
    <div class="toolbar"><button class="btn sec" onclick="window.print()">Als PDF drucken</button></div>`;
  };
}

function load(id) {
  const d = detail(id);
  $("#q").value = d.name;
  const ov = d.systems.map(s => `<div class="ov" style="--c:${s.color}" data-sys="${s.id}"><b>${esc(s.short)}</b><div class="lvl">Relevanz: ${badge(s.level)}</div><div class="lvl" style="color:var(--muted)">${s.entries.length} Kriterien betroffen</div></div>`).join("");
  const sys = d.systems.map(s => `
    <div class="sys open" style="--c:${s.color}" id="sys-${s.id}">
      <div class="t" onclick="this.parentElement.classList.toggle('open')"><h3>${esc(s.name)}</h3>${badge(s.level)}<a href="${s.url}" target="_blank" rel="noopener">Kriterienkatalog ↗</a></div>
      <div class="body">
        <table><thead><tr><th style="width:150px">Kriterium / Credit</th><th style="width:90px">Relevanz</th><th style="width:220px">Produktgruppe im System</th><th>Anforderung &amp; Nachweise</th></tr></thead><tbody>
        ${s.entries.map(e => `<tr>
          <td class="code"><a href="${e.url}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">${esc(e.code)}</a><small>${esc(e.title)}</small><small style="color:var(--accent)">${esc(e.topic)}</small></td>
          <td>${badge(e.relevance)}</td>
          <td>${esc(e.productGroup)}</td>
          <td>${esc(e.requirement)}${e.evidence.length ? `<ul class="ev">${e.evidence.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}</td></tr>`).join("")}
        </tbody></table>
        ${s.notAffected.length ? `<div class="na">Nicht betroffen: ${s.notAffected.map(n => esc(n.code + " " + n.title)).join(" · ")}</div>` : ""}
      </div>
    </div>`).join("");
  const check = `<div class="check"><h3>Nachweis-Checkliste für die Herstelleranfrage</h3><ol>${d.evidenceChecklist.map(c => `<li>${esc(c.doc)}<br><small>benötigt für: ${c.usedBy.map(esc).join(", ")}</small></li>`).join("")}</ol></div>`;
  $("#result").innerHTML = `
    <div class="head"><h2>${esc(d.name)}</h2><div class="cat">${esc(d.cat)}</div><p>${esc(d.summary)}</p><div class="overview">${ov}</div></div>
    <div class="toolbar"><button class="btn sec" onclick="window.print()">Als PDF drucken</button><button class="btn sec" onclick="navigator.clipboard.writeText(JSON.stringify(window.__last,null,2))">JSON kopieren</button></div>
    <div class="systems">${sys}</div>${check}`;
  window.__last = d;
  $("#result").querySelectorAll(".ov").forEach(o => o.onclick = () => document.getElementById("sys-" + o.dataset.sys).scrollIntoView({ behavior: "smooth", block: "start" }));
  $("#result").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderEvaluate(d) {
  const who = [d.brand, d.model].filter(Boolean).join(" · ");
  if (!d.match) {
    $("#evalResult").innerHTML = `<div class="head"><h2>Kein Treffer</h2><p class="evhead">${esc(who || d.query)}</p><p>Zu „${esc(d.query)}“ wurde keine passende Materialgruppe gefunden. Bitte präziser formulieren (Materialart statt nur Markenname) oder im Tab „Einzelnes Material“ manuell suchen.</p></div>`;
    return;
  }
  const candList = d.candidates.length ? `<p class="evhead">Andere mögliche Treffer: ${d.candidates.map(c => `<a href="#" data-id="${c.id}">${esc(c.name)} (${c.score}%)</a>`).join(", ")}</p>` : "";
  let sysHtml;
  if (!d.systemId) {
    sysHtml = `<p>Bitte ein Zertifizierungssystem auswählen.</p>`;
  } else if (!d.system) {
    sysHtml = `<p>Für ${esc(d.systemName)} sind bei dieser Materialgruppe keine Kriterien hinterlegt – vermutlich nicht betroffen.</p>`;
  } else {
    const s = d.system;
    sysHtml = `<div class="systems"><div class="sys open" style="--c:${s.color}"><div class="t"><h3>${esc(s.name)}</h3>${badge(s.level)}<a href="${s.url}" target="_blank" rel="noopener">Kriterienkatalog ↗</a></div>
      <div class="body"><table><thead><tr><th style="width:150px">Kriterium / Credit</th><th style="width:90px">Relevanz</th><th style="width:220px">Produktgruppe im System</th><th>Anforderung &amp; Nachweise</th></tr></thead><tbody>
      ${s.entries.map(e => `<tr>
        <td class="code"><a href="${e.url}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">${esc(e.code)}</a><small>${esc(e.title)}</small><small style="color:var(--accent)">${esc(e.topic)}</small></td>
        <td>${badge(e.relevance)}</td><td>${esc(e.productGroup)}</td>
        <td>${esc(e.requirement)}${e.evidence.length ? `<ul class="ev">${e.evidence.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}</td></tr>`).join("")}
      </tbody></table>
      ${s.notAffected.length ? `<div class="na">Nicht betroffen: ${s.notAffected.map(n => esc(n.code + " " + n.title)).join(" · ")}</div>` : ""}
      </div></div></div>
      ${d.evidenceChecklist.length ? `<div class="check"><h3>Nachweis-Checkliste für die Herstelleranfrage</h3><ol>${d.evidenceChecklist.map(c => `<li>${esc(c.doc)}</li>`).join("")}</ol></div>` : ""}`;
  }
  $("#evalResult").innerHTML = `
    <div class="head"><h2>${esc(d.match.name)}</h2><div class="cat">${esc(d.match.cat)}</div>
    <p class="evhead">${who ? esc(who) + " · " : ""}Zugeordnet zu „${esc(d.query)}“ (${d.match.score}% Übereinstimmung)</p>
    <p>${esc(d.match.summary)}</p>${candList}</div>
    ${sysHtml}
    <div class="toolbar"><button class="btn sec" onclick="window.print()">Als PDF drucken</button></div>`;
  $("#evalResult").querySelectorAll("a[data-id]").forEach(a => a.onclick = e => {
    e.preventDefault();
    const name = a.textContent.replace(/\s*\(\d+%\)$/, "");
    renderEvaluate(evaluate({ brand: $("#evBrand").value.trim(), model: $("#evModel").value.trim(), text: name, system: $("#evSystem").value }));
  });
}

async function init() {
  const res = await fetch("data.json");
  DATA = await res.json();
  wireUI();
}
document.addEventListener("DOMContentLoaded", init);
