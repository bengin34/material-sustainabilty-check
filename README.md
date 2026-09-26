# NachhaltigCheck – Demo

Bauprodukt eingeben → betroffene Kriterien / Credits / Produktgruppen in DGNB, QNG, LEED, BREEAM, EU-Taxonomie und BNB, plus Nachweis-Checkliste für die Herstelleranfrage.

## Start
    node server.js
→ http://localhost:3000  (keine Abhängigkeiten, Node ≥ 18)

## Struktur
- data/systems.js   – 6 Zertifizierungssysteme mit materialrelevanten Kriterien
- data/materials.js – 31 Materialgruppen mit Aliassen und Kriterien-Mapping (Bausteine je Produktart)
- server.js         – API: /api/search?q=, /api/material/:id, POST /api/bulk, /api/systems, /api/materials
- public/index.html – UI (Einzelsuche + LV-Listenprüfung, PDF-Druck, JSON-Export)

## Hinweis
Demo-Datensatz. Kriteriennummern nach DGNB NB 2023, QNG 2023 Anlage 3, LEED v4.1 BD+C, BREEAM Int. NC 2016,
EU-Tax Del. VO 2021/2139 Anhang I 7.1 / Anlage C, BNB BN 2015. Vor Projekteinsatz gegen die gültigen Kataloge prüfen.
