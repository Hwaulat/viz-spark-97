import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ChevronLeft, Calendar, ChevronDown, Activity } from "lucide-react";
import { Search } from "@/components/ui/search";
import { SelectInput } from "@/components/ui/select-input";
import { Table, THead, TBody, Th, Tr, Td } from "@/components/ui/table";

export const Route = createFileRoute("/monitoring-area/pted-log-history")({
  head: () => ({
    meta: [
      { title: "PTED Log History — Utility Monitoring System" },
      { name: "description", content: "PTED Log History" },
    ],
  }),
  component: PTEDLogHistory,
});

const TABS = [
  "DI Water Spray",
  "UF 2",
  "UF 1",
  "CED",
  "WR 5",
  "Phosphating",
  "Degreasing",
  "Pre-Degreasing",
];

function PTEDLogHistory() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  
  const tableData = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => {
      const date = new Date(2026, 8, 16, 10 - i, 0);
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      const timeStr = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

      // Generate some dummy data based on tab
      const sp = activeTab.includes("Degreasing") ? 45.0 : activeTab.includes("Phosphate") ? 42.0 : 30.0;
      const pv = +(sp + (Math.random() * 4 - 2)).toFixed(1);

      const pressureMin = 0.2;
      const pressureMax = 0.5;
      const di1 = +(0.3 + Math.random() * 0.1).toFixed(2);
      const di2 = +(0.3 + Math.random() * 0.1).toFixed(2);
      const di3 = +(0.3 + Math.random() * 0.1).toFixed(2);
      const uf1 = +(0.3 + Math.random() * 0.1).toFixed(2);
      const uf2 = +(0.3 + Math.random() * 0.1).toFixed(2);

      return {
        time: `${day} ${month} ${year}, ${timeStr}`,
        pv,
        sp,
        pressureMin,
        pressureMax,
        di1,
        di2,
        di3,
        uf1,
        uf2,
      };
    });
  }, [activeTab]);

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link
          to="/monitoring-area"
          className="mt-1 flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 shadow-sm hover:bg-secondary transition-colors text-sm font-medium text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Link>
        <div>
          <h1 className="text-2xl font-semibold mt-1 flex items-center gap-2">
             <Activity className="h-5 w-5 text-primary" /> PTED Log History
          </h1>
        </div>
      </div>

      <div className="w-full rounded-lg border border-border bg-card shadow-sm overflow-hidden mt-6 mb-2">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border-b border-border/50 bg-card gap-4">
          <h3 className="text-lg font-semibold text-foreground shrink-0">Log History</h3>
          <div className="flex bg-gray-100 dark:bg-gray-700/60 rounded-xl p-1 h-auto overflow-x-auto custom-scrollbar">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`text-gray-500 dark:text-gray-400 rounded-lg text-xs font-medium h-8 px-4 whitespace-nowrap transition-colors ${activeTab === t
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                  : "hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-col xl:flex-row items-center gap-4 px-4 py-3 bg-secondary/10 border-b border-border/50 w-full overflow-x-auto">
          <div className="flex gap-4 w-full flex-1">
            <Search placeholder="Search" containerClassName="flex-1 min-w-[200px]" />
            <SelectInput
              datalist={[
                { label: "All Status", value: "all" },
                { label: "Normal", value: "normal" },
                { label: "Warning", value: "warning" },
              ]}
              placeholder="Status"
              containerClassName="w-32 lg:w-40 shrink-0"
            />
          </div>
          
          <div className="w-full xl:w-auto flex items-center gap-4 xl:justify-end min-w-0 overflow-x-auto custom-scrollbar pb-1 xl:pb-0">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background text-sm text-muted-foreground cursor-pointer hover:bg-secondary/20 transition-colors h-[40px] whitespace-nowrap shrink-0 ml-auto xl:ml-0">
              <Calendar className="h-4 w-4" />
              <span>dd/mm/yyyy - dd/mm/yyyy</span>
            </div>
          </div>
        </div>

        <Table freezeHeader={false}>
          <THead>
            <Tr noHover>
              <Th sortable column="time">TIME / PERIOD</Th>
              {activeTab === "DI Water Spray" ? (
                <>
                  <Th className="text-right">Pressure MIN</Th>
                  <Th className="text-right">Pressure MAX</Th>
                  <Th className="text-right">DI 1 (MPa)</Th>
                  <Th className="text-right">DI 2 (MPa)</Th>
                  <Th className="text-right">DI 3 (MPa)</Th>
                </>
              ) : activeTab === "UF 2" ? (
                <>
                  <Th className="text-right">Pressure MIN</Th>
                  <Th className="text-right">Pressure MAX</Th>
                  <Th className="text-right">UF 2 (MPa)</Th>
                </>
              ) : activeTab === "UF 1" ? (
                <>
                  <Th className="text-right">Pressure MIN</Th>
                  <Th className="text-right">Pressure MAX</Th>
                  <Th className="text-right">UF 1 (MPa)</Th>
                </>
              ) : (
                <>
                  <Th sortable column="pv" className="text-right">ACTUAL TEMP (PV)</Th>
                  <Th sortable column="sp" className="text-right">SET POINT (SP)</Th>
                  <Th sortable column="status" className="text-center">STATUS</Th>
                </>
              )}
            </Tr>
          </THead>
          <TBody>
            {tableData.map((row, idx) => {
              const diff = Math.abs(row.pv - row.sp);
              const isWarning = diff > 2; // Threshold for warning
              return (
                <Tr key={idx}>
                  <Td className="font-medium text-foreground">{row.time}</Td>
                  {activeTab === "DI Water Spray" ? (
                    <>
                      <Td className="text-right font-mono font-medium text-foreground">{row.pressureMin.toFixed(2)}</Td>
                      <Td className="text-right font-mono font-medium text-foreground">{row.pressureMax.toFixed(2)}</Td>
                      <Td className="text-right font-mono font-medium text-blue-500">{row.di1.toFixed(2)}</Td>
                      <Td className="text-right font-mono font-medium text-blue-500">{row.di2.toFixed(2)}</Td>
                      <Td className="text-right font-mono font-medium text-blue-500">{row.di3.toFixed(2)}</Td>
                    </>
                  ) : activeTab === "UF 2" ? (
                    <>
                      <Td className="text-right font-mono font-medium text-foreground">{row.pressureMin.toFixed(2)}</Td>
                      <Td className="text-right font-mono font-medium text-foreground">{row.pressureMax.toFixed(2)}</Td>
                      <Td className="text-right font-mono font-medium text-blue-500">{row.uf2.toFixed(2)}</Td>
                    </>
                  ) : activeTab === "UF 1" ? (
                    <>
                      <Td className="text-right font-mono font-medium text-foreground">{row.pressureMin.toFixed(2)}</Td>
                      <Td className="text-right font-mono font-medium text-foreground">{row.pressureMax.toFixed(2)}</Td>
                      <Td className="text-right font-mono font-medium text-blue-500">{row.uf1.toFixed(2)}</Td>
                    </>
                  ) : (
                    <>
                      <Td className="text-right font-mono font-medium text-blue-500">{row.pv.toFixed(1)} °C</Td>
                      <Td className="text-right font-mono font-medium text-foreground">{row.sp.toFixed(1)} °C</Td>
                      <Td className="text-center">
                        {isWarning ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-red-500/10 text-red-600 border border-red-500/20">WARNING</span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">NORMAL</span>
                        )}
                      </Td>
                    </>
                  )}
                </Tr>
              );
            })}
          </TBody>
        </Table>

        {/* Pagination Footer */}
        <div className="flex flex-wrap items-center justify-between px-4 py-4 border-t border-border/60 gap-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
            <div className="flex items-center gap-2">
              <span>Rows per page</span>
              <div className="flex items-center justify-between w-[60px] px-2 py-1.5 border border-border rounded-md bg-background cursor-pointer hover:bg-secondary/40 transition-colors">
                <span>10</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </div>
            </div>
            <span>1–10 of {tableData.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors text-sm font-medium">«</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors text-sm font-medium">‹</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md bg-[#1F5AA6] text-white text-sm font-semibold border border-[#1F5AA6]">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors text-sm font-medium">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors text-sm font-medium">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors text-sm font-medium">›</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors text-sm font-medium">»</button>
          </div>
        </div>
      </div>
    </div>
  );
}
