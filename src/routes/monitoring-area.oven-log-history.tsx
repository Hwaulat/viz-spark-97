import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, Calendar, Activity, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Search } from "@/components/ui/search";
import { Table, THead, TBody, Th, Tr, Td } from "@/components/ui/table";
import { SelectInput } from "@/components/ui/select-input";

export const Route = createFileRoute("/monitoring-area/oven-log-history")({
  head: () => ({
    meta: [
      { title: "Oven Log History — Utility Monitoring System" },
      { name: "description", content: "Oven Log History" },
    ],
  }),
  component: OvenLogHistory,
});

const OVEN_TABS = ["Oven Sealing", "Oven Topcoat", "Oven CED"];

const MOCK_DATA = [
  { on: "11 August 2026, 06:12", off: "11 August 2026, 16:42", duration: "10h 30m" },
  { on: "10 August 2026, 05:45", off: "10 August 2026, 17:15", duration: "11h 30m" },
  { on: "9 August 2026, 06:00", off: "9 August 2026, 16:00", duration: "10h 00m" },
  { on: "8 August 2026, 06:30", off: "8 August 2026, 17:00", duration: "10h 30m" },
  { on: "7 August 2026, 05:50", off: "7 August 2026, 16:20", duration: "10h 30m" },
];

function OvenLogHistory() {
  const [activeTab, setActiveTab] = useState(OVEN_TABS[0]);

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => window.history.back()}
          className="mt-1 flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 shadow-sm hover:bg-secondary transition-colors text-sm font-medium text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
        <div>
          <h1 className="text-2xl font-semibold mt-1 flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" /> Log History
          </h1>
        </div>
      </div>

      <div className="w-full rounded-lg border border-border bg-card shadow-sm overflow-hidden mt-6 mb-2">
        {/* Filters and Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 px-4 py-4 bg-card border-b border-border/50">
          <div className="flex-1 w-full max-w-md">
            <Search placeholder="Search" containerClassName="w-full" />
          </div>

          <div className="flex items-center gap-4 ml-auto w-full lg:w-auto overflow-x-auto custom-scrollbar">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background text-sm text-muted-foreground cursor-pointer hover:bg-secondary/20 transition-colors h-[40px] whitespace-nowrap shrink-0">
              <Calendar className="h-4 w-4" />
              <span>dd/mm/yyyy - dd/mm/yyyy</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <Table freezeHeader={false}>
          <THead>
            <Tr noHover>
              <Th sortable column="on">ON</Th>
              <Th sortable column="off">OFF</Th>
              <Th sortable column="duration">TOTAL DURATION</Th>
            </Tr>
          </THead>
          <TBody>
            {MOCK_DATA.map((r, i) => (
              <Tr key={i}>
                <Td className="font-medium">{r.on}</Td>
                <Td className="font-medium">{r.off}</Td>
                <Td className="text-muted-foreground">{r.duration}</Td>
              </Tr>
            ))}
          </TBody>
        </Table>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-border/50 gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Rows per page</span>
            <SelectInput
              datalist={[{ label: "10", value: "10" }, { label: "20", value: "20" }, { label: "50", value: "50" }]}
              placeholder="10"
              containerClassName="w-20"
            />
            <span className="text-sm text-muted-foreground ml-2">1-10 of 2479</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="h-8 w-8 flex items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-secondary transition-colors disabled:opacity-50"><ChevronsLeft className="h-4 w-4" /></button>
            <button className="h-8 w-8 flex items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-secondary transition-colors disabled:opacity-50"><ChevronLeft className="h-4 w-4" /></button>
            <button className="h-8 w-8 flex items-center justify-center rounded-md bg-primary text-primary-foreground font-medium text-sm">1</button>
            <button className="h-8 w-8 flex items-center justify-center rounded-md border border-border bg-background hover:bg-secondary transition-colors text-sm font-medium">2</button>
            <button className="h-8 w-8 flex items-center justify-center rounded-md border border-border bg-background hover:bg-secondary transition-colors text-sm font-medium">3</button>
            <button className="h-8 w-8 flex items-center justify-center rounded-md border border-border bg-background hover:bg-secondary transition-colors text-sm font-medium">4</button>
            <button className="h-8 w-8 flex items-center justify-center rounded-md border border-border bg-background hover:bg-secondary transition-colors text-sm font-medium">5</button>
            <button className="h-8 w-8 flex items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-secondary transition-colors"><ChevronRight className="h-4 w-4" /></button>
            <button className="h-8 w-8 flex items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-secondary transition-colors"><ChevronsRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
