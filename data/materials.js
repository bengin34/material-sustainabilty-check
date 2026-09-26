// Materialgruppen → je Zertifizierungssystem: betroffene Kriterien, Produktgruppe, Anforderung, Nachweise.
// Relevanz: "hoch" = Kriterium hängt unmittelbar am Produkt (Nachweis zwingend bzw. Punkte direkt),
//           "mittel" = Produkt trägt zur Bewertung bei, "gering" = indirekt/optional.
// Hinweis: Demo-Datensatz. Kriteriennummern nach DGNB NB 2023, QNG 2023 Anlage 3, LEED v4.1 BD+C, BREEAM Int. NC 2016,
// EU-Taxonomie Del. VO 2021/2139 Anhang I 7.1 / Anlage C, BNB BN 2015. Vor Projektnutzung mit Originalkatalog abgleichen.

// ---- Wiederverwendbare Nachweis-Bausteine --------------------------------------------------------
const N = {
  EPD: "EPD nach EN 15804+A2 (z. B. IBU, ift, EPD-Norge) oder ÖKOBAUDAT-Datensatz",
  SDB: "Sicherheitsdatenblatt (REACH Art. 31), aktuell (< 2 Jahre)",
  TM: "Technisches Merkblatt / Produktdatenblatt",
  DoP: "CE-Leistungserklärung (DoP) mit Emissions-/Formaldehydklasse",
  AGBB: "Emissionsprüfbericht nach AgBB-Schema / EN 16516 (28-Tage-Kammer, TVOC, SVOC, R-Wert, Formaldehyd)",
  EMICODE: "EMICODE EC1 PLUS (GEV) – Zertifikat",
  GISCODE: "GISCODE-Angabe (BG BAU) im SDB/TM",
  BE: "Blauer Engel (RAL-UZ) – Zertifikat",
  NP: "natureplus- oder eco-INSTITUT-Label",
  FSC: "FSC- oder PEFC-Chain-of-Custody-Zertifikat (projektbezogen, mit Lieferschein-Vermerk)",
  SVHC: "Herstellererklärung: keine SVHC > 0,1 % (REACH Art. 33), keine Stoffe nach EU-Tax Anlage C",
  HPD: "Health Product Declaration (HPD) v2.x, Declare Label oder Cradle-to-Cradle Certified (Material Health)",
  RECYC: "Nachweis Recyclinganteil (Pre-/Post-Consumer, Drittprüfung) bzw. Rücknahme-/Recyclingsystem",
  DEMONT: "Angaben zu Verbindungstechnik / Lösbarkeit (Rückbaukonzept, ISO 20887)",
  CDPH: "CDPH Standard Method v1.2 Prüfbericht (oder EN 16516 als EU-Alternative gem. LEED v4.1)",
  VOCCONT: "VOC-Gehalt (g/L) nach SCAQMD Rule 1113/1168 bzw. Decopaint-RL 2004/42/EG",
  CARB: "CARB ATCM 93120 Phase 2 / TSCA Title VI oder EU: E1/E05 (EN 13986) Nachweis",
  BIOZID: "Herstellererklärung zu Biozid-/Filmkonservierern (Wirkstoff, Konzentration, Auswaschverhalten)",
  ISO14001: "ISO 14001 / EMAS-Zertifikat des Herstellers (Responsible Sourcing, BREEAM Mat 03)",
  BES6001: "BES 6001 Responsible Sourcing-Zertifikat (soweit vorhanden)"
};

// ---- Kriterien-Bausteine je Systemtyp -------------------------------------------------------------
// Jede Funktion liefert ein Array von Einträgen für ein System.
const lcaBlock = (grp) => ({
  DGNB: [{ crit: "ENV1.1", rel: "hoch", grp, req: "Produkt geht mengenmäßig in die Gebäude-Ökobilanz ein (GWP, PENRT etc.). Produktspezifische EPD verbessert die Datenqualität gegenüber ÖKOBAUDAT-Generika.", ev: [N.EPD] }],
  QNG: [{ crit: "3.1.1", rel: "hoch", grp, req: "Treibhausgasemissionen im Lebenszyklus ≤ 24 kg CO₂e/m²NRF·a (PLUS) bzw. ≤ 20 (PREMIUM) – Bilanzierung mit ÖKOBAUDAT; produktspezifische EPDs zulässig.", ev: [N.EPD] },
        { crit: "3.1.2", rel: "mittel", grp, req: "Primärenergie nicht erneuerbar im Lebenszyklus – Grenzwert gem. QNG-Handbuch; Produkt-EPD als Datenquelle.", ev: [N.EPD] }],
  LEED: [{ crit: "MRc EPD", rel: "hoch", grp, req: "Option 1: ≥ 20 Produkte mit EPD (produktspezifische Typ III = 1 Produkt; branchenweite = ½ Produkt). Option 2: Optimierung – GWP-Reduktion gegenüber Baseline nachgewiesen.", ev: [N.EPD] },
         { crit: "MRc LCA", rel: "mittel", grp, req: "Whole-Building LCA: Produkt geht in Struktur/Hülle-Bilanz ein (≥ 10 % Reduktion GWP + 2 weitere Kategorien).", ev: [N.EPD] }],
  BREEAM: [{ crit: "Mat 01", rel: "hoch", grp, req: "LCA des Gebäudes; Credits für Produkte mit verifizierter EPD (EN 15804) und für LCA-basierte Optimierung.", ev: [N.EPD] }],
  EUTAX: [{ crit: "Klimaschutz (SC)", rel: "mittel", grp, req: "Bei Gebäuden > 5.000 m²: GWP über Lebenszyklus nach EN 15978 zu berechnen und offenzulegen – Produkt-EPD als Datenbasis.", ev: [N.EPD] }],
  BNB: [{ crit: "1.1.1", rel: "hoch", grp, req: "Ökobilanz (GWP, ODP, POCP, AP, EP, PENRT) nach ÖKOBAUDAT – Produkt geht mengenmäßig ein.", ev: [N.EPD] }]
});

const circBlock = (grp, note) => ({
  DGNB: [{ crit: "TEC1.6", rel: "mittel", grp, req: "Bewertung von Rückbaubarkeit, Sortenreinheit und Verwertungsweg des Bauteils. " + (note || "Lösbare Verbindungen und sortenreine Trennung werden honoriert."), ev: [N.DEMONT, N.RECYC] }],
  LEED: [{ crit: "MRc CDWaste", rel: "gering", grp, req: "Verschnitt/Baustellenabfall des Produkts muss in die Verwertungsquote (≥ 50/75 %) einfließen.", ev: [N.RECYC] }],
  BREEAM: [{ crit: "Wst 01", rel: "gering", grp, req: "Bauabfallmanagement: Verschnitt-Vermeidung, Rücknahme durch Hersteller.", ev: [N.RECYC] },
           { crit: "Wst 06", rel: "mittel", grp, req: "Design for disassembly: Bauteil sollte ohne Zerstörung angrenzender Bauteile rückbaubar sein.", ev: [N.DEMONT] }],
  EUTAX: [{ crit: "DNSH Kreislauf", rel: "mittel", grp, req: "≥ 70 % (Masse) nicht gefährlicher Bau-/Abbruchabfall zur Wiederverwendung/Recycling; Gebäudeentwurf ressourceneffizient, anpassbar, rückbaubar (ISO 20887).", ev: [N.DEMONT, N.RECYC] }],
  BNB: [{ crit: "4.1.4", rel: "mittel", grp, req: "Rückbau-, Trenn- und Verwertungsfreundlichkeit des Bauteils (Aufwand, Sortenreinheit, Verwertungsweg).", ev: [N.DEMONT, N.RECYC] }]
});

// Schadstoff-/Innenraum-Blöcke je Produktart
const S = {
  daemmstoff: (grp) => ({
    DGNB: [{ crit: "ENV1.2", rel: "hoch", grp: "Kriterienmatrix ENV1.2 – Dämmstoffe", req: "QS1–QS4: keine halogenierten Treibmittel (HFKW/HFCKW); Flammschutzmittel HBCD ausgeschlossen (POP-VO); bei QS3/4 Nachweis emissionsarm (z. B. Blauer Engel DE-UZ 132) bzw. Freiheit von SVHC. Mineralwolle: Freizeichnung Biopersistenz (Note Q / EUCEB).", ev: [N.SDB, N.TM, N.SVHC, N.BE] }],
    QNG: [{ crit: "3.1.4", rel: "hoch", grp: "QNG Anlage 3 – Dämmstoffe", req: "Keine halogenierten Treibmittel; keine HBCD-Flammschutzmittel; bei Innenanwendung emissionsarm (AgBB). Faserdämmstoffe: Freizeichnungskriterium nach ChemVerbotsV/EUCEB.", ev: [N.SDB, N.TM, N.SVHC] }],
    LEED: [{ crit: "EQc LowEmit", rel: "hoch", grp: "Insulation (Kategorie ‚Insulation‘, gilt für Produkte innerhalb der Luftdichtheitsebene)", req: "General Emissions Evaluation: CDPH v1.2 (oder EN 16516 nach LEED-v4.1-Europa-Pfad); ≥ 75 % der Kategorie (Kosten/Fläche) konform.", ev: [N.CDPH, N.AGBB] },
           { crit: "MRc Ingredients", rel: "mittel", grp: "Insulation", req: "Option 1: Inhaltsstoff-Offenlegung bis 1.000 ppm (HPD/Declare/C2C) – zählt als 1 Produkt (Ziel ≥ 20).", ev: [N.HPD] }],
    BREEAM: [{ crit: "Hea 02", rel: "mittel", grp: "Dämmstoffe (Innenanwendung)", req: "Emissionsanforderung: TVOC ≤ 1.000 µg/m³ nach 28 d, Formaldehyd-Grenze gem. Tabelle Hea 02 (EN 16516).", ev: [N.AGBB] },
             { crit: "Mat 03", rel: "mittel", grp: "Dämmstoffe", req: "Responsible Sourcing: Hersteller mit ISO 14001/EMAS oder BES 6001 → Punkte nach Tabelle Mat 03.", ev: [N.ISO14001, N.BES6001] }],
    EUTAX: [{ crit: "DNSH Verschmutzung", rel: "hoch", grp: "Bauteile mit möglichem Kontakt zu Nutzern", req: "Keine Stoffe nach Anlage C (u. a. POP-VO → HBCD, SVHC, CMR 1A/1B); Bauteile in Nutzerkontakt: < 0,06 mg/m³ Formaldehyd und < 0,001 mg/m³ CMR-1A/1B-VOC (EN 16516 / ISO 16000-3).", ev: [N.SVHC, N.AGBB, N.SDB] }],
    BNB: [{ crit: "1.1.6", rel: "hoch", grp: "Dämmstoffe", req: "Qualitätsstufen 1–5 analog DGNB: halogenfreie Treibmittel, keine HBCD, emissionsarm im Innenraum.", ev: [N.SDB, N.TM, N.SVHC] }]
  }),

  holzwerkstoff: (grp) => ({
    DGNB: [{ crit: "ENV1.2", rel: "hoch", grp: "Kriterienmatrix ENV1.2 – Holzwerkstoffe / Holz", req: "Formaldehyd: mind. E1 (QS1), E05 / ≤ 0,05 ppm bzw. Blauer Engel DE-UZ 76 für höhere QS; kein PCP, keine Holzschutzmittel bei Innenanwendung (Gebrauchsklasse 0/1).", ev: [N.DoP, N.TM, N.BE, N.SDB] },
           { crit: "SOC1.2", rel: "hoch", grp: "Innenraum (Emissionen)", req: "Raumluftmessung nach Fertigstellung: TVOC ≤ 500 µg/m³ (Ziel) / Formaldehyd ≤ 60 µg/m³ (Ziel). Holzwerkstoffe sind Haupt-Formaldehydquelle.", ev: [N.AGBB] },
           { crit: "ENV1.3", rel: "hoch", grp: "Holz und Holzwerkstoffe", req: "≥ 50 % / 80 % / 100 % des Holzes aus zertifizierter Forstwirtschaft (FSC/PEFC) je Bewertungsstufe; Lieferkette dokumentiert.", ev: [N.FSC] }],
    QNG: [{ crit: "3.1.4", rel: "hoch", grp: "QNG Anlage 3 – Holzwerkstoffe", req: "Formaldehydabgabe ≤ 0,05 ppm (E05 / Blauer Engel-Niveau) für Innenanwendung; keine Holzschutzmittel in Innenräumen.", ev: [N.DoP, N.BE, N.TM] },
          { crit: "3.1.3", rel: "hoch", grp: "Holz", req: "100 % des Holzes aus nachhaltiger Forstwirtschaft (FSC, PEFC oder gleichwertig) bzw. Herkunftsnachweis EU-Holz nach EUTR/EUDR.", ev: [N.FSC] },
          { crit: "3.2.x", rel: "mittel", grp: "Innenraum", req: "Bei PLUS/PREMIUM Raumluftmessung TVOC/Formaldehyd; emissionsarme Holzwerkstoffe entscheidend.", ev: [N.AGBB] }],
    LEED: [{ crit: "EQc LowEmit", rel: "hoch", grp: "Composite Wood", req: "Formaldehyd: CARB ATCM 93120 Phase 2 / TSCA Title VI oder ULEF/NAF; in EU alternativ E1 + CDPH/EN 16516-Nachweis akzeptiert.", ev: [N.CARB, N.DoP] },
           { crit: "MRc Sourcing", rel: "hoch", grp: "Wood products", req: "FSC-zertifiziertes Holz zählt zu 100 % (Kostenbasis) für Responsible Extraction; Ziel ≥ 25 % der Materialkosten.", ev: [N.FSC] },
           { crit: "MRc Ingredients", rel: "mittel", grp: "Composite Wood", req: "HPD/Declare/C2C als Inhaltsstoff-Offenlegung.", ev: [N.HPD] }],
    BREEAM: [{ crit: "Hea 02", rel: "hoch", grp: "Wood-based panels", req: "Formaldehyd Klasse E1 (EN 13986); empfohlen E05; TVOC-Grenze nach 28 d.", ev: [N.DoP, N.AGBB] },
             { crit: "Mat 03", rel: "hoch", grp: "Timber", req: "Alles Holz muss legal beschafft sein (Vorbedingung); FSC/PEFC bringt Punkte in Mat 03 Responsible Sourcing.", ev: [N.FSC] }],
    EUTAX: [{ crit: "DNSH Verschmutzung", rel: "hoch", grp: "Bauteile mit möglichem Kontakt zu Nutzern", req: "Formaldehyd < 0,06 mg/m³ Kammerluft (EN 16516), CMR-1A/1B-VOC < 0,001 mg/m³; keine Anlage-C-Stoffe.", ev: [N.AGBB, N.SVHC] }],
    BNB: [{ crit: "1.1.6", rel: "hoch", grp: "Holzwerkstoffe", req: "Formaldehydklasse E1 Mindestanforderung, höhere QS mit E05/Blauer Engel.", ev: [N.DoP, N.BE] },
          { crit: "1.1.7", rel: "hoch", grp: "Holz", req: "Anteil Holz aus zertifizierter Forstwirtschaft (FSC/PEFC/Naturland) – Bewertung nach Anteil.", ev: [N.FSC] },
          { crit: "3.1.3", rel: "hoch", grp: "Innenraum", req: "Raumluftmessung TVOC ≤ 500 µg/m³, Formaldehyd ≤ 60 µg/m³ (Zielwert).", ev: [N.AGBB] }]
  }),

  beschichtung: (grp, isWood) => ({
    DGNB: [{ crit: "ENV1.2", rel: "hoch", grp: "Kriterienmatrix ENV1.2 – Beschichtungen (Farben, Lacke, Lasuren, Putze innen)", req: "VOC-Gehalt unter Decopaint-Grenzwert (QS1); QS2–QS4: lösemittelarm/-frei (z. B. Blauer Engel DE-UZ 102 Wandfarben / DE-UZ 12a Lacke), ohne Konservierer-Isothiazolinone > Grenzwert, ohne SVHC. " + (isWood ? "Holzlasuren außen: Biozid-Wirkstoffe deklarieren." : ""), ev: [N.SDB, N.TM, N.BE, N.VOCCONT, N.GISCODE] },
           { crit: "SOC1.2", rel: "hoch", grp: "Innenraum (Emissionen)", req: "Beschichtungen sind maßgebliche TVOC-Quelle in der Raumluftmessung.", ev: [N.AGBB] }],
    QNG: [{ crit: "3.1.4", rel: "hoch", grp: "QNG Anlage 3 – Beschichtungen innen", req: "Emissionsarm nach AgBB; VOC-Gehalt nach ChemVOCFarbV; keine Formaldehydabspalter; Blauer Engel / EMICODE als anerkannte Nachweise.", ev: [N.SDB, N.TM, N.BE, N.AGBB] }],
    LEED: [{ crit: "EQc LowEmit", rel: "hoch", grp: "Interior Paints & Coatings", req: "General Emissions (CDPH v1.2 / EN 16516) UND VOC-Gehalt (SCAQMD 1113 / Decopaint) – ≥ 90 % der Kategorie konform.", ev: [N.CDPH, N.VOCCONT] },
           { crit: "MRc Ingredients", rel: "gering", grp: "Paints", req: "HPD/Declare optional.", ev: [N.HPD] }],
    BREEAM: [{ crit: "Hea 02", rel: "hoch", grp: "Paints and varnishes", req: "VOC-Gehalt ≤ Decopaint-Grenzwert (2004/42/EG Phase II), Emissionsprüfung EN 16516 (TVOC, Formaldehyd, CMR).", ev: [N.VOCCONT, N.AGBB] }],
    EUTAX: [{ crit: "DNSH Verschmutzung", rel: "hoch", grp: "Bauteile mit möglichem Kontakt zu Nutzern", req: "Formaldehyd < 0,06 mg/m³ und CMR-1A/1B-VOC < 0,001 mg/m³ (EN 16516); keine Anlage-C-Stoffe.", ev: [N.AGBB, N.SVHC] }],
    BNB: [{ crit: "1.1.6", rel: "hoch", grp: "Beschichtungen", req: "Qualitätsstufen nach VOC-Gehalt und Lösemittelgehalt; Blauer Engel / GISCODE.", ev: [N.SDB, N.GISCODE, N.BE] },
          { crit: "3.1.3", rel: "hoch", grp: "Innenraum", req: "Raumluftmessung; Beschichtung maßgebliche VOC-Quelle.", ev: [N.AGBB] }]
  }),

  klebstoff: (grp) => ({
    DGNB: [{ crit: "ENV1.2", rel: "hoch", grp: "Kriterienmatrix ENV1.2 – Klebstoffe / Dichtstoffe / Verlegewerkstoffe", req: "QS1: GISCODE lösemittelarm; QS2–QS4: EMICODE EC1 PLUS bzw. Blauer Engel; Dichtstoffe: keine zinnorganischen Katalysatoren, keine SVHC.", ev: [N.EMICODE, N.GISCODE, N.SDB, N.TM] },
           { crit: "SOC1.2", rel: "hoch", grp: "Innenraum (Emissionen)", req: "Verlegewerkstoffe und Dichtstoffe sind typische SVOC/TVOC-Quellen.", ev: [N.AGBB] }],
    QNG: [{ crit: "3.1.4", rel: "hoch", grp: "QNG Anlage 3 – Klebstoffe / Dichtstoffe", req: "EMICODE EC1 PLUS oder gleichwertig emissionsarm (AgBB); lösemittelfrei (GISCODE D1/RE1/S1).", ev: [N.EMICODE, N.GISCODE, N.SDB] }],
    LEED: [{ crit: "EQc LowEmit", rel: "hoch", grp: "Interior Adhesives & Sealants", req: "General Emissions (CDPH v1.2 / EN 16516) UND VOC-Gehalt (SCAQMD 1168) – ≥ 90 % der Kategorie konform.", ev: [N.CDPH, N.VOCCONT] }],
    BREEAM: [{ crit: "Hea 02", rel: "hoch", grp: "Adhesives and sealants", req: "Emissionsprüfung EN 16516; EMICODE EC1 PLUS wird als Nachweis akzeptiert.", ev: [N.AGBB, N.EMICODE] }],
    EUTAX: [{ crit: "DNSH Verschmutzung", rel: "hoch", grp: "Bauteile mit möglichem Kontakt zu Nutzern", req: "Formaldehyd < 0,06 mg/m³, CMR-1A/1B-VOC < 0,001 mg/m³; keine Anlage-C-Stoffe (z. B. bestimmte Phthalate, zinnorganische Verbindungen).", ev: [N.AGBB, N.SVHC] }],
    BNB: [{ crit: "1.1.6", rel: "hoch", grp: "Klebstoffe / Dichtstoffe", req: "GISCODE / EMICODE-Stufen analog DGNB.", ev: [N.EMICODE, N.GISCODE] },
          { crit: "3.1.3", rel: "hoch", grp: "Innenraum", req: "Raumluftmessung TVOC/Formaldehyd.", ev: [N.AGBB] }]
  }),

  bodenbelag: (grp, extra) => ({
    DGNB: [{ crit: "ENV1.2", rel: "hoch", grp: "Kriterienmatrix ENV1.2 – Bodenbeläge", req: "Emissionsarm: QS2+ mit Blauer Engel DE-UZ 120/128/176, EMICODE, eco-INSTITUT oder AgBB-Prüfung; keine Weichmacher (Phthalate) nach SVHC-Liste; Halogen-Kunststoffe (PVC) werden in QS3/4 abgewertet. " + (extra || ""), ev: [N.AGBB, N.BE, N.SDB, N.TM] },
           { crit: "SOC1.2", rel: "hoch", grp: "Innenraum (Emissionen)", req: "Bodenbelag + Kleber sind zusammen die größte Innenraum-Emissionsquelle.", ev: [N.AGBB] }],
    QNG: [{ crit: "3.1.4", rel: "hoch", grp: "QNG Anlage 3 – Bodenbeläge", req: "Emissionsarm nach AgBB; Nachweis über Blauer Engel, eco-INSTITUT, natureplus oder Prüfbericht.", ev: [N.AGBB, N.BE, N.NP] },
          { crit: "3.2.x", rel: "mittel", grp: "Innenraum", req: "Raumluftmessung bei PLUS/PREMIUM.", ev: [N.AGBB] }],
    LEED: [{ crit: "EQc LowEmit", rel: "hoch", grp: "Flooring", req: "General Emissions (CDPH v1.2 / EN 16516), ≥ 90 % der Kategorie; FloorScore / Indoor Air Comfort Gold als Nachweis.", ev: [N.CDPH, N.AGBB] },
           { crit: "MRc Ingredients", rel: "mittel", grp: "Flooring", req: "HPD/Declare/C2C-Offenlegung.", ev: [N.HPD] }],
    BREEAM: [{ crit: "Hea 02", rel: "hoch", grp: "Flooring (resilient, textile, wood)", req: "EN 16516: TVOC ≤ 1.000 µg/m³ (28 d), Formaldehyd, CMR-Grenzwerte nach Hea 02 Tabelle.", ev: [N.AGBB] }],
    EUTAX: [{ crit: "DNSH Verschmutzung", rel: "hoch", grp: "Bauteile mit möglichem Kontakt zu Nutzern", req: "Formaldehyd < 0,06 mg/m³, CMR-1A/1B-VOC < 0,001 mg/m³; keine Anlage-C-Stoffe (Phthalate DEHP/DBP/BBP!).", ev: [N.AGBB, N.SVHC] }],
    BNB: [{ crit: "1.1.6", rel: "hoch", grp: "Bodenbeläge", req: "Emissionsarm, keine SVHC-Weichmacher.", ev: [N.AGBB, N.BE] },
          { crit: "3.1.3", rel: "hoch", grp: "Innenraum", req: "Raumluftmessung.", ev: [N.AGBB] }]
  }),

  mineralisch: (grp) => ({
    DGNB: [{ crit: "ENV1.2", rel: "gering", grp: "nicht in Kriterienmatrix ENV1.2 (mineralische Massivbaustoffe)", req: "Keine spezifische Schadstoffanforderung; Zusatzmittel/Beschichtungen separat prüfen.", ev: [N.SDB] }],
    QNG: [{ crit: "3.1.4", rel: "gering", grp: "nicht gelistet", req: "Keine Schadstoffanforderung an mineralische Massivbaustoffe.", ev: [] }],
    LEED: [{ crit: "MRc Sourcing", rel: "mittel", grp: "Concrete / masonry", req: "Recyclinganteil (z. B. Hüttensand, Flugasche, RC-Gesteinskörnung) zählt für Responsible Extraction; regionale Herkunft (≤ 160 km) mit Faktor 2.", ev: [N.RECYC] },
           { crit: "MRc Ingredients", rel: "gering", grp: "Concrete", req: "HPD optional.", ev: [N.HPD] }],
    BREEAM: [{ crit: "Mat 03", rel: "hoch", grp: "Concrete, brick, block", req: "Responsible Sourcing: BES 6001 / ISO 14001 des Zement- und Zuschlagslieferanten → Punkte nach Tabelle.", ev: [N.ISO14001, N.BES6001] }],
    EUTAX: [{ crit: "DNSH Verschmutzung", rel: "gering", grp: "–", req: "Keine Emissionsanforderung; nur Anlage-C-Stoffe (i. d. R. unkritisch).", ev: [N.SVHC] }],
    BNB: [{ crit: "1.1.6", rel: "gering", grp: "nicht gelistet", req: "Keine spezifische Anforderung.", ev: [] }]
  }),

  metall: (grp, freibewitterung) => ({
    DGNB: [{ crit: "ENV1.2", rel: freibewitterung ? "hoch" : "gering", grp: "Kriterienmatrix ENV1.2 – Metalle in Freibewitterung (Kupfer, Zink, Blei)", req: freibewitterung ? "Unbeschichtete Kupfer-/Zink-/Bleiflächen in Freibewitterung werden ab QS2 begrenzt bzw. ausgeschlossen (Schwermetalleintrag ins Regenwasser); Alternative: beschichtet/vorbewittert mit Nachweis, oder Regenwasserbehandlung." : "Nur bei Freibewitterung relevant.", ev: [N.TM, N.SVHC] }],
    QNG: [{ crit: "3.1.4", rel: freibewitterung ? "mittel" : "gering", grp: "Metalle Freibewitterung", req: freibewitterung ? "Begrenzung unbeschichteter Kupfer/Zink/Blei-Flächen in Freibewitterung analog DGNB." : "Keine Anforderung.", ev: [N.TM] }],
    LEED: [{ crit: "MRc Sourcing", rel: "hoch", grp: "Metals", req: "Recyclinganteil (Stahl/Alu typ. 20–90 %) zählt für Responsible Extraction; EPR-Programme.", ev: [N.RECYC] },
           { crit: "MRc Ingredients", rel: "gering", grp: "Metals", req: "HPD optional.", ev: [N.HPD] }],
    BREEAM: [{ crit: "Mat 03", rel: "hoch", grp: "Metals", req: "Responsible Sourcing: BES 6001 / ISO 14001 des Herstellers.", ev: [N.ISO14001, N.BES6001] },
             { crit: "Mat 05", rel: "mittel", grp: "Fassade / Dach", req: "Dauerhaftigkeit: Schutz exponierter Bauteile.", ev: [N.TM] }],
    EUTAX: [{ crit: "DNSH Verschmutzung", rel: "gering", grp: "–", req: "Anlage-C-Stoffe (z. B. Chrom VI in Beschichtungen, Blei) prüfen.", ev: [N.SVHC] }],
    BNB: [{ crit: "1.1.6", rel: freibewitterung ? "hoch" : "gering", grp: "Metalle Freibewitterung", req: freibewitterung ? "Begrenzung unbeschichteter Kupfer/Zink/Blei-Flächen." : "Keine Anforderung.", ev: [N.TM] }]
  }),

  abdichtung: (grp) => ({
    DGNB: [{ crit: "ENV1.2", rel: "hoch", grp: "Kriterienmatrix ENV1.2 – Bitumen / Kunststoffbahnen / Flüssigabdichtungen", req: "Bitumen: keine Lösemittel-Voranstriche (QS2+), keine Teerbestandteile; Kunststoffbahnen: PVC-Bahnen mit Phthalat-Weichmachern (SVHC) ab QS2 abgewertet, halogenfrei (EPDM/FPO/TPO) bevorzugt; Flüssigabdichtung: GISCODE, kein Lösemittel.", ev: [N.SDB, N.TM, N.GISCODE, N.SVHC] }],
    QNG: [{ crit: "3.1.4", rel: "mittel", grp: "QNG Anlage 3 – Abdichtungen / Bitumen", req: "Lösemittelfreie Voranstriche und Kleber; keine SVHC-Weichmacher.", ev: [N.SDB, N.GISCODE] }],
    LEED: [{ crit: "EQc LowEmit", rel: "gering", grp: "außerhalb Luftdichtheitsebene → nicht in Low-Emitting", req: "Nur bei Anwendung innerhalb der Gebäudehülle (Innenseite) relevant.", ev: [] },
           { crit: "MRc Ingredients", rel: "gering", grp: "Roofing", req: "HPD optional.", ev: [N.HPD] }],
    BREEAM: [{ crit: "Mat 03", rel: "mittel", grp: "Roofing / waterproofing", req: "Responsible Sourcing ISO 14001.", ev: [N.ISO14001] },
             { crit: "Mat 05", rel: "mittel", grp: "Dach", req: "Dauerhaftigkeit / Lebensdauer.", ev: [N.TM] }],
    EUTAX: [{ crit: "DNSH Verschmutzung", rel: "mittel", grp: "–", req: "Anlage-C-Stoffe: Phthalate (DEHP/DBP/BBP/DIBP), PAK in Bitumen, chlorierte Paraffine ausgeschlossen.", ev: [N.SVHC, N.SDB] }],
    BNB: [{ crit: "1.1.6", rel: "hoch", grp: "Bitumen / Kunststoffbahnen", req: "Analog DGNB: lösemittelfrei, halogenfrei bevorzugt.", ev: [N.SDB, N.GISCODE] }]
  })
};

// ---- Merge-Helfer ----------------------------------------------------------------------------------
function merge(...blocks) {
  const out = {};
  for (const b of blocks) for (const sys of Object.keys(b)) {
    out[sys] = (out[sys] || []).concat(b[sys]);
  }
  return out;
}

// ---- Materialgruppen -------------------------------------------------------------------------------
const materials = [
  {
    id: "mineralwolle", name: "Mineralwolle-Dämmung (Glas-/Steinwolle)", cat: "Dämmstoffe",
    aliases: ["mineralwolle", "steinwolle", "glaswolle", "mw", "rockwool", "isover", "knauf insulation", "mineralfaser", "dämmwolle", "wdvs mineralwolle"],
    summary: "Nicht brennbar, recyclingfähig (Rücknahmesysteme), keine Treibmittel; Schadstoffthema ist Biopersistenz der Fasern (heute unkritisch mit EUCEB/RAL) und Bindemittel (Formaldehyd-Harze vs. formaldehydfrei).",
    map: merge(lcaBlock("Dämmstoffe"), S.daemmstoff(), circBlock("Dämmstoffe", "Mechanisch befestigte MW ist sortenrein rückbaubar; verklebt im WDVS nicht."))
  },
  {
    id: "eps", name: "EPS-Dämmung (Styropor)", cat: "Dämmstoffe",
    aliases: ["eps", "styropor", "polystyrol", "expandiertes polystyrol", "neopor", "wdvs eps", "styrodur eps"],
    summary: "Günstig, gute Ökobilanz je Dämmleistung, aber fossil; Schadstoffthema: Flammschutz HBCD (seit 2016 verboten → PolyFR), Recycling im WDVS-Verbund schwierig.",
    map: merge(lcaBlock("Dämmstoffe"), S.daemmstoff(), circBlock("Dämmstoffe", "Im WDVS verklebt → Verbund, Rückbau nur als Mischabfall; lose Platten recyclingfähig."))
  },
  {
    id: "xps", name: "XPS-Dämmung (extrudiertes Polystyrol)", cat: "Dämmstoffe",
    aliases: ["xps", "styrodur", "extrudiertes polystyrol", "perimeterdämmung", "jackodur", "austrotherm xps"],
    summary: "Druckfest, feuchteunempfindlich (Perimeter/Umkehrdach). Kritisch: Treibmittel (früher HFKW, heute CO₂), Flammschutz (HBCD-Verbot).",
    map: merge(lcaBlock("Dämmstoffe"), S.daemmstoff(), circBlock("Dämmstoffe"))
  },
  {
    id: "pur", name: "PUR/PIR-Dämmung", cat: "Dämmstoffe",
    aliases: ["pur", "pir", "polyurethan", "polyisocyanurat", "pu-dämmung", "puren", "bauder pir", "kingspan"],
    summary: "Höchste Dämmleistung je cm; Ökobilanz im Mittelfeld; Treibmittel (Pentan statt HFKW) und Flammschutz (TCPP) sind die Schadstoffthemen; nicht recyclingfähig (nur thermisch).",
    map: merge(lcaBlock("Dämmstoffe"), S.daemmstoff(), circBlock("Dämmstoffe", "Kein stoffliches Recycling etabliert → Abwertung in Kreislaufkriterien."))
  },
  {
    id: "holzfaser", name: "Holzfaserdämmung", cat: "Dämmstoffe",
    aliases: ["holzfaser", "holzfaserdämmplatte", "holzfaserplatte", "steico", "gutex", "pavatex", "hfd", "holzweichfaser"],
    summary: "Nachwachsend, CO₂-Speicher (biogener Kohlenstoff → negativer GWP-Anteil in A1–A3), diffusionsoffen; Schadstoffthema nur Bindemittel (PMDI) und ggf. Flammschutz (Ammoniumphosphat).",
    map: merge(lcaBlock("Dämmstoffe (nachwachsend)"), S.daemmstoff(), circBlock("Dämmstoffe"), {
      DGNB: [{ crit: "ENV1.3", rel: "mittel", grp: "Holz und Holzwerkstoffe", req: "Holzfasern aus zertifizierter Forstwirtschaft (FSC/PEFC) zählen zum Holzanteil.", ev: [N.FSC] }],
      QNG: [{ crit: "3.1.3", rel: "mittel", grp: "Holz", req: "Nachhaltige Materialgewinnung – FSC/PEFC-Nachweis für Holzanteil.", ev: [N.FSC] }],
      LEED: [{ crit: "MRc Sourcing", rel: "mittel", grp: "Bio-based / wood", req: "FSC oder Bio-based (USDA/EN 16785) zählt für Responsible Extraction.", ev: [N.FSC] }]
    })
  },
  {
    id: "zellulose", name: "Zellulose-Einblasdämmung", cat: "Dämmstoffe",
    aliases: ["zellulose", "zellulosedämmung", "einblasdämmung", "isocell", "isofloc", "climacell", "papierdämmung"],
    summary: "Recyclingpapier, sehr gute Ökobilanz; Schadstoffthema: Borsalze/Ammoniumphosphat als Flammschutz (Borsäure ist SVHC – Produktwahl!).",
    map: merge(lcaBlock("Dämmstoffe (Recycling)"), S.daemmstoff(), circBlock("Dämmstoffe", "Lose Einblasdämmung ist absaugbar und wiederverwendbar."), {
      DGNB: [{ crit: "ENV1.2", rel: "hoch", grp: "Zusatz: Flammschutzmittel", req: "Borsäure/Borate sind auf der SVHC-Kandidatenliste → ab QS2 nur borfreie Produkte.", ev: [N.SDB, N.SVHC] }]
    })
  },
  {
    id: "beton", name: "Beton / Stahlbeton (Transportbeton)", cat: "Massivbau",
    aliases: ["beton", "stahlbeton", "transportbeton", "ortbeton", "c25/30", "c30/37", "fertigteil", "betonfertigteil", "bodenplatte", "decke stahlbeton"],
    summary: "Größter GWP-Posten im Rohbau (Zementklinker). Hebel: CEM II/III, Klinker-reduzierte Zemente, RC-Gesteinskörnung, schlanke Bauteile. Schadstoffseitig unkritisch.",
    map: merge(lcaBlock("Massivbaustoffe (Tragwerk)"), S.mineralisch(), circBlock("Massivbau", "Beton als RC-Gesteinskörnung verwertbar (Downcycling); Bewehrung sortenrein recycelbar."), {
      DGNB: [{ crit: "ENV1.3", rel: "mittel", grp: "Recyclingbeton", req: "Einsatz von RC-Gesteinskörnung (Typ 1/2 nach DIN 4226-101) wird in ENV1.3 honoriert.", ev: [N.RECYC, N.TM] }],
      QNG: [{ crit: "3.1.1", rel: "hoch", grp: "Tragwerk", req: "Beton dominiert das GWP-Budget (24/20 kg CO₂e/m²a) – CEM III / RC-Beton oft entscheidend für Einhaltung.", ev: [N.EPD] }]
    })
  },
  {
    id: "mauerwerk", name: "Mauerwerk (Ziegel / Kalksandstein / Porenbeton)", cat: "Massivbau",
    aliases: ["ziegel", "mauerziegel", "poroton", "kalksandstein", "ks", "porenbeton", "ytong", "gasbeton", "mauerwerk", "hochlochziegel", "planziegel", "unipor", "wienerberger"],
    summary: "Mineralisch, langlebig, schadstoffseitig unkritisch. GWP: Ziegel (Brennenergie) > KS ≈ Porenbeton; gefüllte Ziegel (Perlit/MW) sind Verbund → Kreislauf-Abwertung.",
    map: merge(lcaBlock("Massivbaustoffe (Wand)"), S.mineralisch(), circBlock("Mauerwerk", "Mörtel-Verbund: nur als Bauschutt/RC-Körnung verwertbar; Dämmstoff-gefüllte Ziegel schwer trennbar."))
  },
  {
    id: "kvh", name: "Konstruktionsvollholz / Brettschichtholz / Brettsperrholz", cat: "Holzbau",
    aliases: ["kvh", "konstruktionsvollholz", "bsh", "brettschichtholz", "bsp", "brettsperrholz", "clt", "leimholz", "holzrahmenbau", "holzbau", "vollholz", "bauholz", "massivholz", "x-lam", "binderholz"],
    summary: "CO₂-Speicher, nachwachsend, oft beste Ökobilanz im Tragwerk. Themen: Klebstoff (PU/MUF – Formaldehyd), Herkunft (FSC/PEFC), chemischer Holzschutz (in Innenräumen unzulässig).",
    map: merge(lcaBlock("Holzbau (Tragwerk)"), S.holzwerkstoff(), circBlock("Holzbau", "Geschraubte Holzbauteile sind demontierbar/wiederverwendbar → hohe Bewertung."))
  },
  {
    id: "osb", name: "OSB / Spanplatte / MDF (Holzwerkstoffplatten)", cat: "Holzbau",
    aliases: ["osb", "osb-platte", "spanplatte", "mdf", "hdf", "holzwerkstoffplatte", "grobspanplatte", "beplankung osb", "egger", "kronospan", "swiss krono", "sperrholz", "multiplex"],
    summary: "Formaldehyd ist DAS Thema: E1 ist Mindeststandard, E05 / formaldehydfreie Verleimung (PMDI) für alle höheren Qualitätsstufen.",
    map: merge(lcaBlock("Holzwerkstoffe"), S.holzwerkstoff(), circBlock("Holzwerkstoffe", "Thermische Verwertung typisch; Wiederverwendung selten."))
  },
  {
    id: "gipskarton", name: "Gipskartonplatte / Gipsfaserplatte", cat: "Trockenbau",
    aliases: ["gipskarton", "gkb", "gkf", "gipsplatte", "rigips", "knauf platte", "fermacell", "gipsfaser", "gipsfaserplatte", "trockenbau", "gk", "gipskartonplatte"],
    summary: "Schadstoffseitig unkritisch (bei REA-Gips ggf. Herkunft prüfen); Recycling über Rücknahmesysteme möglich; GWP moderat.",
    map: merge(lcaBlock("Trockenbau"), S.mineralisch(), circBlock("Trockenbau", "Geschraubt → sortenrein rückbaubar; Gipsrecycling (z. B. Rücknahme durch Hersteller) vorhanden."), {
      LEED: [{ crit: "EQc LowEmit", rel: "mittel", grp: "Wall panels", req: "Gipsplatten fallen in Kategorie ‚Wall Panels‘ – General Emissions (CDPH/EN 16516), ≥ 75 % konform.", ev: [N.CDPH, N.AGBB] }],
      BREEAM: [{ crit: "Hea 02", rel: "gering", grp: "Wall panels", req: "Emissionsanforderung gering, Nachweis über Herstellerprüfbericht.", ev: [N.AGBB] }]
    })
  },
  {
    id: "innenfarbe", name: "Innenwandfarbe (Dispersionsfarbe / Silikatfarbe)", cat: "Beschichtungen",
    aliases: ["innenfarbe", "wandfarbe", "dispersionsfarbe", "dispersion", "silikatfarbe", "innenwandfarbe", "anstrich innen", "caparol", "brillux", "sto farbe", "keim", "alpina", "deckenfarbe", "farbe innen"],
    summary: "Meist emissionsarm verfügbar (Blauer Engel DE-UZ 102, ELF). Prüfen: Konservierungsmittel (Isothiazolinone MIT/BIT), Titandioxid-Klassifizierung, VOC-Gehalt.",
    map: merge(lcaBlock("Beschichtungen"), S.beschichtung("Innenfarbe", false))
  },
  {
    id: "holzlack", name: "Lack / Lasur / Holzöl (Innen- und Außenbeschichtung Holz)", cat: "Beschichtungen",
    aliases: ["lack", "lasur", "holzlasur", "holzöl", "hartwachsöl", "parkettlack", "parkettöl", "klarlack", "buntlack", "acryllack", "osmo", "remmers", "holzschutzlasur", "dickschichtlasur", "beschichtung holz"],
    summary: "Innen: wasserbasiert / lösemittelarm (Blauer Engel DE-UZ 12a), Parkettlacke oft EMICODE. Außen: Biozide (Filmschutz) sind das Schadstoffthema, Auswaschung → ENV1.2.",
    map: merge(lcaBlock("Beschichtungen"), S.beschichtung("Lack/Lasur", true), {
      DGNB: [{ crit: "ENV1.2", rel: "hoch", grp: "Zusatz: Holzschutz außen", req: "Chemischer Holzschutz (Biozidprodukte) nur bei konstruktiv nicht vermeidbarer Exposition; Wirkstoffe nach Biozid-VO deklarieren; QS3/4 biozidfrei.", ev: [N.BIOZID, N.SDB] }]
    })
  },
  {
    id: "fassadenputz", name: "Fassadenputz / Fassadenfarbe (Silikonharz, Silikat, mineralisch)", cat: "Beschichtungen",
    aliases: ["fassadenputz", "fassadenfarbe", "außenputz", "oberputz", "silikonharzputz", "silikatputz", "mineralputz", "kratzputz", "wdvs putz", "reibeputz", "sto putz", "fassade anstrich"],
    summary: "Kern-Thema: Filmkonservierer/Biozide (Terbutryn, OIT, DCOIT, Zinkpyrithion) gegen Algen/Pilze → Auswaschung in Boden/Gewässer. Mineralische/silikatische Systeme ohne Biozid sind bevorzugt.",
    map: merge(lcaBlock("Beschichtungen außen / Putze"), {
      DGNB: [{ crit: "ENV1.2", rel: "hoch", grp: "Kriterienmatrix ENV1.2 – Biozide in Fassadenbeschichtungen / Putzen", req: "QS1: Biozidprodukt deklariert; QS2: eingekapselte Biozide; QS3/4: biozidfreie Fassadenbeschichtung (mineralisch/silikatisch, konstruktiver Schutz). Zusätzlich VOC-Gehalt nach Decopaint.", ev: [N.BIOZID, N.SDB, N.TM, N.VOCCONT] }],
      QNG: [{ crit: "3.1.4", rel: "hoch", grp: "QNG Anlage 3 – Fassadenbeschichtungen", req: "Keine Filmkonservierer mit Auswaschrisiko bzw. Nachweis eingekapselter Wirkstoffe; VOC-arm.", ev: [N.BIOZID, N.SDB] }],
      LEED: [{ crit: "EQc LowEmit", rel: "gering", grp: "Exterior – nicht erfasst", req: "Außenbeschichtungen sind in v4.1 Low-Emitting nur bei ‚Exterior applied products‘-Option relevant (VOC-Gehalt).", ev: [N.VOCCONT] }],
      BREEAM: [{ crit: "Hea 02", rel: "gering", grp: "Exterior – nicht erfasst", req: "Hea 02 betrifft Innenraum; Mat 03 Responsible Sourcing möglich.", ev: [N.ISO14001] }],
      EUTAX: [{ crit: "DNSH Verschmutzung", rel: "mittel", grp: "–", req: "Anlage-C-Stoffe prüfen (bestimmte Biozidwirkstoffe, SVHC).", ev: [N.SVHC, N.SDB] }],
      BNB: [{ crit: "1.1.6", rel: "hoch", grp: "Fassade / Biozide", req: "Analog DGNB: Biozidfreiheit in höheren QS.", ev: [N.BIOZID] }]
    })
  },
  {
    id: "bodenkleber", name: "Bodenbelagsklebstoff / Parkettklebstoff", cat: "Klebstoffe & Dichtstoffe",
    aliases: ["bodenkleber", "bodenbelagsklebstoff", "parkettkleber", "parkettklebstoff", "teppichkleber", "dispersionskleber", "verlegewerkstoff", "uzin", "wakol", "bostik kleber", "stauf", "sika kleber", "kleber boden", "klebstoff"],
    summary: "EMICODE EC1 PLUS ist Standard-Nachweis; lösemittelfrei (GISCODE D1 / RS10 / RE1). Zusammen mit Belag entscheidend für Raumluftmessung.",
    map: merge(lcaBlock("Verlegewerkstoffe"), S.klebstoff())
  },
  {
    id: "dichtstoff", name: "Dichtstoff (Silikon / Acryl / Hybrid-Polymer)", cat: "Klebstoffe & Dichtstoffe",
    aliases: ["dichtstoff", "silikon", "sanitärsilikon", "acryl", "acryldichtstoff", "ms-polymer", "hybrid", "fugendichtstoff", "fugenmasse", "otto chemie", "sika dichtstoff", "pu-dichtstoff", "fuge"],
    summary: "Themen: zinnorganische Katalysatoren (DBT/DOT – SVHC), Weichmacher (Phthalate), Fungizide in Sanitärsilikon, Lösemittel in PU-Dichtstoffen. EMICODE EC1 PLUS-Produkte verfügbar.",
    map: merge(lcaBlock("Dichtstoffe"), S.klebstoff(), {
      DGNB: [{ crit: "ENV1.2", rel: "hoch", grp: "Zusatz: Dichtstoffe", req: "Ab QS2 keine zinnorganischen Verbindungen (Dibutylzinn) und keine Phthalat-Weichmacher; Sanitärsilikon: Fungizid deklarieren.", ev: [N.SDB, N.SVHC] }]
    })
  },
  {
    id: "fliesenkleber", name: "Fliesenkleber / Fugenmörtel (zementär)", cat: "Klebstoffe & Dichtstoffe",
    aliases: ["fliesenkleber", "flexkleber", "fugenmörtel", "dünnbettmörtel", "pci", "sopro", "ardex", "kerakoll", "mapei", "fliesenmörtel", "epoxidfuge", "epoxi fugenmörtel"],
    summary: "Zementäre Produkte unkritisch (GISCODE ZP1, chromatarm); Epoxid-Fugen/Kleber (GISCODE RE1–RE3) sind sensibilisierend und werden in ENV1.2 abgewertet.",
    map: merge(lcaBlock("Verlegewerkstoffe"), S.klebstoff(), {
      DGNB: [{ crit: "ENV1.2", rel: "mittel", grp: "Zusatz: Epoxidharz-Produkte", req: "Epoxidharz (RE) nur GISCODE RE1/RE0 ab QS2; zementär (ZP1) ohne Einschränkung.", ev: [N.GISCODE, N.SDB] }]
    })
  },
  {
    id: "parkett", name: "Parkett / Massivholzdielen", cat: "Bodenbeläge",
    aliases: ["parkett", "fertigparkett", "mehrschichtparkett", "dielen", "holzdielen", "massivholzdielen", "landhausdiele", "eichenparkett", "stabparkett", "bauwerk", "haro", "boen"],
    summary: "Nachwachsend, langlebig, aufarbeitbar. Themen: Trägerplatte (HDF → Formaldehyd), Oberflächenbehandlung (Lack/Öl), Holzherkunft (FSC/PEFC, Tropenholz), Verlegung (Kleber!).",
    map: merge(lcaBlock("Bodenbeläge (Holz)"), S.bodenbelag("Parkett", "Trägerlage HDF: E05; Oberfläche: siehe Lack/Öl."), circBlock("Bodenbeläge", "Schwimmend verlegt → wiederverwendbar; verklebt → Verbund."), {
      DGNB: [{ crit: "ENV1.3", rel: "hoch", grp: "Holz und Holzwerkstoffe", req: "FSC/PEFC für Nutzschicht und Träger; Tropenholz nur mit FSC.", ev: [N.FSC] }],
      QNG: [{ crit: "3.1.3", rel: "hoch", grp: "Holz", req: "100 % Holz aus nachhaltiger Forstwirtschaft.", ev: [N.FSC] }],
      LEED: [{ crit: "MRc Sourcing", rel: "hoch", grp: "Wood flooring", req: "FSC-zertifiziert → Responsible Extraction.", ev: [N.FSC] }],
      BREEAM: [{ crit: "Mat 03", rel: "hoch", grp: "Timber", req: "Legalitätsnachweis Pflicht; FSC/PEFC für Punkte.", ev: [N.FSC] }],
      BNB: [{ crit: "1.1.7", rel: "hoch", grp: "Holz", req: "Zertifizierte Holzherkunft.", ev: [N.FSC] }]
    })
  },
  {
    id: "laminat", name: "Laminat / Designboden (LVT)", cat: "Bodenbeläge",
    aliases: ["laminat", "laminatboden", "lvt", "vinylboden", "designboden", "klickvinyl", "designbelag", "vinyl", "rigid vinyl", "spc"],
    summary: "Laminat: HDF-Träger (Formaldehyd) + Melaminharz; LVT: PVC mit Weichmachern (Phthalate → SVHC, ENV1.2 Abwertung wegen Halogen). Emissionsarme Varianten (Blauer Engel DE-UZ 176) vorhanden.",
    map: merge(lcaBlock("Bodenbeläge (elastisch/Laminat)"), S.bodenbelag("Laminat/LVT", "LVT (PVC): Halogenkunststoff → in QS3/QS4 abgewertet; nur phthalatfrei (DINP/DOTP) ab QS2."), circBlock("Bodenbeläge", "Klick-Systeme lose verlegt → rückbaubar."))
  },
  {
    id: "teppich", name: "Teppichboden (textiler Belag)", cat: "Bodenbeläge",
    aliases: ["teppich", "teppichboden", "textilbelag", "teppichfliese", "nadelvlies", "auslegware", "interface", "desso", "object carpet", "vorwerk teppich"],
    summary: "Themen: Rückenbeschichtung (Latex/Bitumen/PVC), Flammschutz, Fleckschutz (PFAS!), Emissionen (GUT-Signet, Blauer Engel DE-UZ 128). Teppichfliesen mit Rücknahme = Kreislauf-Plus.",
    map: merge(lcaBlock("Bodenbeläge (textil)"), S.bodenbelag("Teppich", "GUT-Signet / Blauer Engel DE-UZ 128 als Nachweis; PFAS-Fleckschutz ab QS2 ausgeschlossen."), circBlock("Bodenbeläge", "Teppichfliesen lose/haftverlegt mit Hersteller-Rücknahme (z. B. ReEntry) → gute Bewertung."), {
      LEED: [{ crit: "MRc Sourcing", rel: "mittel", grp: "Carpet", req: "Recyclinganteil im Rücken/Garn und EPR/Take-back-Programme zählen.", ev: [N.RECYC] }]
    })
  },
  {
    id: "linoleum", name: "Linoleum", cat: "Bodenbeläge",
    aliases: ["linoleum", "lino", "marmoleum", "forbo", "linoleumboden", "dlw linoleum", "gerflor lino"],
    summary: "Nachwachsende Rohstoffe (Leinöl, Kork, Jute), emissionsarm, gute Ökobilanz; Themen: Verlegekleber und Erstpflege; typische Empfehlung in DGNB-Projekten.",
    map: merge(lcaBlock("Bodenbeläge (nachwachsend)"), S.bodenbelag("Linoleum", "Meist QS4-fähig (Blauer Engel / eco-INSTITUT); Kleber EC1 PLUS wählen."), circBlock("Bodenbeläge"), {
      LEED: [{ crit: "MRc Sourcing", rel: "mittel", grp: "Bio-based", req: "Bio-based content (Leinöl, Jute, Kork) zählt für Responsible Extraction.", ev: [N.TM, N.RECYC] }]
    })
  },
  {
    id: "fliesen", name: "Keramische Fliesen / Feinsteinzeug", cat: "Bodenbeläge",
    aliases: ["fliesen", "fliese", "feinsteinzeug", "keramik", "steinzeug", "bodenfliesen", "wandfliesen", "villeroy boch fliesen", "agrob buchtal", "keramikfliesen"],
    summary: "Emissionsfrei, langlebig; GWP hoch (Brennprozess), Herkunft (Transport, Asien) relevant; Kreislauf: nur Downcycling wegen Mörtelverbund.",
    map: merge(lcaBlock("Bodenbeläge (keramisch)"), S.mineralisch(), circBlock("Bodenbeläge", "Verklebt → nicht zerstörungsfrei rückbaubar."), {
      LEED: [{ crit: "EQc LowEmit", rel: "gering", grp: "Flooring – inherently non-emitting (Ceramic)", req: "Keramik gilt als ‚inherently non-emitting‘ → ohne Prüfung konform (nur Kleber/Fuge prüfen).", ev: [] }],
      BREEAM: [{ crit: "Hea 02", rel: "gering", grp: "Flooring – ceramic", req: "Keine Emissionsprüfung nötig; Verlegewerkstoffe prüfen.", ev: [] }]
    })
  },
  {
    id: "estrich", name: "Estrich (Zement- / Calciumsulfat-Fließestrich)", cat: "Massivbau",
    aliases: ["estrich", "zementestrich", "fließestrich", "calciumsulfatestrich", "anhydritestrich", "ce", "cae", "heizestrich", "trockenestrich", "knauf estrich"],
    summary: "Mineralisch, unkritisch; Fließmittel/Zusatzmittel per SDB prüfen. Kunstharzestriche (Epoxid) fallen unter Klebstoff/Epoxid-Regeln.",
    map: merge(lcaBlock("Estrich"), S.mineralisch(), circBlock("Estrich", "Verbund mit Dämmung/Belag → Rückbau als Bauschutt."))
  },
  {
    id: "fenster", name: "Fenster (Holz / Holz-Alu / Kunststoff / Alu)", cat: "Hülle & Ausbau",
    aliases: ["fenster", "holzfenster", "kunststofffenster", "pvc-fenster", "alufenster", "holz-alu-fenster", "fensterelement", "schüco", "internorm", "veka", "wärmeschutzverglasung", "pfosten-riegel"],
    summary: "Ökobilanz je nach Rahmenmaterial (Holz < PVC < Alu, Alu mit RC-Anteil besser); Schadstoffthemen: PVC-Stabilisatoren (Blei-Verbot seit 2015 → Ca/Zn), Holzschutz/Lasur, Dichtstoffe. Kreislauf: Glas/Rahmen trennbar.",
    map: merge(lcaBlock("Fenster / Fassadenelemente"), circBlock("Fenster", "Als Element demontierbar; PVC-Rahmen-Recycling (Rewindo) und Alu-Recycling etabliert."), {
      DGNB: [{ crit: "ENV1.2", rel: "mittel", grp: "Kriterienmatrix ENV1.2 – Holz (Fenster) / Kunststoffe / Dichtstoffe", req: "Holzfenster: FSC/PEFC + biozidarme Beschichtung; PVC: bleifrei stabilisiert, RC-Anteil; Dichtstoffe/Fugenbänder nach Dichtstoff-Regeln.", ev: [N.FSC, N.SDB, N.TM] },
             { crit: "ENV1.3", rel: "mittel", grp: "Holz", req: "Holzrahmen aus zertifizierter Forstwirtschaft.", ev: [N.FSC] },
             { crit: "TEC1.3", rel: "mittel", grp: "Gebäudehülle", req: "Uw-Wert, Luftdichtheit, Wärmebrücken – Fensterqualität geht direkt ein.", ev: [N.DoP, N.TM] }],
      QNG: [{ crit: "3.1.3", rel: "mittel", grp: "Holz", req: "Holzfenster: FSC/PEFC.", ev: [N.FSC] },
            { crit: "3.1.4", rel: "gering", grp: "–", req: "Nur Beschichtung/Dichtstoff relevant.", ev: [N.SDB] }],
      LEED: [{ crit: "MRc Sourcing", rel: "mittel", grp: "Windows", req: "FSC-Holz oder RC-Anteil Alu/PVC zählt.", ev: [N.FSC, N.RECYC] },
             { crit: "MRc Ingredients", rel: "gering", grp: "Windows", req: "HPD optional.", ev: [N.HPD] }],
      BREEAM: [{ crit: "Mat 03", rel: "mittel", grp: "Windows", req: "Responsible Sourcing (FSC/ISO 14001).", ev: [N.FSC, N.ISO14001] },
               { crit: "Mat 05", rel: "mittel", grp: "Hülle", req: "Dauerhaftigkeit exponierter Bauteile.", ev: [N.TM] }],
      EUTAX: [{ crit: "DNSH Verschmutzung", rel: "gering", grp: "–", req: "Anlage-C-Stoffe (Blei in PVC, Phthalate in Dichtungen) prüfen.", ev: [N.SVHC] }],
      BNB: [{ crit: "1.1.6", rel: "mittel", grp: "Fenster", req: "Analog DGNB.", ev: [N.SDB] }, { crit: "1.1.7", rel: "mittel", grp: "Holz", req: "Holzherkunft.", ev: [N.FSC] }]
    })
  },
  {
    id: "bitumenbahn", name: "Bitumenbahn (Dachabdichtung)", cat: "Abdichtung & Dach",
    aliases: ["bitumen", "bitumenbahn", "bitumenschweißbahn", "schweißbahn", "dachbahn bitumen", "elastomerbitumen", "polymerbitumen", "bauder bitumen", "vedag", "dachpappe", "voranstrich"],
    summary: "Fossil, aber langlebig und gut verfügbar; Themen: lösemittelhaltige Voranstriche (→ lösemittelfrei), Teer/PAK (Altbestand), Wurzelschutz (Herbizid in Gründachbahnen!).",
    map: merge(lcaBlock("Dachabdichtung"), S.abdichtung(), circBlock("Dach", "Verschweißt → nur thermische Verwertung."))
  },
  {
    id: "kunststoffbahn", name: "Kunststoff-Dachbahn (EPDM / FPO-TPO / PVC)", cat: "Abdichtung & Dach",
    aliases: ["epdm", "fpo", "tpo", "pvc-bahn", "kunststoffbahn", "dachbahn kunststoff", "kunststoffdachbahn", "sika sarnafil", "firestone", "resitrix", "alwitra", "folie dach", "pvc dachbahn"],
    summary: "EPDM/FPO: halogenfrei, weichmacherfrei → in DGNB/QNG bevorzugt. PVC-Bahnen: Weichmacher (Phthalate → SVHC), Chlor → Abwertung in QS3/4.",
    map: merge(lcaBlock("Dachabdichtung"), S.abdichtung(), circBlock("Dach", "Lose verlegt/mechanisch befestigt → rückbaubar; FPO/PVC-Recycling (Roofcollect) vorhanden."))
  },
  {
    id: "metalldach", name: "Metalldach / Fassade (Kupfer / Zink / Alu / Stahl)", cat: "Abdichtung & Dach",
    aliases: ["kupfer", "kupferdach", "zink", "titanzink", "zinkblech", "rheinzink", "vmzinc", "metalldach", "stehfalz", "alufassade", "aluminium fassade", "stahlblech", "trapezblech", "sandwichpaneel", "blech", "fassadenblech"],
    summary: "Sehr langlebig, hoch recyclingfähig (Alu/Stahl/Cu > 90 %). Kritisch: unbeschichtetes Kupfer/Zink in Freibewitterung → Schwermetallabschwemmung (ENV1.2 begrenzt Flächen).",
    map: merge(lcaBlock("Metallbau"), S.metall("Metall", true), circBlock("Metallbau", "Mechanisch befestigt, sortenrein → beste Kreislaufbewertung."))
  },
  {
    id: "stahl", name: "Baustahl / Bewehrungsstahl / Stahlprofile", cat: "Massivbau",
    aliases: ["stahl", "baustahl", "bewehrung", "bewehrungsstahl", "betonstahl", "stahlträger", "hea", "ipe", "stahlprofil", "stahlbau", "s235", "s355", "bst 500"],
    summary: "GWP je nach Route: Elektrostahl (Schrott, ~0,4–0,7 t CO₂/t) vs. Hochofen (~2 t CO₂/t). Bewehrung in DE fast immer Elektrostahl. Schadstoffseitig unkritisch (Korrosionsschutz separat prüfen).",
    map: merge(lcaBlock("Tragwerk Stahl"), S.metall("Stahl", false), circBlock("Stahlbau", "Geschraubter Stahlbau wiederverwendbar; Bewehrung recycelbar."), {
      DGNB: [{ crit: "ENV1.3", rel: "mittel", grp: "Recyclingmaterial", req: "Hoher Schrottanteil (Elektroofen-Route) wird in ENV1.3 honoriert; EPD des Werks nachweisen.", ev: [N.EPD, N.RECYC] }]
    })
  },
  {
    id: "innentuer", name: "Innentür (Holz / Holzwerkstoff)", cat: "Hülle & Ausbau",
    aliases: ["innentür", "tür", "türblatt", "zimmertür", "türzarge", "zarge", "holztür", "cpl tür", "röhrenspantür", "prüm", "hörmann tür", "jeld-wen", "türelement"],
    summary: "Holzwerkstoff-Regeln (Formaldehyd E05/Blauer Engel) + Beschichtung (CPL/Lack) + Holzherkunft; ganze Elemente sind gut demontierbar.",
    map: merge(lcaBlock("Innenausbau"), S.holzwerkstoff(), circBlock("Innenausbau", "Türelemente demontierbar/wiederverwendbar."))
  },
  {
    id: "naturstein", name: "Naturstein (Granit / Marmor / Kalkstein – Boden, Fensterbank, Fassade)", cat: "Massivbau",
    aliases: ["naturstein", "granit", "marmor", "kalkstein", "schiefer", "sandstein", "fensterbank", "natursteinboden", "natursteinfassade", "werkstein", "travertin", "basalt"],
    summary: "Emissionsfrei, extrem langlebig, wiederverwendbar. Themen: Herkunft (Import Asien → Transport-GWP, Sozialstandards/Kinderarbeit → XertifiX / Fair Stone), Imprägnierung (Lösemittel, PFAS), Verlegemörtel.",
    map: merge(lcaBlock("Naturstein"), S.mineralisch(), circBlock("Naturstein", "Massive Platten sind wiederverwendbar, wenn nicht vollflächig verklebt."), {
      DGNB: [{ crit: "ENV1.3", rel: "hoch", grp: "Naturstein", req: "Naturstein aus verantwortungsvoller Gewinnung: Herkunftsnachweis + Sozialstandard-Zertifikat (XertifiX, Fair Stone, WiN=WiN) oder europäische Herkunft.", ev: ["Herkunftsnachweis (Steinbruch/Land) + XertifiX / Fair Stone-Zertifikat", N.TM] }],
      QNG: [{ crit: "3.1.3", rel: "gering", grp: "–", req: "QNG 3.1.3 betrifft nur Holz; Naturstein ohne Anforderung.", ev: [] }],
      LEED: [{ crit: "MRc Sourcing", rel: "mittel", grp: "Stone", req: "Regionale Herkunft (≤ 160 km) mit Faktor 2; Recyclinganteil i. d. R. 0.", ev: [N.TM] },
             { crit: "EQc LowEmit", rel: "gering", grp: "Flooring – inherently non-emitting (Stone)", req: "Naturstein gilt als ‚inherently non-emitting‘; nur Imprägnierung/Kleber prüfen.", ev: [] }],
      BREEAM: [{ crit: "Mat 03", rel: "hoch", grp: "Stone", req: "Responsible Sourcing: Zertifikat des Steinbruchs/Verarbeiters (ISO 14001, BES 6001, Fair Stone).", ev: [N.ISO14001, N.BES6001] }],
      BNB: [{ crit: "1.1.7", rel: "mittel", grp: "Naturstein", req: "Nachhaltige Materialgewinnung – Herkunfts- und Sozialstandardnachweis.", ev: ["Herkunftsnachweis + XertifiX / Fair Stone-Zertifikat"] }]
    })
  },
  {
    id: "wdvs", name: "WDVS (Wärmedämmverbundsystem, komplett)", cat: "Hülle & Ausbau",
    aliases: ["wdvs", "wärmedämmverbundsystem", "vollwärmeschutz", "fassadendämmung", "wdvs system", "sto therm", "weber wdvs", "brillux wdvs", "caparol capatect"],
    summary: "Systemprodukt: Dämmstoff (EPS/MW) + Kleber/Armierung + Putz + Anstrich – jede Komponente separat nach ihren Regeln prüfen. Verbund → Kreislauf-Abwertung; Biozid-Putz häufig.",
    map: merge(lcaBlock("Fassade WDVS"), S.daemmstoff(), circBlock("Fassade", "Verklebter Verbund aus Dämmung/Armierung/Putz → nicht sortenrein trennbar → niedrige Bewertung in TEC1.6 / Wst 06 / DNSH Kreislauf."), {
      DGNB: [{ crit: "ENV1.2", rel: "hoch", grp: "Zusatz: Putz/Anstrich des Systems", req: "Biozidfreie Deckschicht für QS3/4; Kleber/Armierung lösemittelfrei; Dämmstoff nach Dämmstoffregeln.", ev: [N.BIOZID, N.SDB, N.TM] }]
    })
  }
];

module.exports = { materials, N };
