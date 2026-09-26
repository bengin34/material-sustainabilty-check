// Zertifizierungssysteme und die materialrelevanten Kriterien/Credits.
// Quellen: DGNB System Gebäude Neubau 2023 (Kriterienkatalog), QNG-Handbuch / Anlage 3 (BMWSB, 2023),
// LEED v4.1 BD+C Reference Guide, BREEAM International NC 2016 / BREEAM DE, EU-Taxonomie Del. VO (EU) 2021/2139 Anhang I 7.1 + Anlage C,
// BNB Neubau Büro 2015.
module.exports = {
  DGNB: {
    id: "DGNB",
    name: "DGNB Neubau 2023",
    short: "DGNB",
    color: "#0f766e",
    url: "https://www.dgnb.de/de/zertifizierung/gebaeude/neubau",
    criteria: {
      "ENV1.1": { title: "Ökobilanz des Gebäudes", topic: "Klima / LCA", url: "https://www.dgnb.de/de/zertifizierung/gebaeude/neubau/kriterien" },
      "ENV1.2": { title: "Risiken für die lokale Umwelt (Schadstoffe)", topic: "Schadstoffe", url: "https://www.dgnb.de/de/zertifizierung/gebaeude/neubau/kriterien" },
      "ENV1.3": { title: "Verantwortungsbewusste Ressourcengewinnung", topic: "Ressourcen", url: "https://www.dgnb.de/de/zertifizierung/gebaeude/neubau/kriterien" },
      "SOC1.2": { title: "Innenraumluftqualität", topic: "Innenraumluft", url: "https://www.dgnb.de/de/zertifizierung/gebaeude/neubau/kriterien" },
      "TEC1.6": { title: "Rückbau- und Recyclingfreundlichkeit (Zirkuläres Bauen)", topic: "Kreislauf", url: "https://www.dgnb.de/de/zertifizierung/gebaeude/neubau/kriterien" },
      "TEC1.3": { title: "Qualität der Gebäudehülle", topic: "Bauphysik", url: "https://www.dgnb.de/de/zertifizierung/gebaeude/neubau/kriterien" },
      "PRO2.1": { title: "Baustelle / Bauprozess (Abfallarme Baustelle)", topic: "Bauprozess", url: "https://www.dgnb.de/de/zertifizierung/gebaeude/neubau/kriterien" }
    }
  },
  QNG: {
    id: "QNG",
    name: "QNG – Qualitätssiegel Nachhaltiges Gebäude (2023)",
    short: "QNG",
    color: "#1d4ed8",
    url: "https://www.qng.info/",
    criteria: {
      "3.1.1": { title: "Treibhausgasemissionen im Lebenszyklus", topic: "Klima / LCA", url: "https://www.qng.info/qng/qng-anforderungen/" },
      "3.1.2": { title: "Primärenergiebedarf im Lebenszyklus", topic: "Klima / LCA", url: "https://www.qng.info/qng/qng-anforderungen/" },
      "3.1.3": { title: "Nachhaltige Materialgewinnung (Holz)", topic: "Ressourcen", url: "https://www.qng.info/qng/qng-anforderungen/" },
      "3.1.4": { title: "Schadstoffvermeidung in Baumaterialien", topic: "Schadstoffe", url: "https://www.qng.info/qng/qng-anforderungen/" },
      "3.2.x": { title: "Innenraumluftqualität (Raumluftmessung, bei PLUS/PREMIUM)", topic: "Innenraumluft", url: "https://www.qng.info/qng/qng-anforderungen/" }
    }
  },
  LEED: {
    id: "LEED",
    name: "LEED v4.1 BD+C",
    short: "LEED",
    color: "#15803d",
    url: "https://www.usgbc.org/leed/v41",
    criteria: {
      "MRc EPD": { title: "Building Product Disclosure & Optimization – Environmental Product Declarations", topic: "Klima / LCA", url: "https://www.usgbc.org/credits/new-construction-core-and-shell-schools-new-construction-retail-new-construction-data-48" },
      "MRc Sourcing": { title: "BPDO – Sourcing of Raw Materials", topic: "Ressourcen", url: "https://www.usgbc.org/credits/new-construction-core-and-shell-schools-new-construction-retail-new-construction-data-49" },
      "MRc Ingredients": { title: "BPDO – Material Ingredients", topic: "Schadstoffe", url: "https://www.usgbc.org/credits/new-construction-core-and-shell-schools-new-construction-retail-new-construction-data-50" },
      "MRc LCA": { title: "Building Life-Cycle Impact Reduction", topic: "Klima / LCA", url: "https://www.usgbc.org/credits/new-construction-core-and-shell-schools-new-construction-retail-new-construction-data-47" },
      "EQc LowEmit": { title: "Low-Emitting Materials", topic: "Innenraumluft", url: "https://www.usgbc.org/credits/new-construction-core-and-shell-schools-new-construction-retail-new-construction-data-42" },
      "MRc CDWaste": { title: "Construction and Demolition Waste Management", topic: "Kreislauf", url: "https://www.usgbc.org/credits/new-construction-core-and-shell-schools-new-construction-retail-new-construction-data-51" }
    }
  },
  BREEAM: {
    id: "BREEAM",
    name: "BREEAM International NC 2016 / BREEAM DE",
    short: "BREEAM",
    color: "#7c3aed",
    url: "https://www.breeam.com/",
    criteria: {
      "Mat 01": { title: "Life cycle impacts (LCA / EPD)", topic: "Klima / LCA", url: "https://www.breeam.com/BREEAMInt2016SchemeDocument/" },
      "Mat 03": { title: "Responsible sourcing of construction products", topic: "Ressourcen", url: "https://www.breeam.com/BREEAMInt2016SchemeDocument/" },
      "Mat 05": { title: "Designing for durability and resilience", topic: "Dauerhaftigkeit", url: "https://www.breeam.com/BREEAMInt2016SchemeDocument/" },
      "Hea 02": { title: "Indoor air quality (VOC emissions)", topic: "Innenraumluft", url: "https://www.breeam.com/BREEAMInt2016SchemeDocument/" },
      "Wst 01": { title: "Construction waste management", topic: "Kreislauf", url: "https://www.breeam.com/BREEAMInt2016SchemeDocument/" },
      "Wst 06": { title: "Design for disassembly and functional adaptability", topic: "Kreislauf", url: "https://www.breeam.com/BREEAMInt2016SchemeDocument/" }
    }
  },
  EUTAX: {
    id: "EUTAX",
    name: "EU-Taxonomie – Neubau (7.1) / Renovierung (7.2)",
    short: "EU-Tax",
    color: "#b45309",
    url: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32021R2139",
    criteria: {
      "Klimaschutz (SC)": { title: "Wesentlicher Beitrag Klimaschutz – LCA-GWP (Gebäude > 5.000 m²)", topic: "Klima / LCA", url: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32021R2139" },
      "DNSH Verschmutzung": { title: "DNSH Vermeidung von Umweltverschmutzung – Anlage C (Stoffe) + Emissionsgrenzwerte", topic: "Schadstoffe", url: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32021R2139" },
      "DNSH Kreislauf": { title: "DNSH Kreislaufwirtschaft – 70 % Bauabfall-Verwertung, Rückbaubarkeit (ISO 20887)", topic: "Kreislauf", url: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32021R2139" }
    }
  },
  BNB: {
    id: "BNB",
    name: "BNB Neubau Büro/Verwaltung 2015 (Bundesbau)",
    short: "BNB",
    color: "#475569",
    url: "https://www.bnb-nachhaltigesbauen.de/",
    criteria: {
      "1.1.1": { title: "Treibhauspotenzial (GWP) – Ökobilanz", topic: "Klima / LCA", url: "https://www.bnb-nachhaltigesbauen.de/bewertungssystem/bnb-buerogebaeude/bnb-bn-2015/" },
      "1.1.6": { title: "Risiken für die lokale Umwelt", topic: "Schadstoffe", url: "https://www.bnb-nachhaltigesbauen.de/bewertungssystem/bnb-buerogebaeude/bnb-bn-2015/" },
      "1.1.7": { title: "Nachhaltige Materialgewinnung / Holz", topic: "Ressourcen", url: "https://www.bnb-nachhaltigesbauen.de/bewertungssystem/bnb-buerogebaeude/bnb-bn-2015/" },
      "3.1.3": { title: "Innenraumhygiene (Raumluft)", topic: "Innenraumluft", url: "https://www.bnb-nachhaltigesbauen.de/bewertungssystem/bnb-buerogebaeude/bnb-bn-2015/" },
      "4.1.4": { title: "Rückbau, Trennung und Verwertung", topic: "Kreislauf", url: "https://www.bnb-nachhaltigesbauen.de/bewertungssystem/bnb-buerogebaeude/bnb-bn-2015/" }
    }
  }
};
