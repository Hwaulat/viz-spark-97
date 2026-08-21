export interface InspectionRow {
  id: string;
  inspectionDate: string;
  customer: string;
  docNumber: string;
  areaGedung: string;
  partNumber: string;
  partName: string;
  type: string;
  inspectedBy: string;
  checked: "ok" | "ng" | "waiting";
}

export interface ChecksheetRow {
  itemCheck: string;
  measurement: string;
  minTol: string;
  maxTol: string;
  standard: string;
  start: string;
  middle: string;
  end: string;
}

export interface ChecksheetSection {
  title: string;
  rows: ChecksheetRow[];
}

export const INSPECTIONS: InspectionRow[] = Array.from({ length: 200 }, (_, i) => ({
  id: `DOC-${String(i + 1).padStart(6, "0")}`,
  inspectionDate: "24/06/2026",
  customer: "Customer Code - Name",
  docNumber: `DOC-${String(i + 1).padStart(6, "0")}`,
  areaGedung: `Gedung ${i % 3 + 1}`,
  partNumber: "Part Number",
  partName: "Part Name",
  type: "Type A",
  inspectedBy: "Hasan",
  checked: i < 150 ? "ok" : i < 180 ? "ng" : "waiting", // roughly matching the figma design stats
}));

export const CHECKSHEET_SECTIONS: ChecksheetSection[] = [
  {
    title: "A. DIMENSI",
    rows: [
      {
        itemCheck: "Dimensi Produk Secara Umum",
        measurement: "Bore Gaug",
        minTol: "-0.007",
        maxTol: "0.007",
        standard: "Masuk Inspection Jig dan Skala Sesuai Dengan WI",
        start: "0.002",
        middle: "0.002",
        end: "0.002",
      },
      {
        itemCheck: "Dimensi Kedalaman",
        measurement: "Visual",
        minTol: "-",
        maxTol: "-",
        standard: "Kedalaman 8 ±0.3",
        start: "OK",
        middle: "NG",
        end: "NG",
      },
    ],
  },
  {
    title: "B. WELDING QUALITY",
    rows: [
      {
        itemCheck: "Visual Welding",
        measurement: "Visual",
        minTol: "-",
        maxTol: "-",
        standard: "Standard Visual Welding",
        start: "OK",
        middle: "OK",
        end: "OK",
      },
      {
        itemCheck: "Panjang Welding",
        measurement: "Steel Ruler",
        minTol: "-0.007",
        maxTol: "0.007",
        standard: "Kedalaman 8 ±0.3",
        start: "0.002",
        middle: "0.002",
        end: "0.002",
      },
      {
        itemCheck: "Visual Welding Secara Umum",
        measurement: "Visual",
        minTol: "-",
        maxTol: "-",
        standard: "Standard Visual Welding",
        start: "OK",
        middle: "OK",
        end: "OK",
      },
    ],
  },
  {
    title: "C. KONDISI PERMUKAAN",
    rows: [
      {
        itemCheck: "Kondisi Permukaan Secara Umum",
        measurement: "Visual",
        minTol: "-",
        maxTol: "-",
        standard:
          "Tidak ada Demple, Scratch, Bergelombang atau cacat permukaan lainnya",
        start: "OK",
        middle: "OK",
        end: "OK",
      },
    ],
  },
];

export const getTrendDataForParameter = (parameter: string) => {
  const baseData = [
    { date: "01/06/2026", value: 0 },
    { date: "02/06/2026", value: 0 },
    { date: "03/06/2026", value: 0 },
    { date: "04/06/2026", value: 0 },
    { date: "05/06/2026", value: 0 },
    { date: "06/06/2026", value: 0 },
    { date: "07/06/2026", value: 0 },
    { date: "08/06/2026", value: 0 },
    { date: "09/06/2026", value: 0 },
    { date: "10/06/2026", value: 0 },
    { date: "11/06/2026", value: 0 },
    { date: "12/06/2026", value: 0 },
    { date: "13/06/2026", value: 0 },
  ];

  let seed = 0;
  for (let i = 0; i < parameter.length; i++) {
    seed += parameter.charCodeAt(i);
  }

  return baseData.map((d, i) => {
    const randomVariation = Math.sin(seed + i) * 200 + 500;
    return {
      ...d,
      value: Math.round(Math.max(100, Math.min(900, randomVariation)))
    };
  });
};
