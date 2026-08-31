import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ChevronDown, LayoutDashboard, Calendar, Droplet, Thermometer, Beaker, CheckCircle, AlertTriangle, Wrench, AlertOctagon, X } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Bar,
  BarChart,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

export const Route = createFileRoute("/checksheet")({
  head: () => ({
    meta: [
      { title: "Dashboard Checksheet — Utility Monitoring" },
      {
        name: "description",
        content: "Checksheet dashboard displaying pressure trends.",
      },
    ],
  }),
  component: DashboardChecksheet,
});

const STATION_OPTIONS_1 = [
  "Pre Degreasing",
  "Degreasing",
  "ED 1",
  "ED 2",
  "DI 1",
  "DI 2",
  "UF 1",
  "UF 2",
  "WR 5",
  "UF Module",
];

const STATION_OPTIONS_2 = ["UF Modul", "UF 1", "UF 2"];

const MONTH_OPTIONS = ["August 2026", "September 2026", "October 2026"];

// Helper to generate mock data within 0.01 - 0.025
function generatePressureData(dates: string[], seedPrefix: string) {
  return dates.map((date, i) => {
    // some pseudo-randomness based on index
    const baseIn = 0.012 + Math.abs(Math.sin(i * 12.3)) * 0.01; // between 0.012 and 0.022
    const baseOut = 0.01 + Math.abs(Math.cos(i * 5.4)) * 0.008; // between 0.01 and 0.018

    return {
      date,
      IN: Number(baseIn.toFixed(4)),
      OUT: Number(baseOut.toFixed(4)),
      standard: 0.02,
    };
  });
}

function generateWasteDisposalData(dates: string[], seedPrefix: string) {
  return dates.map((date, i) => {
    return {
      date,
      mixing: Math.floor(20 + Math.abs(Math.sin(i * 3.3)) * 80),
      mini: Math.floor(10 + Math.abs(Math.cos(i * 2.4)) * 50),
      pted: Math.floor(30 + Math.abs(Math.sin(i * 1.4)) * 70),
      standard: 70,
    };
  });
}

function generateControlPointData(dates: string[], seedPrefix: string) {
  return dates.map((date, i) => {
    const baseAlkali = 17.5 + Math.sin(i * 0.5) * 1.0;
    const baseTemp = 35 + Math.cos(i * 0.5) * 8;
    return {
      date: date.padStart(2, "0"),
      morningAlkali: Number((baseAlkali + 0.5).toFixed(1)),
      afternoonAlkali: Number((baseAlkali - 0.2).toFixed(1)),
      standardAlkali: 18.0,
      morningTemp: Math.floor(baseTemp + 2),
      afternoonTemp: Math.floor(baseTemp - 2),
      standardTemp: 40,
    };
  });
}

function generateSurfaceConditioningData(dates: string[], seedPrefix: string) {
  return dates.map((date, i) => {
    const baseAlkali = 4.0 + Math.sin(i * 0.5) * 1.0;
    const basePh = 9.5 + Math.cos(i * 0.5) * 0.5;
    return {
      date: date.padStart(2, "0"),
      morningAlkali: Number((baseAlkali + 0.2).toFixed(1)),
      afternoonAlkali: Number((baseAlkali - 0.2).toFixed(1)),
      standardAlkali: 4.5,
      morningPh: Number((basePh + 0.2).toFixed(1)),
      afternoonPh: Number((basePh - 0.2).toFixed(1)),
      standardPh: 9.8,
    };
  });
}

function generatePhosphateData(dates: string[], seedPrefix: string) {
  return dates.map((date, i) => {
    const baseTA = 21.0 + Math.sin(i * 0.6) * 1.5;
    const baseFA = 0.7 + Math.cos(i * 0.5) * 0.15;
    const baseAC = 4.0 + Math.sin(i * 0.7) * 0.8;
    const baseTemp = 35 + Math.cos(i * 0.5) * 8;
    return {
      date: date.padStart(2, "0"),
      morningTA: Number((baseTA + 0.5).toFixed(1)),
      afternoonTA: Number((baseTA - 0.3).toFixed(1)),
      standardTA: 22.0,
      morningFA: Number((baseFA + 0.05).toFixed(1)),
      afternoonFA: Number((baseFA - 0.05).toFixed(1)),
      standardFA: 0.8,
      morningAC: Number((baseAC + 0.2).toFixed(1)),
      afternoonAC: Number((baseAC - 0.2).toFixed(1)),
      standardAC: 4.5,
      morningTemp: Math.floor(baseTemp + 2),
      afternoonTemp: Math.floor(baseTemp - 2),
      standardTemp: 40,
    };
  });
}

function generateWRData(dates: string[], seedPrefix: string) {
  return dates.map((date, i) => {
    const baseWR2 = 1.3 + Math.sin(i * 0.9) * 0.4;
    const baseWR4 = 1.3 + Math.cos(i * 0.7) * 0.4;
    const baseWR5 = 0.3 + Math.sin(i * 0.8) * 0.2;
    return {
      date: date.padStart(2, "0"),
      morningWR2: Number((baseWR2 + 0.1).toFixed(1)),
      afternoonWR2: Number((baseWR2 - 0.05).toFixed(1)),
      standardWR2: 1.5,
      morningWR4: Number((baseWR4 + 0.1).toFixed(1)),
      afternoonWR4: Number((baseWR4 - 0.05).toFixed(1)),
      standardWR4: 1.5,
      morningWR5: Number((baseWR5 + 0.05).toFixed(1)),
      afternoonWR5: Number((baseWR5 - 0.05).toFixed(1)),
      standardWR5: 0.5,
    };
  });
}

const CONTROL_POINT_TABS = [
  "Pre-Degreasing",
  "Degreasing",
  "Surface Conditioning",
  "Phosphate",
  "WR 2,4,5"
];

const TABS = [
  "Cleaning Bag Filter & Control Preassure",
  "Waste Disposal",
  "Control Point",
  "Equipment Pre-Treatment",
  "Chemical CED",
  "ED Ampere",
];

const FRIDAYS_AUG_2026 = ["07 Aug", "14 Aug", "21 Aug", "28 Aug"];
const ALL_DAYS_AUG_2026 = Array.from({ length: 31 }, (_, i) => String(i + 1));

const EQUIPMENT_PT_STATION_OPTIONS = [
  "Flood",
  "Pre Degreasing",
  "Degreasing",
  "Surface Conditioning",
  "Phosphate 1",
  "Phosphate 2",
  "WR 1 & 2",
  "WR 3 & 4",
  "WR 5",
];

interface EquipmentProblemRow {
  equipmentName: string;
  freq: string;
  standard: string;
  value: string;
  valueColor: string;
  problem: string;
  followUpProblem: string;
  followUpColor: string;
  countermeasure: string;
  countermeasureBy: string;
}

const EQUIPMENT_NAMES_BY_STATION: Record<string, string[]> = {
  "Flood": [
    "Tanki & Pipa",
    "Pompa Flood Water Spray (Pus-111)",
    "Tekanan Spray Flood Water (PRG-111C & PRG-1114)",
    "Heat Exchanger 1",
    "Heat Exchanger 2",
    "Tekanan How Water Inlet",
    "Pressure difference Liquid Inlet & Outlet (Hexc)",
    "Spray Nozzle",
    "Strainer Mesh",
  ],
  "Pre Degreasing": [
    "Tanki & Pipa",
    "Pompa Sirkulasi",
    "Heater Element",
    "Temperature Controller",
    "Spray Nozzle",
    "Strainer Mesh",
    "Level Sensor",
  ],
  "Degreasing": [
    "Tanki & Pipa",
    "Pompa Sirkulasi",
    "Heater Element",
    "Temperature Controller",
    "Spray Nozzle",
    "Strainer Mesh",
    "Oil Skimmer",
    "Level Sensor",
  ],
  "Surface Conditioning": [
    "Tanki & Pipa",
    "Pompa Sirkulasi",
    "Agitator Motor",
    "Spray Nozzle",
    "Strainer Mesh",
    "Level Sensor",
  ],
  "Phosphate 1": [
    "Tanki & Pipa",
    "Pompa Sirkulasi",
    "Heater Element",
    "Temperature Controller",
    "Spray Nozzle",
    "Strainer Mesh",
    "Sludge Filter",
    "Level Sensor",
  ],
  "Phosphate 2": [
    "Tanki & Pipa",
    "Pompa Sirkulasi",
    "Heater Element",
    "Temperature Controller",
    "Spray Nozzle",
    "Strainer Mesh",
    "Sludge Filter",
    "Level Sensor",
  ],
  "WR 1 & 2": [
    "Tanki & Pipa",
    "Pompa Sirkulasi",
    "Spray Nozzle",
    "Strainer Mesh",
    "Conductivity Meter",
    "Level Sensor",
  ],
  "WR 3 & 4": [
    "Tanki & Pipa",
    "Pompa Sirkulasi",
    "Spray Nozzle",
    "Strainer Mesh",
    "Conductivity Meter",
    "Level Sensor",
  ],
  "WR 5": [
    "Tanki & Pipa",
    "Pompa Sirkulasi",
    "Spray Nozzle",
    "Strainer Mesh",
    "DI Water Supply",
    "Level Sensor",
  ],
};

const STANDARDS = [
  "Tidak ada kebocoran (Normal)",
  "Suara normal, getaran normal, tidak ada kebocoran, panas motor normal",
  "0.09 MPa - 0.16 MPa",
  "Tidak ada kebocoran, getaran normal",
  "Diatas 0.20 MPa",
  "> 60°C",
  "Dibawah 0.05 MPa",
  "Tidak tersumbat, sudut normal (Standard)",
];

const FOLLOW_UPS = ["None", "Maintenance", "Painting", "Cleaning", "Replacement"];
const FOLLOW_UP_COLORS: Record<string, string> = {
  "None": "bg-gray-100 text-gray-600",
  "Maintenance": "bg-orange-100 text-orange-600",
  "Painting": "bg-red-100 text-red-600",
  "Cleaning": "bg-blue-100 text-blue-600",
  "Replacement": "bg-purple-100 text-purple-600",
};

function generateEquipmentData(station: string, month: string): EquipmentProblemRow[] {
  const names = EQUIPMENT_NAMES_BY_STATION[station] || EQUIPMENT_NAMES_BY_STATION["Flood"];
  const seed = station.length + month.length;

  return names.map((name, i) => {
    const hash = Math.abs(Math.sin((seed + i) * 13.7 + i * 5.3));
    const statusRand = hash;
    let value: string;
    let valueColor: string;

    if (statusRand < 0.55) {
      value = "OK";
      valueColor = "text-green-500";
    } else if (statusRand < 0.75) {
      value = "NG";
      valueColor = "text-red-500";
    } else {
      value = "REPAIR";
      valueColor = "text-orange-500";
    }

    // Numeric values for some items
    const numericHash = Math.abs(Math.cos((seed + i) * 7.1));
    if (i === 2 || i === 5 || i === 6 || i === 7) {
      const numVal = (numericHash * 0.3 + 0.02).toFixed(2);
      value = numVal;
      valueColor = numericHash > 0.5 ? "text-green-500" : "text-orange-500";
    }
    if (i === 5) {
      const tempVal = Math.floor(numericHash * 40 + 20);
      value = `${tempVal}°C`;
      valueColor = tempVal > 60 ? "text-green-500" : "text-orange-500";
    }

    const hasProblem = statusRand > 0.5;
    const problemNames = ["Problem A", "Problem B", "Problem C"];
    const problem = hasProblem ? problemNames[i % 3] : "-";

    const followUpIdx = hasProblem ? (i % (FOLLOW_UPS.length - 1)) + 1 : 0;
    const followUp = FOLLOW_UPS[followUpIdx];

    const countermeasures = ["Counter Measure A", "Counter Measure B", "Counter Measure C"];
    const counterPersons = ["Hasan", "Andre", "Budi", "Rini"];

    return {
      equipmentName: name,
      freq: "1 x 1 Shift",
      standard: STANDARDS[i % STANDARDS.length],
      value,
      valueColor,
      problem,
      followUpProblem: followUp,
      followUpColor: FOLLOW_UP_COLORS[followUp],
      countermeasure: hasProblem ? countermeasures[i % 3] : "-",
      countermeasureBy: hasProblem ? counterPersons[i % 4] : "-",
    };
  });
}

function generateEquipmentTrendData(station: string, month: string) {
  const seed = station.length * 3 + month.length * 7;
  return Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    const hash1 = Math.abs(Math.sin((seed + day) * 2.7));
    const hash2 = Math.abs(Math.cos((seed + day) * 3.1));

    const total = Math.floor(5 + hash1 * 8);
    const ng = Math.floor(hash2 * 3);
    const repair = Math.floor(Math.abs(Math.sin((seed + day) * 5.3)) * 2);
    const ok = Math.max(0, total - ng - repair);

    return {
      date: String(day),
      OK: ok,
      NG: ng,
      Repair: repair,
    };
  });
}

const CHEMICAL_CED_STATION_OPTIONS = [
  "Anolyte Tank",
  "Catholyte Tank",
  "ED Tank",
  "UF Tank",
  "DI Tank",
  "Rinse Tank 1",
  "Rinse Tank 2",
  "Oven Curing",
];

const CHEMICAL_CED_NAMES_BY_STATION: Record<string, string[]> = {
  "Anolyte Tank": [
    "Tanki & Pipa",
    "Pompa Sirkulasi Anolyte",
    "Conductivity Meter",
    "pH Meter",
    "Temperature Sensor",
    "Level Sensor",
    "Filter Bag",
  ],
  "Catholyte Tank": [
    "Tanki & Pipa",
    "Pompa Sirkulasi Catholyte",
    "Conductivity Meter",
    "pH Meter",
    "Temperature Sensor",
    "Level Sensor",
    "Filter Bag",
  ],
  "ED Tank": [
    "Tanki & Pipa",
    "Pompa Sirkulasi ED",
    "Rectifier",
    "Agitator Motor",
    "Temperature Controller",
    "Conductivity Meter",
    "pH Meter",
    "Filter Bag",
    "Level Sensor",
  ],
  "UF Tank": [
    "Tanki & Pipa",
    "Pompa UF",
    "UF Membrane",
    "Pressure Gauge IN",
    "Pressure Gauge OUT",
    "Flow Meter",
    "Level Sensor",
  ],
  "DI Tank": [
    "Tanki & Pipa",
    "Pompa DI",
    "DI Resin",
    "Conductivity Meter",
    "Pressure Gauge",
    "Level Sensor",
  ],
  "Rinse Tank 1": [
    "Tanki & Pipa",
    "Pompa Sirkulasi",
    "Spray Nozzle",
    "Conductivity Meter",
    "Level Sensor",
    "Strainer Mesh",
  ],
  "Rinse Tank 2": [
    "Tanki & Pipa",
    "Pompa Sirkulasi",
    "Spray Nozzle",
    "Conductivity Meter",
    "Level Sensor",
    "Strainer Mesh",
  ],
  "Oven Curing": [
    "Burner Unit",
    "Blower Motor",
    "Temperature Controller",
    "Thermocouple",
    "Exhaust Fan",
    "Conveyor Chain",
    "Safety Valve",
  ],
};

const CED_STANDARDS = [
  "Tidak ada kebocoran (Normal)",
  "Suara normal, getaran normal",
  "Sesuai parameter setting",
  "Tidak ada kerusakan, fungsi normal",
  "Dalam range standar operasi",
  "Tekanan stabil sesuai standar",
  "Tidak tersumbat (Normal)",
  "Flow rate sesuai standar",
];

function generateChemicalCEDData(station: string, month: string): EquipmentProblemRow[] {
  const names = CHEMICAL_CED_NAMES_BY_STATION[station] || CHEMICAL_CED_NAMES_BY_STATION["Anolyte Tank"];
  const seed = station.length * 2 + month.length * 3;

  return names.map((name, i) => {
    const hash = Math.abs(Math.sin((seed + i) * 11.3 + i * 7.1));
    let value: string;
    let valueColor: string;

    if (hash < 0.55) {
      value = "OK";
      valueColor = "text-green-500";
    } else if (hash < 0.75) {
      value = "NG";
      valueColor = "text-red-500";
    } else {
      value = "REPAIR";
      valueColor = "text-orange-500";
    }

    const numericHash = Math.abs(Math.cos((seed + i) * 9.3));
    if (i === 2 || i === 4 || i === 5) {
      const numVal = (numericHash * 0.5 + 0.1).toFixed(2);
      value = numVal;
      valueColor = numericHash > 0.5 ? "text-green-500" : "text-orange-500";
    }

    const hasProblem = hash > 0.5;
    const problemNames = ["Problem A", "Problem B", "Problem C"];
    const problem = hasProblem ? problemNames[i % 3] : "-";

    const followUpIdx = hasProblem ? (i % (FOLLOW_UPS.length - 1)) + 1 : 0;
    const followUp = FOLLOW_UPS[followUpIdx];

    const countermeasures = ["Counter Measure A", "Counter Measure B", "Counter Measure C"];
    const counterPersons = ["Hasan", "Andre", "Budi", "Rini"];

    return {
      equipmentName: name,
      freq: "1 x 1 Shift",
      standard: CED_STANDARDS[i % CED_STANDARDS.length],
      value,
      valueColor,
      problem,
      followUpProblem: followUp,
      followUpColor: FOLLOW_UP_COLORS[followUp],
      countermeasure: hasProblem ? countermeasures[i % 3] : "-",
      countermeasureBy: hasProblem ? counterPersons[i % 4] : "-",
    };
  });
}

function generateChemicalCEDTrendData(station: string, month: string) {
  const seed = station.length * 5 + month.length * 11;
  return Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    const hash1 = Math.abs(Math.sin((seed + day) * 3.9));
    const hash2 = Math.abs(Math.cos((seed + day) * 4.3));

    const total = Math.floor(4 + hash1 * 7);
    const ng = Math.floor(hash2 * 2);
    const repair = Math.floor(Math.abs(Math.sin((seed + day) * 6.1)) * 2);
    const ok = Math.max(0, total - ng - repair);

    return {
      date: String(day),
      OK: ok,
      NG: ng,
      Repair: repair,
    };
  });
}

function generateEDAmpereData(month: string) {
  const seed = month.length * 13;
  return Array.from({ length: 5 }, (_, i) => {
    const week = i + 1;
    const h1 = Math.abs(Math.sin((seed + week) * 4.7));
    const h2 = Math.abs(Math.cos((seed + week) * 3.2));
    const h3 = Math.abs(Math.sin((seed + week) * 5.9));
    const h4 = Math.abs(Math.cos((seed + week) * 6.1));

    return {
      week: `Week ${week}`,
      RM: Number((180 + h1 * 40).toFixed(1)),
      LM: Number((170 + h2 * 45).toFixed(1)),
      RB: Number((160 + h3 * 50).toFixed(1)),
      LB: Number((155 + h4 * 48).toFixed(1)),
    };
  });
}

function DashboardChecksheet() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  
  // Month filter for all sections
  const [globalMonth, setGlobalMonth] = useState(MONTH_OPTIONS[0]);

  const [activeControlPointTab, setActiveControlPointTab] = useState(CONTROL_POINT_TABS[0]);

  const [station1, setStation1] = useState(STATION_OPTIONS_1[0]);
  const [station2, setStation2] = useState(STATION_OPTIONS_2[0]);

  // Equipment Pre-Treatment state
  const [equipmentPTStation, setEquipmentPTStation] = useState(EQUIPMENT_PT_STATION_OPTIONS[0]);
  const [showProblemModal, setShowProblemModal] = useState<string | null>(null);

  // Equipment Pre-Treatment data
  const equipmentData = useMemo(
    () => generateEquipmentData(equipmentPTStation, globalMonth),
    [equipmentPTStation, globalMonth]
  );

  const equipmentTrendData = useMemo(
    () => generateEquipmentTrendData(equipmentPTStation, globalMonth),
    [equipmentPTStation, globalMonth]
  );

  // Equipment Pre-Treatment summary totals
  const eqTotalOK = equipmentData.filter(d => d.value === "OK").length +
    equipmentTrendData.reduce((acc, d) => acc + d.OK, 0);
  const eqTotalNG = equipmentData.filter(d => d.value === "NG").length +
    equipmentTrendData.reduce((acc, d) => acc + d.NG, 0);
  const eqTotalRepair = equipmentData.filter(d => d.value === "REPAIR").length +
    equipmentTrendData.reduce((acc, d) => acc + d.Repair, 0);
  const eqTotalProblem = equipmentData.filter(d => d.problem !== "-").length;

  // Chemical CED state
  const [chemicalCEDStation, setChemicalCEDStation] = useState(CHEMICAL_CED_STATION_OPTIONS[0]);
  const [showCEDProblemModal, setShowCEDProblemModal] = useState<string | null>(null);

  // Chemical CED data
  const cedData = useMemo(
    () => generateChemicalCEDData(chemicalCEDStation, globalMonth),
    [chemicalCEDStation, globalMonth]
  );

  const cedTrendData = useMemo(
    () => generateChemicalCEDTrendData(chemicalCEDStation, globalMonth),
    [chemicalCEDStation, globalMonth]
  );

  // Chemical CED summary totals
  const cedTotalOK = cedData.filter(d => d.value === "OK").length +
    cedTrendData.reduce((acc, d) => acc + d.OK, 0);
  const cedTotalNG = cedData.filter(d => d.value === "NG").length +
    cedTrendData.reduce((acc, d) => acc + d.NG, 0);
  const cedTotalRepair = cedData.filter(d => d.value === "REPAIR").length +
    cedTrendData.reduce((acc, d) => acc + d.Repair, 0);
  const cedTotalProblem = cedData.filter(d => d.problem !== "-").length;

  // ED Ampere state
  const [edAmpereToggle, setEdAmpereToggle] = useState<"RM & LM" | "RB & LB">("RM & LM");

  // ED Ampere data
  const edAmpereData = useMemo(
    () => generateEDAmpereData(globalMonth),
    [globalMonth]
  );

  const dataBagFilter = useMemo(
    () => generatePressureData(FRIDAYS_AUG_2026, station1 + globalMonth),
    [station1, globalMonth]
  );

  const dataControlPressure = useMemo(
    () => generatePressureData(ALL_DAYS_AUG_2026, station2 + globalMonth),
    [station2, globalMonth]
  );

  const dataWasteDisposal = useMemo(
    () => generateWasteDisposalData(ALL_DAYS_AUG_2026, globalMonth),
    [globalMonth]
  );

  const dataControlPoint = useMemo(
    () => generateControlPointData(ALL_DAYS_AUG_2026, activeControlPointTab + globalMonth),
    [activeControlPointTab, globalMonth]
  );

  const dataSurfaceConditioning = useMemo(
    () => generateSurfaceConditioningData(ALL_DAYS_AUG_2026, activeControlPointTab + globalMonth),
    [activeControlPointTab, globalMonth]
  );

  const dataPhosphate = useMemo(
    () => generatePhosphateData(ALL_DAYS_AUG_2026, activeControlPointTab + globalMonth),
    [activeControlPointTab, globalMonth]
  );

  const dataWR = useMemo(
    () => generateWRData(ALL_DAYS_AUG_2026, activeControlPointTab + globalMonth),
    [activeControlPointTab, globalMonth]
  );

  // Totals for summary cards (Waste Disposal)
  const totalMixing = dataWasteDisposal.reduce((acc, val) => acc + val.mixing, 0);
  const totalMini = dataWasteDisposal.reduce((acc, val) => acc + val.mini, 0);
  const totalPted = dataWasteDisposal.reduce((acc, val) => acc + val.pted, 0);
  const totalOilWeight = totalMixing + totalMini + totalPted;

  // Averages for summary cards (Control Point)
  const avgAlkaliMorning = (dataControlPoint.reduce((acc, val) => acc + val.morningAlkali, 0) / dataControlPoint.length).toFixed(1);
  const avgAlkaliAfternoon = (dataControlPoint.reduce((acc, val) => acc + val.afternoonAlkali, 0) / dataControlPoint.length).toFixed(1);
  const avgTempMorning = (dataControlPoint.reduce((acc, val) => acc + val.morningTemp, 0) / dataControlPoint.length).toFixed(1);
  const avgTempAfternoon = (dataControlPoint.reduce((acc, val) => acc + val.afternoonTemp, 0) / dataControlPoint.length).toFixed(1);

  // Averages for Surface Conditioning
  const avgSurfaceAlkaliMorning = (dataSurfaceConditioning.reduce((acc, val) => acc + val.morningAlkali, 0) / dataSurfaceConditioning.length).toFixed(1);
  const avgSurfaceAlkaliAfternoon = (dataSurfaceConditioning.reduce((acc, val) => acc + val.afternoonAlkali, 0) / dataSurfaceConditioning.length).toFixed(1);
  const avgSurfacePhMorning = (dataSurfaceConditioning.reduce((acc, val) => acc + val.morningPh, 0) / dataSurfaceConditioning.length).toFixed(1);
  const avgSurfacePhAfternoon = (dataSurfaceConditioning.reduce((acc, val) => acc + val.afternoonPh, 0) / dataSurfaceConditioning.length).toFixed(1);

  // Averages for Phosphate
  const avgPhosphateTAMorning = (dataPhosphate.reduce((acc, val) => acc + val.morningTA, 0) / dataPhosphate.length).toFixed(1);
  const avgPhosphateTAAfternoon = (dataPhosphate.reduce((acc, val) => acc + val.afternoonTA, 0) / dataPhosphate.length).toFixed(1);
  const avgPhosphateFAMorning = (dataPhosphate.reduce((acc, val) => acc + val.morningFA, 0) / dataPhosphate.length).toFixed(1);
  const avgPhosphateFAAfternoon = (dataPhosphate.reduce((acc, val) => acc + val.afternoonFA, 0) / dataPhosphate.length).toFixed(1);
  const avgPhosphateACMorning = (dataPhosphate.reduce((acc, val) => acc + val.morningAC, 0) / dataPhosphate.length).toFixed(1);
  const avgPhosphateACAfternoon = (dataPhosphate.reduce((acc, val) => acc + val.afternoonAC, 0) / dataPhosphate.length).toFixed(1);
  const avgPhosphateTempMorning = (dataPhosphate.reduce((acc, val) => acc + val.morningTemp, 0) / dataPhosphate.length).toFixed(1);
  const avgPhosphateTempAfternoon = (dataPhosphate.reduce((acc, val) => acc + val.afternoonTemp, 0) / dataPhosphate.length).toFixed(1);

  // Averages for WR 2,4,5
  const avgWR2Morning = (dataWR.reduce((acc, val) => acc + val.morningWR2, 0) / dataWR.length).toFixed(1);
  const avgWR2Afternoon = (dataWR.reduce((acc, val) => acc + val.afternoonWR2, 0) / dataWR.length).toFixed(1);
  const avgWR4Morning = (dataWR.reduce((acc, val) => acc + val.morningWR4, 0) / dataWR.length).toFixed(1);
  const avgWR4Afternoon = (dataWR.reduce((acc, val) => acc + val.afternoonWR4, 0) / dataWR.length).toFixed(1);
  const avgWR5Morning = (dataWR.reduce((acc, val) => acc + val.morningWR5, 0) / dataWR.length).toFixed(1);
  const avgWR5Afternoon = (dataWR.reduce((acc, val) => acc + val.afternoonWR5, 0) / dataWR.length).toFixed(1);

  // Y-Axis Ticks for Pressure charts
  const yTicks = [0.01, 0.015, 0.02, 0.025];

  return (
    <div className="p-6 space-y-6">
      {/* ── Title row ───────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-6">
        <LayoutDashboard className="h-5 w-5 text-foreground" />
        <h1 className="text-xl font-bold tracking-tight">Dashboard Checksheet</h1>
      </div>

      {/* ── Tabs & Global Filter ────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tab List */}
        <div className="flex items-center gap-1 rounded-lg bg-muted/50 p-1 overflow-x-auto border border-border">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "bg-background text-primary shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Right side Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sub Tab Dropdown (Only for Control Point) */}
           {activeTab === TABS[2] && (
            <div className="relative shrink-0">
              <select
                className="appearance-none bg-background border border-border rounded-lg pl-3 pr-8 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
                value={activeControlPointTab}
                onChange={(e) => setActiveControlPointTab(e.target.value)}
              >
                {CONTROL_POINT_TABS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          )}

          {/* Station Dropdown (Only for Equipment Pre-Treatment) */}
          {activeTab === TABS[3] && (
            <div className="relative shrink-0">
              <select
                className="appearance-none bg-background border border-border rounded-lg pl-3 pr-8 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
                value={equipmentPTStation}
                onChange={(e) => setEquipmentPTStation(e.target.value)}
              >
                {EQUIPMENT_PT_STATION_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          )}

          {/* Station Dropdown (Only for Chemical CED) */}
          {activeTab === TABS[4] && (
            <div className="relative shrink-0">
              <select
                className="appearance-none bg-background border border-border rounded-lg pl-3 pr-8 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
                value={chemicalCEDStation}
                onChange={(e) => setChemicalCEDStation(e.target.value)}
              >
                {CHEMICAL_CED_STATION_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          )}

          {/* ED Ampere Toggle */}
          {activeTab === TABS[5] && (
            <div className="flex bg-muted rounded-lg p-1">
              <button
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  edAmpereToggle === "RM & LM"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setEdAmpereToggle("RM & LM")}
              >
                RM & LM
              </button>
              <button
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  edAmpereToggle === "RB & LB"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setEdAmpereToggle("RB & LB")}
              >
                RB & LB
              </button>
            </div>
          )}

          {/* Global Month Filter */}
          <div className="relative shrink-0">
            <select
              className="appearance-none bg-background border border-border rounded-lg pl-4 pr-10 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
              value={globalMonth}
              onChange={(e) => setGlobalMonth(e.target.value)}
            >
              {MONTH_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {activeTab === TABS[0] && (
        <>
          {/* ── Card 1: Pressure by Cleaning Bag Filter ──────── */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <h2 className="text-lg font-semibold">Pressure by Cleaning Bag Filter</h2>
              <div className="flex flex-wrap items-center gap-3">
                {/* Station Filter */}
                <div className="relative">
                  <select
                    className="appearance-none bg-background border border-border rounded-lg pl-3 pr-8 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
                    value={station1}
                    onChange={(e) => setStation1(e.target.value)}
                  >
                    {STATION_OPTIONS_1.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="w-full">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dataBagFilter} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                domain={[0.01, 0.025]}
                ticks={yTicks}
                tickFormatter={(val) => val.toFixed(3)}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
                dx={-10}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 20 }} />
              <Line
                type="monotone"
                dataKey="IN"
                name="IN"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 4, fill: "#22c55e", strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="OUT"
                name="OUT"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ r: 4, fill: "#f97316", strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
              <Line type="monotone" dataKey="standard" name="Standard" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                      <Line type="monotone" dataKey="standard" name="Standard" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                    </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Card 2: Pressure by Control Pressure ─────────── */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm mt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h2 className="text-lg font-semibold">Pressure by Control Pressure</h2>
          <div className="flex flex-wrap items-center gap-3">
            {/* Station Filter */}
            <div className="relative">
              <select
                className="appearance-none bg-background border border-border rounded-lg pl-3 pr-8 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
                value={station2}
                onChange={(e) => setStation2(e.target.value)}
              >
                {STATION_OPTIONS_2.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="w-full">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dataControlPressure} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                domain={[0.01, 0.025]}
                ticks={yTicks}
                tickFormatter={(val) => val.toFixed(3)}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
                dx={-10}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 20 }} />
              <Line
                type="monotone"
                dataKey="IN"
                name="IN"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 4, fill: "#22c55e", strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="OUT"
                name="OUT"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ r: 4, fill: "#f97316", strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      </>
      )}

      {activeTab === TABS[1] && (
        <div className="space-y-6">
          {/* ── Summary Cards ───────────────────────────────── */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              label="Total Oil Weight"
              value={`${totalOilWeight} drum`}
              sub="Total Accumulation"
              subColor="text-muted-foreground"
              iconBg="bg-primary/10"
              icon={<Droplet className="h-4.5 w-4.5 text-primary" />}
            />
            <SummaryCard
              label="Oil Weight Mixing"
              value={`${totalMixing} drum`}
              sub="Mixing Process"
              subColor="text-blue-500"
              iconBg="bg-blue-500/10"
              icon={<Droplet className="h-4.5 w-4.5 text-blue-500" />}
            />
            <SummaryCard
              label="Oil Weight Mini"
              value={`${totalMini} drum`}
              sub="Mini Process"
              subColor="text-blue-700"
              iconBg="bg-blue-700/10"
              icon={<Droplet className="h-4.5 w-4.5 text-blue-700" />}
            />
            <SummaryCard
              label="Oil Weight PTED"
              value={`${totalPted} drum`}
              sub="PTED Process"
              subColor="text-blue-900"
              iconBg="bg-blue-900/10"
              icon={<Droplet className="h-4.5 w-4.5 text-blue-900" />}
            />
          </div>

          {/* ── Chart Section ───────────────────────────────── */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Waste Disposal Trends</h2>
            <div className="w-full">
              <ResponsiveContainer width="100%" height={600}>
                <ComposedChart
                  data={dataWasteDisposal}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                    dx={-10}
                    label={{
                      value: "Oil Weight (Drum)",
                      angle: -90,
                      position: "insideLeft",
                      fill: "var(--muted-foreground)",
                      fontSize: 12,
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 20 }} />
                  <Bar dataKey="mixing" name="Mixing" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="mini" name="Mini" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pted" name="PTED" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="standard" name="Standard" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === TABS[2] && (
        <div className="space-y-6">
          {/* Apply charts only for Pre-Degreasing and Degreasing */}
          {(activeControlPointTab === "Pre-Degreasing" || activeControlPointTab === "Degreasing") && (
            <>
              {/* ── Summary Cards ───────────────────────────────── */}
              <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                <DoubleSummaryCard
                  label="Average Free Alkali (T.Alk)"
                  value1={avgAlkaliMorning}
                  label1="Morning"
                  value2={avgAlkaliAfternoon}
                  label2="Afternoon"
                  iconBg="bg-primary/10"
                  icon={<Beaker className="h-4.5 w-4.5 text-primary" />}
                />
                <DoubleSummaryCard
                  label="Average Temperature"
                  value1={`${avgTempMorning} °C`}
                  label1="Morning"
                  value2={`${avgTempAfternoon} °C`}
                  label2="Afternoon"
                  iconBg="bg-blue-500/10"
                  icon={<Thermometer className="h-4.5 w-4.5 text-blue-500" />}
                />
              </div>

              {/* ── Chart 1: Free Alkali ───────────────────────────────── */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm mt-6">
                <h2 className="text-lg font-semibold mb-6">Free Alkali (T.Alk)</h2>
                <div className="w-full">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dataControlPoint} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                      />
                      <YAxis
                        domain={[16.0, 19.0]}
                        tickFormatter={(val) => val.toFixed(1)}
                        tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                        tickLine={false}
                        axisLine={false}
                        dx={-10}
                        label={{
                          value: "F.Alk",
                          angle: -90,
                          position: "insideLeft",
                          fill: "var(--muted-foreground)",
                          fontSize: 12,
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: 12, paddingTop: 20 }} />
                      <Line
                        type="monotone"
                        dataKey="morningAlkali"
                        name="Morning"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={{ r: 4, fill: "#22c55e", strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="afternoonAlkali"
                        name="Afternoon"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line type="monotone" dataKey="standardAlkali" name="Standard" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* ── Chart 2: Temperature ───────────────────────────────── */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm mt-6">
                <h2 className="text-lg font-semibold mb-6">Temperature (°C)</h2>
                <div className="w-full">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dataControlPoint} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                      />
                      <YAxis
                        domain={[20, 50]}
                        tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                        tickLine={false}
                        axisLine={false}
                        dx={-10}
                        label={{
                          value: "°C",
                          angle: -90,
                          position: "insideLeft",
                          fill: "var(--muted-foreground)",
                          fontSize: 12,
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: 12, paddingTop: 20 }} />
                      <Line
                        type="monotone"
                        dataKey="morningTemp"
                        name="Morning"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={{ r: 4, fill: "#22c55e", strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="afternoonTemp"
                        name="Afternoon"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line type="monotone" dataKey="standardTemp" name="Standard" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {/* Apply charts for Surface Conditioning */}
          {activeControlPointTab === "Surface Conditioning" && (
            <>
              {/* ── Summary Cards ───────────────────────────────── */}
              <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                <DoubleSummaryCard
                  label="Average Total Alkali (T.Alk)"
                  value1={avgSurfaceAlkaliMorning}
                  label1="Morning"
                  value2={avgSurfaceAlkaliAfternoon}
                  label2="Afternoon"
                  iconBg="bg-primary/10"
                  icon={<Beaker className="h-4.5 w-4.5 text-primary" />}
                />
                <DoubleSummaryCard
                  label="Average pH"
                  value1={avgSurfacePhMorning}
                  label1="Morning"
                  value2={avgSurfacePhAfternoon}
                  label2="Afternoon"
                  iconBg="bg-blue-500/10"
                  icon={<Beaker className="h-4.5 w-4.5 text-blue-500" />}
                />
              </div>

              {/* ── Chart 1: Total Alkali ───────────────────────────────── */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm mt-6">
                <h2 className="text-lg font-semibold mb-6">Total Alkali (T.Alk)</h2>
                <div className="w-full">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dataSurfaceConditioning} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                      />
                      <YAxis
                        domain={[2.2, 5.8]}
                        tickFormatter={(val) => val.toFixed(1)}
                        tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                        tickLine={false}
                        axisLine={false}
                        dx={-10}
                        label={{
                          value: "F.Alk",
                          angle: -90,
                          position: "insideLeft",
                          fill: "var(--muted-foreground)",
                          fontSize: 12,
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: 12, paddingTop: 20 }} />
                      <Line
                        type="monotone"
                        dataKey="morningAlkali"
                        name="Morning"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={{ r: 4, fill: "#22c55e", strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="afternoonAlkali"
                        name="Afternoon"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line type="monotone" dataKey="standardAlkali" name="Standard" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* ── Chart 2: pH ───────────────────────────────── */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm mt-6">
                <h2 className="text-lg font-semibold mb-6">pH</h2>
                <div className="w-full">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dataSurfaceConditioning} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                      />
                      <YAxis
                        domain={[8.0, 11.0]}
                        tickFormatter={(val) => val.toFixed(1)}
                        tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                        tickLine={false}
                        axisLine={false}
                        dx={-10}
                        label={{
                          value: "pH",
                          angle: -90,
                          position: "insideLeft",
                          fill: "var(--muted-foreground)",
                          fontSize: 12,
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: 12, paddingTop: 20 }} />
                      <Line
                        type="monotone"
                        dataKey="morningPh"
                        name="Morning"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={{ r: 4, fill: "#22c55e", strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="afternoonPh"
                        name="Afternoon"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line type="monotone" dataKey="standardPh" name="Standard" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {/* Apply charts for Phosphate */}
          {activeControlPointTab === "Phosphate" && (
            <>
              {/* ── Summary Cards ───────────────────────────────── */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <DoubleSummaryCard
                  label="Average Total Acid"
                  value1={avgPhosphateTAMorning}
                  label1="Morning"
                  value2={avgPhosphateTAAfternoon}
                  label2="Afternoon"
                  iconBg="bg-primary/10"
                  icon={<Beaker className="h-4.5 w-4.5 text-primary" />}
                />
                <DoubleSummaryCard
                  label="Average Free Acid"
                  value1={avgPhosphateFAMorning}
                  label1="Morning"
                  value2={avgPhosphateFAAfternoon}
                  label2="Afternoon"
                  iconBg="bg-primary/10"
                  icon={<Beaker className="h-4.5 w-4.5 text-primary" />}
                />
                <DoubleSummaryCard
                  label="Average Accelerator"
                  value1={avgPhosphateACMorning}
                  label1="Morning"
                  value2={avgPhosphateACAfternoon}
                  label2="Afternoon"
                  iconBg="bg-primary/10"
                  icon={<Beaker className="h-4.5 w-4.5 text-primary" />}
                />
                <DoubleSummaryCard
                  label="Average Temperature"
                  value1={`${avgPhosphateTempMorning} °C`}
                  label1="Morning"
                  value2={`${avgPhosphateTempAfternoon} °C`}
                  label2="Afternoon"
                  iconBg="bg-blue-500/10"
                  icon={<Thermometer className="h-4.5 w-4.5 text-blue-500" />}
                />
              </div>

              {/* ── Charts Grid (2x2) ───────────────────────────────── */}
              <div className="grid gap-6 lg:grid-cols-2 mt-6">
                {/* Chart 1: Total Acid (T.A) */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <h2 className="text-lg font-semibold mb-6">Total Acid (T.A)</h2>
                  <div className="w-full">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={dataPhosphate} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                          tickLine={false}
                          axisLine={false}
                          dy={10}
                        />
                        <YAxis
                          domain={[18.0, 24.0]}
                          tickFormatter={(val) => val.toFixed(1)}
                          tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                          tickLine={false}
                          axisLine={false}
                          dx={-10}
                          label={{
                            value: "T.A",
                            angle: -90,
                            position: "insideLeft",
                            fill: "var(--muted-foreground)",
                            fontSize: 12,
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 20 }} />
                        <Line
                          type="monotone"
                          dataKey="morningTA"
                          name="Morning"
                          stroke="#22c55e"
                          strokeWidth={2}
                          dot={{ r: 4, fill: "#22c55e", strokeWidth: 2 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="afternoonTA"
                          name="Afternoon"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line type="monotone" dataKey="standardTA" name="Standard" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                    </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 2: Free Acid (F.A) */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <h2 className="text-lg font-semibold mb-6">Free Acid (F.A)</h2>
                  <div className="w-full">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={dataPhosphate} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                          tickLine={false}
                          axisLine={false}
                          dy={10}
                        />
                        <YAxis
                          domain={[0.4, 1.0]}
                          tickFormatter={(val) => val.toFixed(1)}
                          tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                          tickLine={false}
                          axisLine={false}
                          dx={-10}
                          label={{
                            value: "F.A",
                            angle: -90,
                            position: "insideLeft",
                            fill: "var(--muted-foreground)",
                            fontSize: 12,
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 20 }} />
                        <Line
                          type="monotone"
                          dataKey="morningFA"
                          name="Morning"
                          stroke="#22c55e"
                          strokeWidth={2}
                          dot={{ r: 4, fill: "#22c55e", strokeWidth: 2 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="afternoonFA"
                          name="Afternoon"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line type="monotone" dataKey="standardFA" name="Standard" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                    </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 3: Accelerator (AC) */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <h2 className="text-lg font-semibold mb-6">Accelerator (AC)</h2>
                  <div className="w-full">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={dataPhosphate} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                          tickLine={false}
                          axisLine={false}
                          dy={10}
                        />
                        <YAxis
                          domain={[2.5, 5.5]}
                          tickFormatter={(val) => val.toFixed(1)}
                          tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                          tickLine={false}
                          axisLine={false}
                          dx={-10}
                          label={{
                            value: "AC",
                            angle: -90,
                            position: "insideLeft",
                            fill: "var(--muted-foreground)",
                            fontSize: 12,
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 20 }} />
                        <Line
                          type="monotone"
                          dataKey="morningAC"
                          name="Morning"
                          stroke="#22c55e"
                          strokeWidth={2}
                          dot={{ r: 4, fill: "#22c55e", strokeWidth: 2 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="afternoonAC"
                          name="Afternoon"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line type="monotone" dataKey="standardAC" name="Standard" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                    </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 4: Temperature (°C) */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <h2 className="text-lg font-semibold mb-6">Temperature (°C)</h2>
                  <div className="w-full">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={dataPhosphate} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                          tickLine={false}
                          axisLine={false}
                          dy={10}
                        />
                        <YAxis
                          domain={[20, 50]}
                          tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                          tickLine={false}
                          axisLine={false}
                          dx={-10}
                          label={{
                            value: "°C",
                            angle: -90,
                            position: "insideLeft",
                            fill: "var(--muted-foreground)",
                            fontSize: 12,
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 20 }} />
                        <Line
                          type="monotone"
                          dataKey="morningTemp"
                          name="Morning"
                          stroke="#22c55e"
                          strokeWidth={2}
                          dot={{ r: 4, fill: "#22c55e", strokeWidth: 2 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="afternoonTemp"
                          name="Afternoon"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line type="monotone" dataKey="standardTemp" name="Standard" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                    </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Apply charts for WR 2,4,5 */}
          {activeControlPointTab === "WR 2,4,5" && (
            <>
              {/* ── Summary Cards ───────────────────────────────── */}
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-3">
                <DoubleSummaryCard
                  label="Average WR 2 (Free Alkali)"
                  value1={avgWR2Morning}
                  label1="Morning"
                  value2={avgWR2Afternoon}
                  label2="Afternoon"
                  iconBg="bg-primary/10"
                  icon={<Beaker className="h-4.5 w-4.5 text-primary" />}
                />
                <DoubleSummaryCard
                  label="Average WR 4 (Total Acid)"
                  value1={avgWR4Morning}
                  label1="Morning"
                  value2={avgWR4Afternoon}
                  label2="Afternoon"
                  iconBg="bg-primary/10"
                  icon={<Beaker className="h-4.5 w-4.5 text-primary" />}
                />
                <DoubleSummaryCard
                  label="Average WR 5 (Total Acid)"
                  value1={avgWR5Morning}
                  label1="Morning"
                  value2={avgWR5Afternoon}
                  label2="Afternoon"
                  iconBg="bg-primary/10"
                  icon={<Beaker className="h-4.5 w-4.5 text-primary" />}
                />
              </div>

              {/* ── Charts Grid (WR 2 & 4 side-by-side, WR 5 full width) ───────────────────────────────── */}
              <div className="grid gap-6 lg:grid-cols-2 mt-6">
                {/* Chart 1: Water Rinse 2 (Free Alkali) */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <h2 className="text-lg font-semibold mb-6">Water Rinse 2 (Free Alkali)</h2>
                  <div className="w-full">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={dataWR} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                          tickLine={false}
                          axisLine={false}
                          dy={10}
                        />
                        <YAxis
                          domain={[0.0, 2.0]}
                          tickFormatter={(val) => val.toFixed(1)}
                          tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                          tickLine={false}
                          axisLine={false}
                          dx={-10}
                          label={{
                            value: "F.Alk",
                            angle: -90,
                            position: "insideLeft",
                            fill: "var(--muted-foreground)",
                            fontSize: 12,
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 20 }} />
                        <Line
                          type="monotone"
                          dataKey="morningWR2"
                          name="Morning"
                          stroke="#22c55e"
                          strokeWidth={2}
                          dot={{ r: 4, fill: "#22c55e", strokeWidth: 2 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="afternoonWR2"
                          name="Afternoon"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line type="monotone" dataKey="standardWR2" name="Standard" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                    </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 2: Water Rinse 4 (Total Acid) */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <h2 className="text-lg font-semibold mb-6">Water Rinse 4 (Total Acid)</h2>
                  <div className="w-full">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={dataWR} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                          tickLine={false}
                          axisLine={false}
                          dy={10}
                        />
                        <YAxis
                          domain={[0.0, 2.0]}
                          tickFormatter={(val) => val.toFixed(1)}
                          tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                          tickLine={false}
                          axisLine={false}
                          dx={-10}
                          label={{
                            value: "TA",
                            angle: -90,
                            position: "insideLeft",
                            fill: "var(--muted-foreground)",
                            fontSize: 12,
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 20 }} />
                        <Line
                          type="monotone"
                          dataKey="morningWR4"
                          name="Morning"
                          stroke="#22c55e"
                          strokeWidth={2}
                          dot={{ r: 4, fill: "#22c55e", strokeWidth: 2 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="afternoonWR4"
                          name="Afternoon"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line type="monotone" dataKey="standardWR4" name="Standard" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                    </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 3: Water Rinse 5 (Total Acid) */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
                  <h2 className="text-lg font-semibold mb-6">Water Rinse 5 (Total Acid)</h2>
                  <div className="w-full">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={dataWR} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                          tickLine={false}
                          axisLine={false}
                          dy={10}
                        />
                        <YAxis
                          domain={[0.0, 0.6]}
                          tickFormatter={(val) => val.toFixed(1)}
                          tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                          tickLine={false}
                          axisLine={false}
                          dx={-10}
                          label={{
                            value: "TA",
                            angle: -90,
                            position: "insideLeft",
                            fill: "var(--muted-foreground)",
                            fontSize: 12,
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 20 }} />
                        <Line
                          type="monotone"
                          dataKey="morningWR5"
                          name="Morning"
                          stroke="#22c55e"
                          strokeWidth={2}
                          dot={{ r: 4, fill: "#22c55e", strokeWidth: 2 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="afternoonWR5"
                          name="Afternoon"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line type="monotone" dataKey="standardWR5" name="Standard" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                    </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === TABS[3] && (
        <div className="space-y-6">
          {/* ── Summary Cards ───────────────────────────────── */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total OK */}
            <div className="rounded-lg bg-card border border-border p-4 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Total OK</span>
                <div className="h-8 w-8 rounded-full flex items-center justify-center bg-green-500/10">
                  <CheckCircle className="h-4.5 w-4.5 text-green-500" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{eqTotalOK}</div>
              </div>
            </div>

            {/* Total NG */}
            <div className="rounded-lg bg-card border border-border p-4 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Total NG</span>
                <div className="h-8 w-8 rounded-full flex items-center justify-center bg-red-500/10">
                  <AlertTriangle className="h-4.5 w-4.5 text-red-500" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{eqTotalNG}</div>
              </div>
            </div>

            {/* Total Repair */}
            <div className="rounded-lg bg-card border border-border p-4 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Total Repair</span>
                <div className="h-8 w-8 rounded-full flex items-center justify-center bg-orange-500/10">
                  <Wrench className="h-4.5 w-4.5 text-orange-500" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{eqTotalRepair}</div>
              </div>
            </div>

            {/* Total Problem */}
            <div className="rounded-lg bg-card border border-border p-4 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Total Problem</span>
                <div className="h-8 w-8 rounded-full flex items-center justify-center bg-purple-500/10">
                  <AlertOctagon className="h-4.5 w-4.5 text-purple-500" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold text-purple-600">{eqTotalProblem}</div>
                <button
                  className="text-xs text-primary hover:underline cursor-pointer font-medium"
                  onClick={() => setShowProblemModal("PROBLEM")}
                >
                  details
                </button>
              </div>
            </div>
          </div>

          {/* ── Bar Chart: Measurement Trends ───────────────────────────────── */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Measurement Trends</h2>
            <div className="w-full">
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart
                  data={equipmentTrendData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                    dx={-10}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 20 }} />
                  <Bar dataKey="OK" name="OK" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="NG" name="NG" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Repair" name="Repair" fill="#f97316" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="standard" name="Standard" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Problem Detail Modal ───────────────────────────────── */}
          {showProblemModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="bg-card rounded-xl border border-border shadow-xl w-full max-w-6xl max-h-[85vh] flex flex-col">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <h3 className="text-lg font-semibold">
                    {showProblemModal === "PROBLEM"
                      ? "Problem List"
                      : `${showProblemModal} Detail — ${equipmentPTStation}`}
                  </h3>
                  <button
                    className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                    onClick={() => setShowProblemModal(null)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-auto flex-1">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-3 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Equipment Name</th>
                          <th className="text-left py-3 px-3 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Freq</th>
                          <th className="text-left py-3 px-3 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Standard</th>
                          <th className="text-left py-3 px-3 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Value</th>
                          <th className="text-left py-3 px-3 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Problem</th>
                          <th className="text-left py-3 px-3 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Follow Up Problem</th>
                          <th className="text-left py-3 px-3 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Countermeasure</th>
                          <th className="text-left py-3 px-3 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Countermeasure By</th>
                        </tr>
                      </thead>
                      <tbody>
                        {equipmentData
                          .filter((row) => {
                            if (showProblemModal === "OK") return row.value === "OK";
                            if (showProblemModal === "NG") return row.value === "NG";
                            if (showProblemModal === "REPAIR") return row.value === "REPAIR";
                            if (showProblemModal === "PROBLEM") return row.problem !== "-";
                            return true;
                          })
                          .map((row, idx) => (
                            <tr key={idx} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                              <td className="py-3 px-3 font-medium">{row.equipmentName}</td>
                              <td className="py-3 px-3 text-muted-foreground">{row.freq}</td>
                              <td className="py-3 px-3 text-muted-foreground max-w-[250px]">{row.standard}</td>
                              <td className={`py-3 px-3 font-semibold ${row.valueColor}`}>{row.value}</td>
                              <td className="py-3 px-3 text-muted-foreground">{row.problem}</td>
                              <td className="py-3 px-3">
                                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${row.followUpColor}`}>
                                  {row.followUpProblem}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-muted-foreground">{row.countermeasure}</td>
                              <td className="py-3 px-3 text-muted-foreground">{row.countermeasureBy}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    {equipmentData.filter((row) => {
                      if (showProblemModal === "OK") return row.value === "OK";
                      if (showProblemModal === "NG") return row.value === "NG";
                      if (showProblemModal === "REPAIR") return row.value === "REPAIR";
                      if (showProblemModal === "PROBLEM") return row.problem !== "-";
                      return true;
                    }).length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No data available for this filter.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === TABS[4] && (
        <div className="space-y-6">
          {/* ── Summary Cards ───────────────────────────────── */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total OK */}
            <div className="rounded-lg bg-card border border-border p-4 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Total OK</span>
                <div className="h-8 w-8 rounded-full flex items-center justify-center bg-green-500/10">
                  <CheckCircle className="h-4.5 w-4.5 text-green-500" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{cedTotalOK}</div>
              </div>
            </div>

            {/* Total NG */}
            <div className="rounded-lg bg-card border border-border p-4 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Total NG</span>
                <div className="h-8 w-8 rounded-full flex items-center justify-center bg-red-500/10">
                  <AlertTriangle className="h-4.5 w-4.5 text-red-500" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{cedTotalNG}</div>
              </div>
            </div>

            {/* Total Repair */}
            <div className="rounded-lg bg-card border border-border p-4 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Total Repair</span>
                <div className="h-8 w-8 rounded-full flex items-center justify-center bg-orange-500/10">
                  <Wrench className="h-4.5 w-4.5 text-orange-500" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{cedTotalRepair}</div>
              </div>
            </div>

            {/* Total Problem */}
            <div className="rounded-lg bg-card border border-border p-4 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Total Problem</span>
                <div className="h-8 w-8 rounded-full flex items-center justify-center bg-purple-500/10">
                  <AlertOctagon className="h-4.5 w-4.5 text-purple-500" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold text-purple-600">{cedTotalProblem}</div>
                <button
                  className="text-xs text-primary hover:underline cursor-pointer font-medium"
                  onClick={() => setShowCEDProblemModal("PROBLEM")}
                >
                  details
                </button>
              </div>
            </div>
          </div>

          {/* ── Bar Chart: Measurement Trends ───────────────────────────────── */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Measurement Trends</h2>
            <div className="w-full">
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart
                  data={cedTrendData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                    dx={-10}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 20 }} />
                  <Bar dataKey="OK" name="OK" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="NG" name="NG" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Repair" name="Repair" fill="#f97316" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="standard" name="Standard" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Problem Detail Modal ───────────────────────────────── */}
          {showCEDProblemModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="bg-card rounded-xl border border-border shadow-xl w-full max-w-6xl max-h-[85vh] flex flex-col">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <h3 className="text-lg font-semibold">
                    Problem List — {chemicalCEDStation}
                  </h3>
                  <button
                    className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                    onClick={() => setShowCEDProblemModal(null)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-auto flex-1">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-3 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Equipment Name</th>
                          <th className="text-left py-3 px-3 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Freq</th>
                          <th className="text-left py-3 px-3 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Standard</th>
                          <th className="text-left py-3 px-3 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Value</th>
                          <th className="text-left py-3 px-3 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Problem</th>
                          <th className="text-left py-3 px-3 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Follow Up Problem</th>
                          <th className="text-left py-3 px-3 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Countermeasure</th>
                          <th className="text-left py-3 px-3 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Countermeasure By</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cedData
                          .filter((row) => row.problem !== "-")
                          .map((row, idx) => (
                            <tr key={idx} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                              <td className="py-3 px-3 font-medium">{row.equipmentName}</td>
                              <td className="py-3 px-3 text-muted-foreground">{row.freq}</td>
                              <td className="py-3 px-3 text-muted-foreground max-w-[250px]">{row.standard}</td>
                              <td className={`py-3 px-3 font-semibold ${row.valueColor}`}>{row.value}</td>
                              <td className="py-3 px-3 text-muted-foreground">{row.problem}</td>
                              <td className="py-3 px-3">
                                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${row.followUpColor}`}>
                                  {row.followUpProblem}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-muted-foreground">{row.countermeasure}</td>
                              <td className="py-3 px-3 text-muted-foreground">{row.countermeasureBy}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    {cedData.filter((row) => row.problem !== "-").length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No data available for this filter.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === TABS[5] && (
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">ED Ampere Trends — {edAmpereToggle}</h2>
            <div className="w-full">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={edAmpereData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    domain={['auto', 'auto']}
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                    dx={-10}
                    label={{
                      value: "Ampere",
                      angle: -90,
                      position: "insideLeft",
                      fill: "var(--muted-foreground)",
                      fontSize: 12,
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 20 }} />
                  
                  {edAmpereToggle === "RM & LM" && (
                    <Line
                      type="monotone"
                      dataKey="RM"
                      name="RM"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  )}
                  {edAmpereToggle === "RM & LM" && (
                    <Line
                      type="monotone"
                      dataKey="LM"
                      name="LM"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#22c55e", strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  )}

                  {edAmpereToggle === "RB & LB" && (
                    <Line
                      type="monotone"
                      dataKey="RB"
                      name="RB"
                      stroke="#f97316"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#f97316", strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  )}
                  {edAmpereToggle === "RB & LB" && (
                    <Line
                      type="monotone"
                      dataKey="LB"
                      name="LB"
                      stroke="#a855f7"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#a855f7", strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  sub,
  subColor,
  iconBg,
  icon,
}: {
  label: string;
  value: number | string;
  sub: string;
  subColor: string;
  iconBg: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-lg bg-card border border-border p-4 shadow-sm space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <div
          className={`h-8 w-8 rounded-full flex items-center justify-center ${iconBg}`}
        >
          {icon}
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className={`text-xs ${subColor}`}>{sub}</div>
      </div>
    </div>
  );
}

function DoubleSummaryCard({
  label,
  value1,
  label1,
  value2,
  label2,
  iconBg,
  icon,
}: {
  label: string;
  value1: number | string;
  label1: string;
  value2: number | string;
  label2: string;
  iconBg: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-lg bg-card border border-border p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <div
          className={`h-8 w-8 rounded-full flex items-center justify-center ${iconBg}`}
        >
          {icon}
        </div>
      </div>
      <div className="flex gap-8">
        <div>
          <div className="text-xs text-muted-foreground">{label1}</div>
          <div className="text-2xl font-bold">{value1}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">{label2}</div>
          <div className="text-2xl font-bold">{value2}</div>
        </div>
      </div>
    </div>
  );
}
