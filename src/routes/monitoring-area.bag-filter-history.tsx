import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ChevronLeft, Calendar, ChevronDown, Filter } from "lucide-react";
import { Search } from "@/components/ui/search";
import { SelectInput } from "@/components/ui/select-input";
import { Table, THead, TBody, Th, Tr, Td } from "@/components/ui/table";

export const Route = createFileRoute("/monitoring-area/bag-filter-history")({
  head: () => ({
    meta: [
      { title: "Bag Filter History — Utility Monitoring System" },
      { name: "description", content: "Bag Filter History" },
    ],
  }),
  component: BagFilterHistory,
});

function BagFilterHistory() {
  const [activeTab, setActiveTab] = useState("CED Line");
  const [activeSubTab, setActiveSubTab] = useState("DI Water Spray");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const tableData = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const date = new Date(2026, 8, 16, 10 - i, 0);
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      const timeStr = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

      const baseRow = {
        time: `${day} ${month} ${year}, ${timeStr}`,
        status: Math.random() > 0.8 ? "CRITICAL" : "NORMAL",
        pressureMin: "0.10",
        pressureMax: "0.50",
      };

      if (activeSubTab === "DI Water Spray") {
        return {
          ...baseRow,
          actualDI1: (Math.random() * 0.4 + 0.1).toFixed(2),
          actualDI2: (Math.random() * 0.4 + 0.1).toFixed(2),
          actualDI3: (Math.random() * 0.4 + 0.1).toFixed(2),
        };
      } else if (activeSubTab === "UF 2") {
        return {
          ...baseRow,
          actualUF2: (Math.random() * 0.4 + 0.1).toFixed(2),
        };
      } else if (activeSubTab === "UF 1") {
        return {
          ...baseRow,
          actualUF1: (Math.random() * 0.4 + 0.1).toFixed(2),
        };
      } else if (activeSubTab === "CED") {
        return {
          ...baseRow,
          actualCED1: (Math.random() * 0.4 + 0.1).toFixed(2),
          actualCED2: (Math.random() * 0.4 + 0.1).toFixed(2),
        };
      }

      // Default for Pre-Treatment Line sub-tabs
      return {
        ...baseRow,
        equipment: activeSubTab + (i % 2 === 0 ? " 1" : " 2"),
        pressure: (Math.random() * 0.5 + 0.1).toFixed(2),
      };
    });
  }, [activeSubTab]);

  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const paginatedData = tableData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Link
            to="/monitoring-area/$id"
            params={{ id: "bag-filter" }}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 shadow-sm hover:bg-secondary transition-colors text-sm font-medium text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
             <Filter className="h-5 w-5 text-primary" /> Bag Filter History
          </h1>
        </div>
        
        <div className="flex bg-gray-100 dark:bg-gray-700/60 rounded-xl p-1 h-auto overflow-x-auto custom-scrollbar">
          {["CED Line", "Pre-Treatment Line"].map((t) => (
            <button
              key={t}
              onClick={() => { 
                setActiveTab(t); 
                setActiveSubTab(t === "CED Line" ? "DI Water Spray" : "WR 5");
                setCurrentPage(1); 
              }}
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

      <div className="w-full rounded-lg border border-border bg-card shadow-sm overflow-hidden mt-6 mb-2">
        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row items-center gap-3 px-4 py-3 bg-secondary/10 border-b border-border/50 w-full overflow-x-auto">
          <Search placeholder="Search..." containerClassName="flex-1 min-w-[200px]" />
          
          <div className="flex bg-gray-100 dark:bg-gray-700/60 rounded-lg p-1 shrink-0">
            {(activeTab === "CED Line" 
              ? ["DI Water Spray", "UF 2", "UF 1", "CED"] 
              : ["WR 5", "Phosphating", "Degreasing", "Pre-Degreasing"]
            ).map((sub) => (
              <button
                key={sub}
                onClick={() => { setActiveSubTab(sub); setCurrentPage(1); }}
                className={`rounded-md text-xs font-medium h-[32px] px-3 whitespace-nowrap transition-colors ${
                  activeSubTab === sub
                    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          <SelectInput
            datalist={[
              { label: "All Status", value: "all" },
              { label: "Normal", value: "normal" },
              { label: "Critical", value: "critical" },
            ]}
            placeholder="Status"
            containerClassName="w-32 shrink-0"
          />
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background text-sm text-muted-foreground cursor-pointer hover:bg-secondary/20 transition-colors h-[40px] shrink-0">
            <Calendar className="h-4 w-4" />
            <span>dd/mm/yyyy - dd/mm/yyyy</span>
          </div>
        </div>

        <Table freezeHeader={false}>
          <THead>
            <Tr noHover>
              <Th sortable column="time">TIME / PERIOD</Th>
              {activeTab === "CED Line" ? (
                <>
                  <Th sortable column="pressureMin" className="text-right">PRESSURE MIN (MPa)</Th>
                  <Th sortable column="pressureMax" className="text-right">PRESSURE MAX (MPa)</Th>
                  {activeSubTab === "DI Water Spray" && (
                    <>
                      <Th sortable column="actualDI1" className="text-right">PRESSURE ACTUAL DI 1</Th>
                      <Th sortable column="actualDI2" className="text-right">PRESSURE ACTUAL DI 2</Th>
                      <Th sortable column="actualDI3" className="text-right">PRESSURE ACTUAL DI 3</Th>
                    </>
                  )}
                  {activeSubTab === "UF 2" && (
                    <Th sortable column="actualUF2" className="text-right">PRESSURE ACTUAL UF 2</Th>
                  )}
                  {activeSubTab === "UF 1" && (
                    <Th sortable column="actualUF1" className="text-right">PRESSURE ACTUAL UF 1</Th>
                  )}
                  {activeSubTab === "CED" && (
                    <>
                      <Th sortable column="actualCED1" className="text-right">PRESSURE ACTUAL CED 1</Th>
                      <Th sortable column="actualCED2" className="text-right">PRESSURE ACTUAL CED 2</Th>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Th sortable column="equipment">EQUIPMENT</Th>
                  <Th sortable column="pressure" className="text-right">PRESSURE (MPa)</Th>
                </>
              )}
              <Th sortable column="status" className="text-center">STATUS</Th>
            </Tr>
          </THead>
          <TBody>
            {paginatedData.map((row: any, idx) => (
              <Tr key={idx}>
                <Td className="font-medium text-foreground">{row.time}</Td>
                {activeTab === "CED Line" ? (
                  <>
                    <Td className="text-right font-mono font-medium text-muted-foreground">{row.pressureMin}</Td>
                    <Td className="text-right font-mono font-medium text-muted-foreground">{row.pressureMax}</Td>
                    {activeSubTab === "DI Water Spray" && (
                      <>
                        <Td className="text-right font-mono font-medium text-blue-500">{row.actualDI1}</Td>
                        <Td className="text-right font-mono font-medium text-blue-500">{row.actualDI2}</Td>
                        <Td className="text-right font-mono font-medium text-blue-500">{row.actualDI3}</Td>
                      </>
                    )}
                    {activeSubTab === "UF 2" && (
                      <Td className="text-right font-mono font-medium text-blue-500">{row.actualUF2}</Td>
                    )}
                    {activeSubTab === "UF 1" && (
                      <Td className="text-right font-mono font-medium text-blue-500">{row.actualUF1}</Td>
                    )}
                    {activeSubTab === "CED" && (
                      <>
                        <Td className="text-right font-mono font-medium text-blue-500">{row.actualCED1}</Td>
                        <Td className="text-right font-mono font-medium text-blue-500">{row.actualCED2}</Td>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Td className="text-muted-foreground font-medium">{row.equipment}</Td>
                    <Td className="text-right font-mono font-medium text-blue-500">{row.pressure}</Td>
                  </>
                )}
                <Td className="text-center">
                  {row.status === "CRITICAL" ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-red-500/10 text-red-600 border border-red-500/20">CRITICAL</span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">NORMAL</span>
                  )}
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
        
        {/* Pagination Footer */}
        <div className="flex flex-wrap items-center justify-between px-4 py-4 border-t border-border/60 gap-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
            <div className="flex items-center gap-2">
              <span>Rows per page</span>
              <div className="flex items-center justify-between w-[60px] px-2 py-1.5 border border-border rounded-md bg-background cursor-pointer hover:bg-secondary/40 transition-colors">
                <span>{itemsPerPage}</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </div>
            </div>
            <span>
              {(currentPage - 1) * itemsPerPage + 1}–
              {Math.min(currentPage * itemsPerPage, tableData.length)} of {tableData.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >«</button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >‹</button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                  currentPage === i + 1
                    ? "bg-[#1F5AA6] text-white font-semibold border border-[#1F5AA6]"
                    : "border border-border text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                }`}
              >{i + 1}</button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >›</button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >»</button>
          </div>
        </div>
      </div>
    </div>
  );
}
