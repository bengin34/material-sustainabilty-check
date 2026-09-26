// NachhaltigCheck – Demo-Server (ohne Abhängigkeiten). Start: node server.js  →  http://localhost:3000
const http = require("http");
const fs = require("fs");
const path = require("path");
const systems = require("./data/systems");
const { materials } = require("./data/materials");

const PORT = process.env.PORT || 3000;

// ---------- Suche ----------
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
    // Präfix-/Teilstring-Regeln nur, wenn Alias und Anfrage ähnlich lang sind (sonst matcht "silikon" auf "Silikonharz-Oberputz …")
    const comparable = shortQuery || t.length >= nq.length * 0.6;
    if (comparable && (t.startsWith(nq) || nq.startsWith(t))) best = Math.max(best, 85);
    if (comparable && (t.includes(nq) || nq.includes(t))) best = Math.max(best, 70);
    // Wortweise
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
  return materials.map(m => ({ m, s: scoreMaterial(q, m) }))
    .filter(x => x.s >= 40).sort((a, b) => b.s - a.s).slice(0, limit)
    .map(x => ({ id: x.m.id, name: x.m.name, cat: x.m.cat, score: x.s }));
}

function detail(id) {
  const m = materials.find(x => x.id === id);
  if (!m) return null;
  const out = { id: m.id, name: m.name, cat: m.cat, summary: m.summary, systems: [] };
  for (const sysId of Object.keys(systems)) {
    const sys = systems[sysId];
    const entries = (m.map[sysId] || []).map(e => ({
      code: e.crit, title: (sys.criteria[e.crit] || {}).title || e.crit, topic: (sys.criteria[e.crit] || {}).topic || "",
      url: (sys.criteria[e.crit] || {}).url || sys.url, relevance: e.rel, productGroup: e.grp, requirement: e.req, evidence: e.ev
    }));
    // Kriterien des Systems, die nicht betroffen sind
    const covered = new Set(entries.map(e => e.code));
    const notAffected = Object.keys(sys.criteria).filter(c => !covered.has(c)).map(c => ({ code: c, title: sys.criteria[c].title, topic: sys.criteria[c].topic }));
    const w = { hoch: 3, mittel: 2, gering: 1 };
    const level = entries.reduce((a, e) => Math.max(a, w[e.relevance] || 0), 0);
    out.systems.push({ id: sysId, name: sys.name, short: sys.short, color: sys.color, url: sys.url, level: ["keine", "gering", "mittel", "hoch"][level], entries, notAffected });
  }
  // Konsolidierte Nachweisliste
  const ev = new Map();
  for (const s of out.systems) for (const e of s.entries) for (const d of e.evidence) {
    if (!ev.has(d)) ev.set(d, new Set());
    ev.get(d).add(s.short + " " + e.code);
  }
  out.evidenceChecklist = [...ev.entries()].map(([doc, uses]) => ({ doc, usedBy: [...uses] })).sort((a, b) => b.usedBy.length - a.usedBy.length);
  return out;
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

// ---------- HTTP ----------
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png" };
const json = (res, code, body) => { res.writeHead(code, { "Content-Type": "application/json; charset=utf-8" }); res.end(JSON.stringify(body)); };

http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const p = url.pathname;

  if (p === "/api/systems") return json(res, 200, Object.values(systems).map(s => ({ id: s.id, name: s.name, short: s.short, color: s.color, url: s.url, criteria: s.criteria })));
  if (p === "/api/materials") return json(res, 200, materials.map(m => ({ id: m.id, name: m.name, cat: m.cat })));
  if (p === "/api/search") return json(res, 200, search(url.searchParams.get("q") || ""));
  if (p.startsWith("/api/material/")) { const d = detail(p.split("/").pop()); return d ? json(res, 200, d) : json(res, 404, { error: "unbekannt" }); }
  if (p === "/api/bulk" && req.method === "POST") {
    let body = ""; req.on("data", c => body += c); req.on("end", () => { try { json(res, 200, bulk(JSON.parse(body).text || "")); } catch { json(res, 400, { error: "bad json" }); } });
    return;
  }

  // static
  const file = path.join(__dirname, "public", p === "/" ? "index.html" : p);
  if (!file.startsWith(path.join(__dirname, "public"))) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end("404"); }
    res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" }); res.end(data);
  });
}).listen(PORT, () => console.log(`NachhaltigCheck läuft: http://localhost:${PORT}  (${materials.length} Materialgruppen, ${Object.keys(systems).length} Systeme)`));
