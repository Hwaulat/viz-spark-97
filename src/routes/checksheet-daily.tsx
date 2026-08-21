import { createFileRoute } from "@tanstack/react-router";
import {
  Eye,
  Pencil,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  X,
  Sparkles,
  Plus,
  ArrowLeft,
  ListChecks,
} from "lucide-react";
import { useState } from "react";
import { INSPECTIONS, CHECKSHEET_SECTIONS, type InspectionRow, type ChecksheetRow, type ChecksheetSection } from "@/lib/checksheet-data";

export const Route = createFileRoute("/checksheet-daily")({
  head: () => ({
    meta: [
      { title: "Daily Progress — Utility Monitoring" },
      {
        name: "description",
        content: "Daily checksheet data entry and progress tracking.",
      },
    ],
  }),
  component: DailyProgressCheck,
});


/* ── Component ────────────────────────────────────────────── */
function DailyProgressCheck() {
  const [view, setView] = useState<"list" | "create" | "detail">("list");
  const [selectedDoc, setSelectedDoc] = useState<InspectionRow | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const totalPages = 4;

  if (view === "create") {
    return <CreateInspectionView onBack={() => setView("list")} />;
  }

  if (view === "detail" && selectedDoc) {
    return (
      <DetailInspectionView
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
          <ListChecks className="h-5 w-5 text-foreground" />
          <h1 className="text-xl font-bold tracking-tight">Daily Progress</h1>
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
        <button
          onClick={() => setView("create")}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Create New Inspection
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="text-left font-semibold px-4 py-3">Action</th>
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
                  Inspected By ▾
                </th>
                <th className="text-center font-semibold px-4 py-3">
                  Checked ▾
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {INSPECTIONS.map((row) => (
                <tr key={row.id} className="hover:bg-secondary/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedDoc(row);
                          setView("detail");
                        }}
                        className="rounded p-1.5 hover:bg-secondary text-muted-foreground"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="rounded p-1.5 hover:bg-secondary text-muted-foreground"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </div>
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

/* ── Create New Inspection View ───────────────────────────── */
function CreateInspectionView({ onBack }: { onBack: () => void }) {
  const [formData, setFormData] = useState({
    areaGedung: "Gedung A",
    partNumber: "Part Number",
    partName: "Part Name A",
    type: "Type A",
    shift: "Shift 1 (07:00 s/d 16:00)",
    customerName: "CST-001 - Ragdalion",
    image: "Document.pdf",
  });

  const [checkRows, setCheckRows] = useState(
    CHECKSHEET_SECTIONS.map((s) => ({
      ...s,
      rows: s.rows.map((r) => ({ ...r, start: "", middle: "" })),
    }))
  );

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-foreground" />
          <h1 className="text-xl font-bold tracking-tight">
            Daily Progress - Create New Inspection
          </h1>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90">
          Submit
        </button>
      </div>

      {/* Form Fields */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="grid gap-4 md:grid-cols-4">
          <FormField label="Area Gedung" required>
            <select className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm">
              <option>Gedung A</option>
              <option>Gedung B</option>
            </select>
          </FormField>
          <FormField label="Part Number" required>
            <select className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm">
              <option>Part Number</option>
            </select>
          </FormField>
          <FormField label="Part Name">
            <div className="rounded-lg bg-muted/50 border border-border px-3 py-2.5 text-sm">
              Part Name A
            </div>
          </FormField>
          <FormField label="Type">
            <div className="rounded-lg bg-muted/50 border border-border px-3 py-2.5 text-sm">
              Type A
            </div>
          </FormField>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <FormField label="Shift">
            <div className="rounded-lg bg-primary/10 border border-primary/20 px-3 py-2.5 text-sm font-medium">
              Shift 1 (07:00 s/d 16:00)
            </div>
          </FormField>
          <FormField label="Customer Name" required>
            <select className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm">
              <option>CST-001 - Ragdalion</option>
            </select>
          </FormField>
          <FormField label="Image" required>
            <div className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2.5 text-sm">
              <span>Document.pdf</span>
              <div className="flex items-center gap-2">
                <button className="text-muted-foreground hover:text-foreground">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="text-destructive hover:opacity-80">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">Format pdf</span>
          </FormField>
        </div>
      </div>

      {/* Checksheet Table */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Checksheet</h2>
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
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
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {CHECKSHEET_SECTIONS.map((section) => (
                  <>
                    <tr key={section.title}>
                      <td
                        colSpan={8}
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
                          <ChecksheetInput value={row.start} />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <ChecksheetInput value={row.middle} />
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

      <div className="flex justify-start">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to List
        </button>
      </div>
    </div>
  );
}

/* ── Detail Inspection View ───────────────────────────────── */
function DetailInspectionView({
  doc,
  onBack,
}: {
  doc: InspectionRow;
  onBack: () => void;
}) {
  return (
    <div className="p-6 space-y-5">
      {/* Header */}
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
            Details Inspection
          </h1>
        </div>
      </div>

      {/* Status Strip */}
      <div className="flex items-center justify-center gap-16 py-4">
        <div className="flex flex-col items-center gap-1">
          <CheckCircle2 className="h-10 w-10 text-ok" />
          <span className="text-sm font-medium">Inspection</span>
          <span className="text-xs text-muted-foreground">
            by Andre Waulat |24/06/2026
          </span>
        </div>
        <div className="h-px w-24 bg-border" />
        <div className="flex flex-col items-center gap-1">
          <Sparkles className="h-10 w-10 text-warn" />
          <span className="text-sm font-medium">Checked</span>
          <span className="text-xs text-muted-foreground">-</span>
        </div>
      </div>

      {/* Info Grid */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="grid gap-4 md:grid-cols-4">
          <InfoField label="Inspection Date" value="23/06/2026" />
          <InfoField label="Customer Name" value="CST-001 - Ragdalion" />
          <InfoField label="Doc. Number" value={doc.docNumber} />
          <InfoField label="Area Gedung" value={doc.areaGedung} />
        </div>
        <div className="grid gap-4 md:grid-cols-4 mt-4">
          <InfoField label="Part Number" value={doc.partNumber} />
          <InfoField label="Part Name" value="Part Name A" />
          <InfoField label="Type" value={doc.type} />
          <InfoField label="Shift" value="Shift 1 (07:00 s/d 16:00)" />
        </div>
        <div className="grid gap-4 md:grid-cols-4 mt-4">
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
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
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

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-muted-foreground">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function ChecksheetInput({ value }: { value: string }) {
  const isOkNg = value === "OK" || value === "NG";
  if (isOkNg) {
    return (
      <select
        defaultValue={value}
        className="rounded border border-border bg-card px-2 py-1 text-xs text-center"
      >
        <option>OK</option>
        <option>NG</option>
      </select>
    );
  }
  return (
    <input
      defaultValue={value}
      className="w-16 rounded border border-border bg-card px-2 py-1 text-xs text-center font-mono"
    />
  );
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
