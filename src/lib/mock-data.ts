// Mock data (visual only — no backend)

export const BOILERS = [1, 2, 3].map((i) => ({
  id: i,
  name: `Boiler ${i}`,
  running: true,
  temp1: [185.4, 178.2, 182.9][i - 1],
  temp2: [182.1, 179.5, 181.3][i - 1],
  pressure: [8.2, 7.8, 8.4][i - 1],
  runningHours: [14.5, 12.0, 15.2][i - 1],
  energy: [450, 410, 485][i - 1],
  energyAvg: [420, 395, 470][i - 1],
  energyTotal: [10250, 9480, 11340][i - 1],
  gasAvg: [110, 95, 118][i - 1],
  gasTotal: [1650, 1420, 1780][i - 1],
  onTime: ["06:12", "07:45", "05:58"][i - 1],
  offTime: ["—", "13:24", "—"][i - 1],
  boilerDuration: ["10h 30m", "5h 39m", "11h 12m"][i - 1],
  fireBurner: i !== 2,
  burnerOnTime: ["06:12", "13:24", "05:58"][i - 1],
  burnerOffTime: ["—", "14:10", "—"][i - 1],
  burnerDuration: ["2h 23m", "0h 46m", "4h 15m"][i - 1],
  burnerTime: ["06:12", "13:24", "05:58"][i - 1],
  motorPump: true,
  pumpTime: ["06:10", "07:40", "05:50"][i - 1],
  alarm: i === 2,
  setpoint: 185,
}));

export const BOILER_GAS = {
  instantFlow: 320,
  unit: "m³/h",
  gasPressure: 4.2,
  powerPanel: 125,
  todayTotal: 4850,
  todayUnit: "m³",
};

export const OVEN_GAS = {
  instantFlow: 210,
  unit: "m³/h",
  todayTotal: 3120,
  todayUnit: "m³",
};

export const OVENS = [1, 2, 3].map((i) => ({
  id: i,
  name: `Oven ${i}`,
  running: true,
  temp: [186.2, 191.5, 178.9][i - 1],
  setpoint: [185, 190, 180][i - 1],
  gasFlow: [72, 84, 54][i - 1],
  gasTotal: [1050, 1240, 830][i - 1],
  energy: [1240, 1380, 1120][i - 1],
  alarm: i === 3,
}));

export function boilerDayTrend(base: number) {
  // 24 hours, hourly
  return Array.from({ length: 24 }, (_, h) => {
    const noise = Math.sin(h / 3) * 3 + (Math.random() - 0.5) * 2;
    return {
      t: `${String(h).padStart(2, "0")}:00`,
      temp1: +(base + noise).toFixed(1),
      temp2: +(base - 2 + noise * 0.8).toFixed(1),
    };
  });
}

export function boilerMonthTrend(base: number) {
  // 30 days
  return Array.from({ length: 30 }, (_, d) => {
    const noise = Math.sin(d / 5) * 4 + (Math.random() - 0.5) * 3;
    return {
      t: `${String(d + 1).padStart(2, "0")}`,
      temp1: +(base + noise).toFixed(1),
      temp2: +(base - 2 + noise * 0.8).toFixed(1),
    };
  });
}

export function boilerEnergyDaily() {
  return Array.from({ length: 30 }, (_, d) => ({
    day: `${String(d + 1).padStart(2, "0")}`,
    energy: Math.round(380 + Math.sin(d / 4) * 60 + Math.random() * 40),
  }));
}

export function boilerGasDaily() {
  return Array.from({ length: 30 }, (_, d) => ({
    day: `${String(d + 1).padStart(2, "0")}`,
    gas: Math.round(140 + Math.cos(d / 5) * 30 + Math.random() * 20),
  }));
}


export interface CEDZoneTemp {
  id: string;
  name: string;
  pv: number;
  sp: number;
  unit: string;
  alarm?: boolean;
  alarmMsg?: string;
}

export const CED_PROCESS_TEMPS: CEDZoneTemp[] = [
  { id: "flood", name: "Temperature Flood", pv: 28.5, sp: 30.0, unit: "°C", alarm: true, alarmMsg: "PV < SP Alarm (28.5°C < 30.0°C Target)" },
  { id: "predeg", name: "Temperature Pre-Degreasing", pv: 46.2, sp: 45.0, unit: "°C" },
  { id: "deg", name: "Temperature Degreasing", pv: 52.8, sp: 52.0, unit: "°C" },
  { id: "phos", name: "Temperature Phosphate", pv: 42.1, sp: 42.0, unit: "°C" },
  { id: "ced", name: "Temperature CED", pv: 30.2, sp: 30.0, unit: "°C" },
];

export function cedTempTrend(points = 24) {
  const data: { hour: string; flood: number; predeg: number; deg: number; phos: number; ced: number }[] = [];
  for (let i = 0; i < points; i++) {
    data.push({
      hour: `${String(i).padStart(2, "0")}:00`,
      flood: +(28.5 + Math.sin(i / 3) * 1.2).toFixed(1),
      predeg: +(46.0 + Math.cos(i / 4) * 2.0).toFixed(1),
      deg: +(52.5 + Math.sin(i / 2) * 1.8).toFixed(1),
      phos: +(42.0 + Math.cos(i / 3) * 1.2).toFixed(1),
      ced: +(30.0 + Math.sin(i / 4) * 0.8).toFixed(1),
    });
  }
  return data;
}

export const CED_PUMPS = [
  { station: "Pre-Degreasing (STN03)", p1: "ON", p2: "ON" },
  { station: "Degreasing (STN08)", p1: "ON", p2: "OFF" },
  { station: "Phosphating (STN15)", p1: "ON", p2: "ON" },
  { station: "Rinse 1 & 2 (STN22)", p1: "ON", p2: "ON" },
  { station: "E-Coat / Flood (STN30)", p1: "ON", p2: "ON" },
];

export const CED_VALVES = [
  { tag: "VAM111", name: "Degreasing Steam Valve", openPct: 24 },
  { tag: "VAM211", name: "Flood Modulating Valve", openPct: 45 },
  { tag: "VAM311", name: "Phosphate Temp Control", openPct: 18 },
  { tag: "VAM411", name: "E-Coat Bath Supply", openPct: 60 },
];

export function tempTrend(base: number, points = 48) {
  const data: { t: string; temp1: number; temp2: number; sp: number }[] = [];
  const now = Date.now();
  for (let i = points - 1; i >= 0; i--) {
    const ts = new Date(now - i * 30 * 60 * 1000);
    const noise = Math.sin(i / 3) * 3 + (Math.random() - 0.5) * 2;
    data.push({
      t: ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      temp1: +(base + noise).toFixed(1),
      temp2: +(base - 2 + noise * 0.8).toFixed(1),
      sp: base,
    });
  }
  return data;
}

export function energyTrend(points = 24) {
  const data: { hour: string; boiler: number; oven: number }[] = [];
  for (let i = 0; i < points; i++) {
    data.push({
      hour: `${String(i).padStart(2, "0")}:00`,
      boiler: Math.round(180 + Math.sin(i / 3) * 40 + Math.random() * 20),
      oven: Math.round(240 + Math.cos(i / 4) * 60 + Math.random() * 25),
    });
  }
  return data;
}


// CED zones with stations arranged in a U-loop
export type Station = {
  id: string;
  zone: string;
  x: number;
  y: number;
  occupied: boolean;
  since?: string;
  stuck?: boolean;
};

export const CED_ZONES: { key: string; label: string; color: string }[] = [
  { key: "load", label: "Skid Loading", color: "oklch(0.55 0.02 240)" },
  { key: "predeg", label: "Pre-Degreasing", color: "oklch(0.45 0.10 220)" },
  { key: "deg", label: "Degreasing", color: "oklch(0.45 0.12 200)" },
  { key: "act", label: "Activation", color: "oklch(0.45 0.14 165)" },
  { key: "phos", label: "Phosphating", color: "oklch(0.50 0.15 145)" },
  { key: "rinse", label: "Rinse", color: "oklch(0.50 0.13 210)" },
  { key: "ecoat", label: "E-Coat / Flood", color: "oklch(0.50 0.18 285)" },
  { key: "unload", label: "Skid Unloading", color: "oklch(0.55 0.02 240)" },
];

// Build a U-shaped station layout
export const CED_STATIONS: Station[] = (() => {
  const stations: Station[] = [];
  const zoneOrder = ["load", "predeg", "deg", "act", "phos", "rinse", "ecoat", "unload"];
  const zoneCounts: Record<string, number> = {
    load: 2, predeg: 5, deg: 6, act: 4, phos: 7, rinse: 10, ecoat: 8, unload: 2,
  };
  // Top row L→R
  const flat: { zone: string; idx: number }[] = [];
  zoneOrder.forEach((z) => { for (let i = 0; i < zoneCounts[z]; i++) flat.push({ zone: z, idx: i }); });

  const total = flat.length;
  const topCount = Math.ceil(total / 2);
  const startX = 40, endX = 1160, topY = 90, botY = 320;
  const stepTop = (endX - startX) / (topCount - 1);
  const stepBot = (endX - startX) / (total - topCount - 1);
  flat.forEach((f, i) => {
    let x: number, y: number;
    if (i < topCount) { x = startX + i * stepTop; y = topY; }
    else { const j = i - topCount; x = endX - j * stepBot; y = botY; }
    const occupied = Math.random() > 0.55;
    stations.push({
      id: `STN${i + 1}${f.idx % 2 === 0 ? "A" : "B"}`,
      zone: f.zone,
      x, y,
      occupied,
      since: occupied ? `${Math.floor(Math.random() * 12)}m` : undefined,
      stuck: occupied && Math.random() > 0.93,
    });
  });
  return stations;
})();

export const ALARMS = [
  { t: "11:24:03", area: "Boiler", eq: "Boiler 2", msg: "Temp deviation +6°C", sev: "warn" },
  { t: "11:18:41", area: "CED", eq: "STN27B", msg: "Skid stuck > 5 min", sev: "warn" },
  { t: "10:56:12", area: "Oven", eq: "Zone 3", msg: "Temp below range", sev: "info" },
  { t: "10:33:08", area: "CED", eq: "PUS111", msg: "Pump vibration warning", sev: "warn" },
  { t: "09:41:55", area: "Boiler", eq: "Boiler 1", msg: "Auto restart complete", sev: "info" },
  { t: "08:12:29", area: "Oven", eq: "kWh Meter", msg: "Peak demand exceeded", sev: "warn" },
];

export const OVEN_ZONES = [
  { name: "Zone 1", pv: 185, sp: 185 },
  { name: "Zone 2", pv: 191, sp: 190 },
  { name: "Zone 3", pv: 176, sp: 180 },
  { name: "Zone 4", pv: 188, sp: 185 },
  { name: "Zone 5", pv: 183, sp: 185 },
  { name: "Zone 6", pv: 179, sp: 180 },
];

export interface ChecksheetItem {
  id: string;
  area: "Oven" | "Boiler" | "CED";
  parameter: string;
  standard: string;
  actual: string;
  unit?: string;
  status: "OK" | "NG" | "Pending";
  shift: "Shift 1" | "Shift 2" | "Shift 3";
  checkedBy: string;
  time: string;
  note?: string;
}

export const CHECKSHEET_ITEMS: ChecksheetItem[] = [
  { id: "CHK-OV-01", area: "Oven", parameter: "Zone 1 Temperature", standard: "180 - 190", actual: "185", unit: "°C", status: "OK", shift: "Shift 1", checkedBy: "Budi Santoso", time: "07:30", note: "Normal operation" },
  { id: "CHK-OV-02", area: "Oven", parameter: "Zone 3 Temp Deviation", standard: "178 - 182", actual: "176", unit: "°C", status: "NG", shift: "Shift 1", checkedBy: "Budi Santoso", time: "07:35", note: "Slightly low, adjusted burner valve" },
  { id: "CHK-OV-03", area: "Oven", parameter: "Main Exhaust Fan Pressure", standard: "2.0 - 2.5", actual: "2.2", unit: "kPa", status: "OK", shift: "Shift 1", checkedBy: "Ahmad Rizky", time: "08:00" },
  { id: "CHK-OV-04", area: "Oven", parameter: "Conveyor Speed", standard: "1.2 - 1.5", actual: "1.35", unit: "m/min", status: "OK", shift: "Shift 1", checkedBy: "Ahmad Rizky", time: "08:15" },
  { id: "CHK-BL-01", area: "Boiler", parameter: "Steam Pressure Boiler 1", standard: "8.0 - 10.0", actual: "9.2", unit: "bar", status: "OK", shift: "Shift 1", checkedBy: "Hendra Wijaya", time: "07:15" },
  { id: "CHK-BL-02", area: "Boiler", parameter: "Feedwater pH Level", standard: "8.5 - 9.5", actual: "8.9", unit: "pH", status: "OK", shift: "Shift 1", checkedBy: "Hendra Wijaya", time: "07:20" },
  { id: "CHK-CD-01", area: "CED", parameter: "E-Coat Bath Temp", standard: "28 - 32", actual: "30.1", unit: "°C", status: "OK", shift: "Shift 1", checkedBy: "Dewi Lestari", time: "07:45" },
  { id: "CHK-CD-02", area: "CED", parameter: "Pre-Degreasing Pressure", standard: "1.8 - 2.2", actual: "1.6", unit: "bar", status: "NG", shift: "Shift 1", checkedBy: "Dewi Lestari", time: "07:50", note: "Filter clogged, scheduled clean" },
  { id: "CHK-OV-05", area: "Oven", parameter: "Curtain Air Blower", standard: "ON / Clean", actual: "ON / Clean", status: "OK", shift: "Shift 2", checkedBy: "Eko Prasetyo", time: "14:10" },
  { id: "CHK-OV-06", area: "Oven", parameter: "Gas Leak Sensor", standard: "0 PPM", actual: "0 PPM", status: "OK", shift: "Shift 2", checkedBy: "Eko Prasetyo", time: "14:20" },
];

export interface DailyProgressRecord {
  id: string;
  date: string;
  shift: string;
  area: string;
  totalChecks: number;
  completedChecks: number;
  ngCount: number;
  supervisor: string;
  status: "Completed" | "In Progress" | "Pending Review";
}

export const DAILY_PROGRESS_DATA: DailyProgressRecord[] = [
  { id: "DP-2026-0721-S1", date: "2026-07-21", shift: "Shift 1 (07:00 - 15:00)", area: "Oven Area", totalChecks: 18, completedChecks: 18, ngCount: 1, supervisor: "Hadi Kusuma", status: "Pending Review" },
  { id: "DP-2026-0721-S1B", date: "2026-07-21", shift: "Shift 1 (07:00 - 15:00)", area: "Boiler Area", totalChecks: 14, completedChecks: 14, ngCount: 0, supervisor: "Hadi Kusuma", status: "Completed" },
  { id: "DP-2026-0721-S1C", date: "2026-07-21", shift: "Shift 1 (07:00 - 15:00)", area: "CED Area", totalChecks: 22, completedChecks: 22, ngCount: 1, supervisor: "Rina Kartika", status: "Pending Review" },
  { id: "DP-2026-0721-S2", date: "2026-07-21", shift: "Shift 2 (15:00 - 23:00)", area: "Oven Area", totalChecks: 18, completedChecks: 6, ngCount: 0, supervisor: "Hadi Kusuma", status: "In Progress" },
  { id: "DP-2026-0720-S1", date: "2026-07-20", shift: "Shift 1 (07:00 - 15:00)", area: "Oven Area", totalChecks: 18, completedChecks: 18, ngCount: 0, supervisor: "Hadi Kusuma", status: "Completed" },
  { id: "DP-2026-0720-S2", date: "2026-07-20", shift: "Shift 2 (15:00 - 23:00)", area: "Oven Area", totalChecks: 18, completedChecks: 18, ngCount: 1, supervisor: "Budi Santoso", status: "Completed" },
  { id: "DP-2026-0720-S3", date: "2026-07-20", shift: "Shift 3 (23:00 - 07:00)", area: "Oven Area", totalChecks: 18, completedChecks: 18, ngCount: 0, supervisor: "Budi Santoso", status: "Completed" },
];

export interface ApprovalRequest {
  id: string;
  checksheetId: string;
  title: string;
  area: string;
  date: string;
  shift: string;
  submittedBy: string;
  submittedAt: string;
  ngItems: number;
  status: "Pending" | "Approved" | "Rejected";
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  comments?: string;
}

export const APPROVAL_REQUESTS: ApprovalRequest[] = [
  { id: "APR-2026-001", checksheetId: "DP-2026-0721-S1", title: "Daily Checksheet Oven Area - Shift 1", area: "Oven Area", date: "2026-07-21", shift: "Shift 1", submittedBy: "Budi Santoso (Operator)", submittedAt: "14:50", ngItems: 1, status: "Pending", comments: "Zone 3 temp deviation noted and adjusted." },
  { id: "APR-2026-002", checksheetId: "DP-2026-0721-S1C", title: "Daily Checksheet CED Area - Shift 1", area: "CED Area", date: "2026-07-21", shift: "Shift 1", submittedBy: "Dewi Lestari (Operator)", submittedAt: "14:55", ngItems: 1, status: "Pending", comments: "Pre-degreasing filter scheduled for cleaning at shift change." },
  { id: "APR-2026-003", checksheetId: "DP-2026-0720-S3", title: "Daily Checksheet Oven Area - Shift 3", area: "Oven Area", date: "2026-07-20", shift: "Shift 3", submittedBy: "Eko Prasetyo (Operator)", submittedAt: "06:45", ngItems: 0, status: "Approved", approvedBy: "Hadi Kusuma (Manager)", approvedAt: "2026-07-20 08:15" },
  { id: "APR-2026-004", checksheetId: "DP-2026-0720-S2", title: "Daily Checksheet Boiler Area - Shift 2", area: "Boiler Area", date: "2026-07-20", shift: "Shift 2", submittedBy: "Hendra Wijaya (Operator)", submittedAt: "22:40", ngItems: 2, status: "Rejected", approvedBy: "Hadi Kusuma (Manager)", approvedAt: "2026-07-21 07:10", rejectionReason: "Missing signature on chemical dosing section. Please re-verify." },
  { id: "APR-2026-005", checksheetId: "DP-2026-0720-S1", title: "Daily Checksheet Oven Area - Shift 1", area: "Oven Area", date: "2026-07-20", shift: "Shift 1", submittedBy: "Budi Santoso (Operator)", submittedAt: "14:45", ngItems: 0, status: "Approved", approvedBy: "Hadi Kusuma (Manager)", approvedAt: "2026-07-20 16:00" },
];

