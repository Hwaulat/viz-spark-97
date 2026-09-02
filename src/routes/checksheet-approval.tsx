import { createFileRoute } from "@tanstack/react-router";
import {
  Eye,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  X,
  Sparkles,
  Calendar,
  ListChecks,
} from "lucide-react";
import { useState } from "react";
import { INSPECTIONS as APPROVALS, CHECKSHEET_SECTIONS, type InspectionRow as ApprovalRow, type ChecksheetRow, type ChecksheetSection } from "@/lib/checksheet-data";

export const Route = createFileRoute("/checksheet-approval")({
  head: () => ({
    meta: [
      { title: "Approval — Utility Monitoring System" },
      {
        name: "description",
        content: "Review and approve checksheet logs.",
      },
    ],
  }),
  component: ChecksheetApproval,
});


/* ── Component ────────────────────────────────────────────── */
function ChecksheetApproval() {
  const [view, setView] = useState<"list" | "detail">("list");
  const [selectedDoc, setSelectedDoc] = useState<ApprovalRow | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  if (view === "detail" && selectedDoc) {
    return (
      <DetailApprovalView
        doc={selectedDoc}
        onBack={() => {
          setView("list");
          setSelectedDoc(null);
        }}
      />
    );
  }

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-foreground" />
          <h1 className="text-xl font-bold tracking-tight">Approval</h1>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[300px] rounded-lg border border-border bg-card px-3 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder="Search by doc. no, part number, name, type & inspection by"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <FilterButton label="All Customer" />
        <FilterButton label="All Part Number - Name" />
        <FilterButton label="All Gedung" />
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm whitespace-nowrap">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          01/06/2026 - 24/06/2026
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="text-left font-semibold px-4 py-3 w-16">
                  Action
                </th>
                <th className="text-left font-semibold px-4 py-3">
                  Inspection Date ▾
                </th>
                <th className="text-left font-semibold px-4 py-3">
                  Customer ▾
                </th>
                <th className="text-left font-semibold px-4 py-3">
                  Doc. Number ▾
                </th>
                <th className="text-left font-semibold px-4 py-3">
                  Area Gedung ▾
                </th>
                <th className="text-left font-semibold px-4 py-3">
                  Part Number ▾
                </th>
                <th className="text-left font-semibold px-4 py-3">
                  Part Name ▾
                </th>
                <th className="text-left font-semibold px-4 py-3">Type ▾</th>
                <th className="text-left font-semibold px-4 py-3">
                  Inspection By ▾
                </th>
                <th className="text-center font-semibold px-4 py-3">
                  Checked ▾
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {APPROVALS.map((row) => (
                <tr key={row.id} className="hover:bg-secondary/30">
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => {
                        setSelectedDoc(row);
                        setView("detail");
                      }}
                      className="rounded p-1.5 hover:bg-secondary text-muted-foreground"
                      title="View"
                    >
                      <Eye className="h-4 w-4 mx-auto" />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm">{row.inspectionDate}</td>
                  <td className="px-4 py-3 text-sm">{row.customer}</td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {row.docNumber}
                  </td>
                  <td className="px-4 py-3 text-sm">{row.areaGedung}</td>
                  <td className="px-4 py-3 text-sm">{row.partNumber}</td>
                  <td className="px-4 py-3 text-sm">{row.partName}</td>
                  <td className="px-4 py-3 text-sm">{row.type}</td>
                  <td className="px-4 py-3 text-sm">{row.inspectedBy}</td>
                  <td className="px-4 py-3 text-center">
                    <CheckedIcon status={row.checked} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <input
              className="w-12 rounded border border-border bg-card px-2 py-1 text-center text-xs"
              defaultValue={10}
            />
            <span>1–10 of 40</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="rounded p-1 hover:bg-secondary">
              <ChevronLeft className="h-4 w-4" />
            </button>
            {[1, 2, 3, 4].map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`h-8 w-8 rounded text-sm font-medium ${
                  currentPage === p
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary"
                }`}
              >
                {p}
              </button>
            ))}
            <button className="rounded p-1 hover:bg-secondary">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Detail Approval View ─────────────────────────────────── */
function DetailApprovalView({
  doc,
  onBack,
}: {
  doc: ApprovalRow;
  onBack: () => void;
}) {
  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-2 text-sm hover:bg-secondary"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-foreground" />
            <h1 className="text-xl font-bold tracking-tight">
              Details Approval
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-lg bg-destructive px-5 py-2.5 text-sm font-semibold text-destructive-foreground shadow-sm hover:opacity-90">
            Reject
          </button>
          <button className="rounded-lg bg-ok px-5 py-2.5 text-sm font-semibold text-ok-foreground shadow-sm hover:opacity-90">
            Approve
          </button>
        </div>
      </div>

      {/* Info Grid */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="grid gap-4 md:grid-cols-4">
          <InfoField label="Inspection Date" value="23/06/2026" />
          <InfoField label="Customer Name" value="CST-001 - Ragdalion" />
          <InfoField label="Doc. Number" value={doc.docNumber} />
          <InfoField label="Inspection by" value={doc.inspectedBy} />
        </div>
        <div className="grid gap-4 md:grid-cols-4 mt-4">
          <InfoField label="Area Gedung" value={doc.areaGedung} />
          <InfoField label="Part Number" value={doc.partNumber} />
          <InfoField label="Part Name" value="Part Name A" />
          <InfoField label="Type" value={doc.type} />
        </div>
        <div className="grid gap-4 md:grid-cols-4 mt-4">
          <InfoField label="Shift" value="Shift 1 (07:00 s/d 16:00)" />
          <div>
            <span className="text-xs text-muted-foreground">Image</span>
            <div>
              <a
                href="#"
                className="text-sm font-medium text-primary underline"
              >
                Document.png
              </a>
            </div>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">
              Reason for Rejection
            </span>
            <div className="text-sm font-medium">-</div>
          </div>
        </div>
      </div>

      {/* Checksheet Table */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Checksheet</h2>
        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-[10px] uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="text-left font-semibold px-4 py-3 w-12">
                    No.
                  </th>
                  <th className="text-left font-semibold px-4 py-3">
                    Item Check
                  </th>
                  <th className="text-left font-semibold px-4 py-3">
                    Measurement/Method
                  </th>
                  <th className="text-left font-semibold px-4 py-3">
                    Min Tolerance
                  </th>
                  <th className="text-left font-semibold px-4 py-3">
                    Max Tolerance
                  </th>
                  <th className="text-left font-semibold px-4 py-3">
                    Standard
                  </th>
                  <th className="text-center font-semibold px-4 py-3">
                    Start
                  </th>
                  <th className="text-center font-semibold px-4 py-3">
                    Middle
                  </th>
                  <th className="text-center font-semibold px-4 py-3">End</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {CHECKSHEET_SECTIONS.map((section) => (
                  <>
                    <tr key={section.title}>
                      <td
                        colSpan={9}
                        className="px-4 py-2.5 bg-secondary/30 font-semibold text-sm"
                      >
                        {section.title}
                      </td>
                    </tr>
                    {section.rows.map((row, ri) => (
                      <tr
                        key={`${section.title}-${ri}`}
                        className="hover:bg-secondary/20"
                      >
                        <td className="px-4 py-3 text-center text-muted-foreground">
                          {ri + 1}
                        </td>
                        <td className="px-4 py-3">{row.itemCheck}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {row.measurement}
                        </td>
                        <td className="px-4 py-3 text-center text-muted-foreground">
                          {row.minTol}
                        </td>
                        <td className="px-4 py-3 text-center text-muted-foreground">
                          {row.maxTol}
                        </td>
                        <td className="px-4 py-3 text-sm max-w-[200px]">
                          {row.standard}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <ResultBadge value={row.start} />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <ResultBadge value={row.middle} />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <ResultBadge value={row.end} />
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ───────────────────────────────────────── */
function FilterButton({ label }: { label: string }) {
  return (
    <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2.5 text-sm whitespace-nowrap">
      {label}
      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
    </button>
  );
}

function CheckedIcon({ status }: { status: "ok" | "ng" | "waiting" }) {
  if (status === "ok") return <CheckCircle2 className="h-5 w-5 text-ok mx-auto" />;
  if (status === "ng") return <X className="h-5 w-5 text-destructive mx-auto" />;
  return <Sparkles className="h-5 w-5 text-warn mx-auto" />;
}

function ResultBadge({ value }: { value: string }) {
  if (value === "OK") {
    return (
      <span className="inline-flex items-center justify-center h-7 w-12 rounded bg-ok/15 text-ok text-xs font-semibold">
        OK
      </span>
    );
  }
  if (value === "NG") {
    return (
      <span className="inline-flex items-center justify-center h-7 w-12 rounded bg-destructive/15 text-destructive text-xs font-semibold">
        NG
      </span>
    );
  }
  return <span className="text-xs font-mono">{value}</span>;
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="text-sm font-semibold mt-0.5">{value}</div>
    </div>
  );
}
