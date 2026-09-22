import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ChevronLeft, Calendar, AlertOctagon, ChevronDown } from "lucide-react";
import { Search } from "@/components/ui/search";
import { SelectInput } from "@/components/ui/select-input";
import { Table, THead, TBody, Th, Tr, Td } from "@/components/ui/table";

export const Route = createFileRoute("/checksheet_/problem-list")({
  head: () => ({
    meta: [
      { title: "Problem List — Utility Monitoring System" },
      { name: "description", content: "Problem List" },
    ],
  }),
  component: ProblemList,
});

const FOLLOW_UP_COLORS: Record<string, string> = {
  "None": "bg-gray-100 text-gray-600",
  "Maintenance": "bg-orange-100 text-orange-600",
  "Painting": "bg-red-100 text-red-600",
  "Cleaning": "bg-blue-100 text-blue-600",
  "Replacement": "bg-purple-100 text-purple-600",
};

function ProblemList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [fuFilter, setFuFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const tableData = useMemo(() => {
    // Generate some mock problem data
    const mockData = [
      {
        equipmentName: "Tanki & Pipa",
        freq: "1 x 1 Shift",
        standard: "Tidak ada kebocoran (Normal)",
        value: "REPAIR",
        valueColor: "text-orange-500",
        problem: "Bocor halus di sambungan pipa",
        followUpProblem: "Maintenance",
        countermeasure: "Pengelasan ulang",
        countermeasureBy: "Hasan",
      },
      {
        equipmentName: "Spray Nozzle",
        freq: "1 x 1 Shift",
        standard: "Tidak tersumbat, sudut normal (Standard)",
        value: "NG",
        valueColor: "text-red-500",
        problem: "Nozzle tersumbat kerak",
        followUpProblem: "Maintenance",
        countermeasure: "Pembersihan nozzle",
        countermeasureBy: "Budi",
      },
      {
        equipmentName: "Heater Element",
        freq: "1 x 1 Shift",
        standard: "> 60°C",
        value: "NG",
        valueColor: "text-red-500",
        problem: "Panas kurang maksimal",
        followUpProblem: "Painting",
        countermeasure: "Pengecekan arus heater",
        countermeasureBy: "Andre",
      },
      {
        equipmentName: "Pompa Sirkulasi",
        freq: "1 x 1 Shift",
        standard: "Suara normal, getaran normal",
        value: "REPAIR",
        valueColor: "text-orange-500",
        problem: "Getaran tinggi",
        followUpProblem: "Maintenance",
        countermeasure: "Ganti bearing pompa",
        countermeasureBy: "Rini",
      },
      {
        equipmentName: "Strainer Mesh",
        freq: "1 x 1 Shift",
        standard: "Tidak tersumbat",
        value: "NG",
        valueColor: "text-red-500",
        problem: "Mesh robek",
        followUpProblem: "Painting",
        countermeasure: "Penggantian mesh",
        countermeasureBy: "Hasan",
      },
    ];
    // Duplicate mock data to show pagination
    return [...mockData, ...mockData.map(m => ({ ...m, equipmentName: m.equipmentName + " (2)" })), ...mockData.map(m => ({ ...m, equipmentName: m.equipmentName + " (3)" }))];
  }, []);

  const filteredData = tableData.filter((row) => {
    const matchesSearch = row.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) || row.problem.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFU = fuFilter === "all" || row.followUpProblem.toLowerCase() === fuFilter.toLowerCase();
    return matchesSearch && matchesFU;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link
          to="/checksheet"
          className="mt-1 flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 shadow-sm hover:bg-secondary transition-colors text-sm font-medium text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Link>
        <div>
          <h1 className="text-2xl font-semibold mt-1 flex items-center gap-2">
            <AlertOctagon className="h-5 w-5 text-primary" /> Problem List
          </h1>
        </div>
      </div>

      <div className="w-full rounded-lg border border-border bg-card shadow-sm overflow-hidden mt-6 mb-2">
        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row items-center gap-4 px-4 py-3 bg-secondary/10 border-b border-border/50 w-full">
          <Search
            placeholder="Search equipment or problem..."
            containerClassName="flex-1 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SelectInput
            datalist={[
              { label: "All FU Problem", value: "all" },
              { label: "Maintenance", value: "maintenance" },
              { label: "Painting", value: "painting" },
            ]}
            defValue={fuFilter}
            onChange={(v) => setFuFilter(v as string)}
            placeholder="Filter FU Problem"
            containerClassName="w-full lg:w-48"
            hideClear
          />
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background text-sm text-muted-foreground cursor-pointer hover:bg-secondary/20 transition-colors h-[40px]">
            <Calendar className="h-4 w-4" />
            <span>dd/mm/yyyy - dd/mm/yyyy</span>
          </div>
        </div>

        <Table freezeHeader={false}>
          <THead>
            <Tr noHover>
              <Th column="equipment">EQUIPMENT NAME</Th>
              <Th column="freq">FREQ</Th>
              <Th column="standard">STANDARD</Th>
              <Th column="value">VALUE</Th>
              <Th column="problem">PROBLEM</Th>
              <Th column="followup">FOLLOW UP PROBLEM</Th>
              <Th column="countermeasure">COUNTERMEASURE</Th>
              <Th column="by">COUNTERMEASURE BY</Th>
            </Tr>
          </THead>
          <TBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <Tr key={idx}>
                  <Td className="font-medium text-foreground">{row.equipmentName}</Td>
                  <Td className="text-muted-foreground">{row.freq}</Td>
                  <Td className="text-muted-foreground max-w-[250px]">{row.standard}</Td>
                  <Td className={`font-semibold ${row.valueColor}`}>{row.value}</Td>
                  <Td className="text-muted-foreground">{row.problem}</Td>
                  <Td>
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${FOLLOW_UP_COLORS[row.followUpProblem] || "bg-gray-100 text-gray-600"}`}>
                      {row.followUpProblem}
                    </span>
                  </Td>
                  <Td className="text-muted-foreground">{row.countermeasure}</Td>
                  <Td className="text-muted-foreground">{row.countermeasureBy}</Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={8} className="text-center py-8 text-muted-foreground">
                  No problems found matching criteria.
                </Td>
              </Tr>
            )}
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
              {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              «
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${currentPage === i + 1
                    ? "bg-[#1F5AA6] text-white font-semibold border border-[#1F5AA6]"
                    : "border border-border text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                  }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ›
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
