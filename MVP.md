# NachhaltigCheck – MVP-Spezifikation

> Bauprodukt eingeben → in Sekunden sehen, welche Kriterien/Credits in DGNB, QNG, LEED, BREEAM, EU-Taxonomie und BNB betroffen sind, welche Produktgruppe das System dafür kennt, was konkret gefordert wird und welche Nachweise vom Hersteller anzufordern sind.

Stand: 2026-09-26 · Owner: Burak · Status: Demo läuft lokal (`node server.js`), MVP noch nicht gestartet

---

## 1. Problem & Positionierung

**Problem.** Wer ein zertifiziertes Gebäude plant oder baut (DGNB/QNG/LEED/BREEAM) und kein Auditor ist, weiß bei einem konkreten Produkt nicht, *wo* es im Kriterienkatalog auftaucht, *was* gefordert wird und *welche Unterlagen* er vom Hersteller braucht. Die Antwort liegt heute verstreut in 300-seitigen Kriterienkatalogen, in Auditor-Tools mit Projektzwang (BIM.pi, ZERTIVA) oder im Kopf des Auditors.

**Was NachhaltigCheck ist:** eine **Kriterien-Landkarte pro Material** + Nachweis-Checkliste. Schnell, ohne Projektanlage, ohne Login für die Basisfunktion, systemübergreifend.

**Was es NICHT ist (bewusst):**
- Keine Produktdatenbank (das ist SHI-Datenbank / baubook / DGNB Navigator).
- Keine Produktfreigabe / kein Auditor-Workflow (das ist BIM.pi / ZERTIVA).
- Kein Nachweis, dass Produkt X konform ist – wir sagen, *woran* das gemessen wird und *was* man dafür braucht.

**Abgrenzung zu BIM.pi (Hauptwettbewerber):** BIM.pi zeigt die Anforderungen ebenfalls, aber erst nach Projektanlage, Bauteilzuordnung und Systemwahl, primär DGNB/QNG. Unser Unterschied: 1 Eingabefeld, 6 Systeme nebeneinander, kein Onboarding, LV-Liste per Copy-Paste.

## 2. Zielgruppen & Zahlungsbereitschaft (Hypothesen – zu validieren)

| Segment | Schmerz | Hypothese Zahlungsbereitschaft | Priorität |
|---|---|---|---|
| **Baustoff-Hersteller (Produktmanagement / Vertrieb)** | „In welchen Credits hilft mein Produkt?“ für Datenblätter, Ausschreibungen, Vertriebsargumente | hoch – heute kaufen sie Green-Building-Factsheets für 1–3 k€/Produkt bei Beratern | **P1** |
| **Kleine Architektur-/Planungsbüros, erstes DGNB/QNG-Projekt** | Auditor fragt Nachweise ab, Büro versteht die Logik nicht | mittel – 20–50 €/Monat Bürolizenz | P1 |
| **Handwerker / Nachunternehmer** | Bekommen Nachweisanforderung vom Bauleiter, wissen nicht, was gemeint ist | niedrig – eher über Hersteller/GU bezahlt | P2 |
| **Auditoren** | Kennen alles auswendig; Nutzen nur als Schnell-Referenz & Checklisten-Generator | niedrig | P3 |
| **Bauherren (QNG für KfW-Förderung)** | Wollen wissen, ob ihre Materialwahl QNG-tauglich ist | einmalig 29–79 € pro Projektcheck | P2 |

## 3. Validierung vor dem Bau (Gate 0 – 2 Wochen)

Ziel: mindestens **3 zahlungsbereite Signale** bevor über die Demo hinaus entwickelt wird.

- [ ] ZERTIVA Open Beta und BIM.pi Basisversion selbst durchspielen; Screenshots + Notizen in `docs/competitors/`. Frage: liefert eines davon in < 60 s dieselbe Antwort ohne Projektanlage?
- [ ] 5 Gespräche Planungsbüros (2–10 MA, DGNB/QNG-Erfahrung ≤ 2 Projekte). Demo zeigen, fragen: „Was würdet ihr dafür im Monat zahlen?“, „Was fehlt, damit ihr es im Projekt nutzt?“
- [ ] 5 Gespräche Hersteller-Produktmanager (Dämmung, Bodenbelag, Farben, Dichtstoffe). Frage: „Würdet ihr für einen 1-seitigen ‚Green-Building-Credit-Pass‘ eures Produkts 99–199 € zahlen?“
- [ ] Landingpage mit Wartelisten-Formular + 3 Beispiel-Materialseiten (SEO-Test: „Mineralwolle DGNB ENV1.2“, „OSB QNG Formaldehyd“, „Silikonharzputz Biozid DGNB“).
- [ ] Kontakt DGNB (Lizenz-/Nutzungsfrage für Kriterientexte, siehe §9).

**Go-Kriterium:** ≥ 3 konkrete „ja, dafür zahle ich X“ ODER ≥ 50 Wartelisten-Einträge organisch in 4 Wochen. Sonst: Idee als Content-Site parken.

## 4. Scope

### 4.1 MVP (v1.0) – muss

1. **Materialsuche** mit Alias-/Fuzzy-Matching (Markennamen, Umgangssprache, LV-Sprache) – vorhanden in Demo, ausbauen.
2. **Ergebnisseite pro Material**: Übersichtskacheln je System (Relevanz), Kriterientabelle je System (Code, Titel, Themenfeld, Produktgruppe im System, Anforderung, Nachweise), „nicht betroffen“-Liste, Quellenlink je Kriterium.
3. **Nachweis-Checkliste** (konsolidiert, mit Zuordnung zu Kriterien) + **Musteranfrage an Hersteller** (E-Mail-Text mit Checkliste, kopierbar).
4. **Listenprüfung**: n Zeilen (LV, Produktliste, Excel-Spalte) → Matrix Material × System mit Relevanz + Link in Detailansicht; nicht erkannte Zeilen manuell zuordnen können.
5. **Export**: PDF (Detail + Liste) mit Datum, Systemversionen und Disclaimer; JSON/CSV.
6. **Datenbasis**: ≥ 120 Materialgruppen (siehe §6), 6 Systeme, jede Zeile mit Quelle + Systemversion + „zuletzt geprüft“-Datum.
7. **Paywall**: Free = 1 System (QNG) + 3 Suchen/Tag; Pro = alle Systeme, Listenprüfung, Export, Musteranfrage.
8. **Feedback-Button pro Kriterienzeile** („stimmt nicht / veraltet“) – die Datenqualität ist das Produkt.

### 4.2 v1.1 – soll

- Excel/CSV-Upload für Listenprüfung; GAEB-X83-Import (wie ZERTIVA) später.
- Filter: nur Innenraum-relevant / nur Schadstoff / nur LCA / nur Kreislauf.
- Systemversionen wählbar (DGNB 2018 vs. 2023, LEED v4 vs. v4.1 vs. v5).
- Merkliste / Projekt-Ordner (leichtgewichtig, kein Auditor-Workflow).
- Hersteller-Ansicht: „Credit-Pass“ für ein Produkt als PDF (P1-Monetarisierung).

### 4.3 v2 – Differenzierung (LLM)

- Upload Sicherheitsdatenblatt / EPD / Techn. Merkblatt → LLM extrahiert strukturierte Felder (VOC-Gehalt, GISCODE, EMICODE, Formaldehydklasse, Treibmittel, SVHC-Angaben, GWP A1–A3) → automatischer **Vorab-Abgleich** gegen die Anforderungen („erfüllt vermutlich QS3 ENV1.2 – fehlend: Emissionsprüfbericht“).
- Freitext-Erkennung von Materialien aus ganzen LV-PDFs.
- Das ist die Funktion, die BIM.pi nur „auf Anfrage“ als KI-Feature bietet und die ZERTIVA nicht hat.

### 4.4 Explizit außerhalb des Scopes

Produktdatenbank pflegen · Auditor-Freigabeworkflow · Ökobilanz-Rechner (One Click LCA/Caala) · Zertifizierung oder rechtsverbindliche Konformitätsaussagen · Mobile-first (Nutzung ist Schreibtisch; responsive reicht).

## 5. Nutzerflüsse

**Flow A – Einzelmaterial (Kern):**
Eingabe → Vorschläge (Score ≥ 40, Top 6) → Detailseite → System aufklappen → Checkliste kopieren / PDF / Musteranfrage.

**Flow B – Liste:**
Text einfügen (oder CSV) → Matrix → Zeile „nicht erkannt“ → Dropdown manuelle Zuordnung → PDF der gesamten Liste.

**Flow C – Hersteller-Credit-Pass (v1.1):**
Material wählen → Produktname, Hersteller, vorhandene Nachweise ankreuzen → PDF „Beitrag zu Green-Building-Zertifizierungen“ → Kauf.

## 6. Datenmodell & Datenarbeit

Die Daten sind der eigentliche Aufwand. Struktur aus der Demo beibehalten, aber aus JS in **JSON/YAML mit Schema** überführen, damit Nicht-Entwickler (Auditor als Freelancer) pflegen können.

```
Material
  id, name, category, aliases[], summary
  mappings[]:
    system (DGNB|QNG|LEED|BREEAM|EUTAX|BNB)
    systemVersion ("NB 2023.2", "QNG 2023", "v4.1", …)
    criterion (Code)
    relevance (hoch|mittel|gering)
    productGroup (Bezeichnung im System)
    requirement (eigene Formulierung, KEIN Zitat)
    evidence[] (Referenz auf Nachweis-Typ)
    source (URL / Dokument + Seite)
    lastVerified (Datum), verifiedBy
EvidenceType
  id, label, description, whoIssues, typicalCost, validityYears
System
  id, name, version, criteria{code → title, topic, url}
```

**Materialgruppen-Roadmap** (Demo: 31 → MVP: ≥ 120):
- Dämmstoffe (12): + Schaumglas, Perlite, Hanf/Jute, Vakuum, Kalziumsilikat, Aerogel, Mineralschaum
- Holz (8): + Furnierschichtholz, Thermoholz, Bambus, Kork
- Massivbau (10): + Lehm, Kalk, Zement/Mörtel, Leichtbeton, RC-Beton separat
- Beschichtungen (12): + Lacke Metall, Korrosionsschutz, Bodenbeschichtung Epoxid/PU, Spachtel, Grundierung, Tapeten
- Kleb-/Dichtstoffe (8): + Montageschaum (MDI!), Fugenband, Dampfbremse-Klebebänder
- Bodenbeläge (10): + Kautschuk, Gussasphalt, Terrazzo, Sportböden
- Abdichtung/Dach (8): + Dampfsperren, Bitumen-Kaltkleber, Gründach-Systeme, Wurzelschutz
- Fassade (8): + Faserzement, HPL, Glas, Klinker, vorgehängte Fassaden
- Ausbau (12): + Akustikdecken, Türen Stahl, Sanitärkeramik, Möbel/Einbau, Bodenbelag-Unterlagen
- TGA (10): Kältemittel (DGNB ENV1.2!), Rohre PVC/PE/Kupfer, Kabel halogenfrei, Lüftungskanäle, PV-Module
- Außenanlagen (6): Pflaster, Holz im Außenbereich, Kunststoffrasen (PFAS)

**Systemversionen für MVP:** DGNB NB 2023.2 · QNG 2023 (Anlage 3, Siegelvariante PLUS/PREMIUM) · LEED v4.1 BD+C (v5 als v1.1) · BREEAM Int. NC 2016 + BREEAM DE Bestand · EU-Tax Del. VO 2021/2139 Anhang I 7.1/7.2 + Anlage C · BNB BN 2015.

**Qualitätsprozess:** jede Zeile hat Quelle + Datum; Auditor-Review (Freelance, ~2 Tage pro 40 Materialien); Feedback-Button-Meldungen → Issue-Tracker; Quartals-Review bei Systemupdates (DGNB-Versionen, LEED v5-Umstellung).

## 7. Technik

**Empfehlung: Next.js (App Router) + TypeScript + Tailwind, Daten als JSON im Repo, Postgres (Supabase) nur für User/Abo/Feedback/Merkliste.**

- Warum nicht Expo/RN zuerst: Nutzung am Schreibtisch mit LV-Copy-Paste und PDF-Export; SEO pro Materialseite ist der günstigste Akquisekanal. Später Expo-App als Wrapper möglich (Bauleiter auf Baustelle).
- Suche: serverseitig wie in Demo (Alias + Wortmatch + Levenshtein), später Meilisearch/Typesense wenn > 500 Materialien.
- PDF: `@react-pdf/renderer` oder Playwright-Print serverseitig.
- Auth/Abo: Supabase Auth + Stripe (Web). Kein RevenueCat nötig, solange kein Store-Vertrieb.
- LLM (v2): Claude API, Extraktion aus PDF mit strukturiertem Output; PDF-Parsing serverseitig; DSGVO: SDBs sind unkritisch, Hochladen von LVs mit Projektnamen → Auftragsverarbeitung klären.
- Hosting: Vercel + Supabase (EU-Region Frankfurt).
- i18n: Deutsch zuerst; Englisch für LEED/BREEAM-Nutzer in v1.1.

**Migration aus der Demo:**
1. `data/systems.js`, `data/materials.js` → `content/systems/*.json`, `content/materials/*.json` + Zod-Schema.
2. Such-/Detail-/Bulk-Logik aus `server.js` → `lib/search.ts`, `lib/mapping.ts` (reine Funktionen, Unit-Tests).
3. `public/index.html` → Seiten `/`, `/material/[id]`, `/liste`, `/systeme/[id]`.
4. Statische Materialseiten per SSG (SEO).

## 8. Monetarisierung

| Plan | Preis | Enthält |
|---|---|---|
| Free | 0 € | QNG-Ansicht, 3 Suchen/Tag, keine Exporte |
| Pro (Büro) | 29 €/Monat oder 290 €/Jahr, bis 5 Nutzer | alle Systeme, Listenprüfung, PDF/CSV, Musteranfragen, Merkliste |
| Projekt-Check (Bauherr) | 49 € einmalig | eine Liste bis 100 Positionen als PDF-Report |
| Hersteller Credit-Pass | 149 €/Produkt, Paket 5 = 599 € | Produkt-PDF „Beitrag zu DGNB/QNG/LEED/BREEAM/EU-Tax“ mit Nachweis-Lücken |
| Enterprise / API | auf Anfrage | Hersteller-Katalog-Integration, White-Label |

Umsatzziel für „lohnt sich“: 40 Pro-Büros + 10 Hersteller-Pakete/Monat ≈ 2.500–3.000 €/Monat.

## 9. Risiken & Offene Punkte

- **Urheberrecht Kriterientexte:** DGNB-Kriterienkataloge sind urheberrechtlich geschützt; LEED/BREEAM ebenso. → Eigene Formulierungen, keine Zitate, Link auf Quelle. Vor Launch schriftliche Klärung mit DGNB (ggf. Partnerschaft „DGNB-konformes Tool“ wie BIM.pi).
- **Haftung:** Klarer Disclaimer „keine Konformitätsaussage“; AGB mit Haftungsbeschränkung; keine Aussage „Produkt erfüllt X“ ohne Nachweis-Upload (v2 auch dann nur „vermutlich“).
- **Datenpflege-Aufwand:** Systemupdates 1–2×/Jahr je System; Budget für Auditor-Review einplanen (~1.500 €/Quartal).
- **Wettbewerbsreaktion:** BIM.pi könnte eine freie Schnellsuche vorschalten. Verteidigung: Systembreite, Hersteller-Segment, LLM-Vorabgleich (v2).
- **Nebentätigkeit:** Nebentätigkeitsanzeige beim Arbeitgeber prüfen, bevor Umsatz entsteht.
- Offen: Name/Domain (nachhaltigcheck.de frei?), Rechtsform bei ersten Umsätzen, DGNB-Gespräch.

## 10. Meilensteine

| # | Meilenstein | Ergebnis | Ziel |
|---|---|---|---|
| 0 | Validierung (§3) | Go/No-Go | +2 Wochen |
| 1 | Repo-Setup Next.js, Datenmigration, Schema, Tests | Demo-Funktionalität in Next.js | +2 Wochen |
| 2 | Daten auf 120 Materialgruppen, Quellen, Auditor-Review 1 | Content-Basis | +6 Wochen (parallel) |
| 3 | Listenprüfung, PDF-Export, Musteranfrage | Feature-complete Free/Pro | +3 Wochen |
| 4 | Auth, Stripe, Paywall, Landing/SEO-Seiten, AGB/Datenschutz | Launch-fähig | +2 Wochen |
| 5 | Soft-Launch mit Validierungskontakten, Feedback-Loop | 10 zahlende Nutzer | +4 Wochen |
| 6 | Hersteller-Credit-Pass (v1.1) | erstes B2B-Paket verkauft | +4 Wochen |

## 11. Erfolgsmetriken

- Aktivierung: Anteil Suchen mit Klick in eine Systemtabelle ≥ 60 %
- Treffergenauigkeit Suche (Top-1 korrekt) ≥ 85 % auf 200 echten LV-Zeilen (Testset anlegen!)
- „Falsch/veraltet“-Meldungen pro 100 Kriterienzeilen ≤ 3
- Free→Pro-Konversion ≥ 4 %
- 30-Tage-Retention Pro ≥ 70 %

## 12. Nächste konkrete Schritte (für Claude Code)

1. `npx create-next-app@latest nachhaltig-check --ts --tailwind --app` und Demo-Daten nach `content/` migrieren (Zod-Schema in `lib/schema.ts`).
2. `lib/search.ts` mit Tests: das Testset `tests/lv-lines.json` (≥ 100 echte LV-Zeilen mit erwarteter Material-ID) anlegen; Ziel Top-1 ≥ 85 %.
3. Seiten `/`, `/material/[id]`, `/liste` mit der Demo-UI nachbauen; SSG für Materialseiten.
4. Datenpipeline: Skript `scripts/validate-content.ts` (Schema, Pflichtfelder Quelle/Datum, tote Links).
5. Erste 30 neue Materialgruppen nach §6 anlegen, Fokus Dämmstoffe + Beschichtungen + TGA (Kältemittel).
6. Landingpage + Warteliste live schalten, Validierungsgespräche starten (§3).
