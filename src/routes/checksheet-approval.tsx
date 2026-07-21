import { createFileRoute } from "@tanstack/react-router";
import { Panel, StatusDot, ValueDisplay } from "@/components/panel";
import { APPROVAL_REQUESTS, ApprovalRequest } from "@/lib/mock-data";
import { ShieldCheck, CheckCircle2, XCircle, Clock, AlertTriangle, FileText, Check, X, Eye, MessageSquare } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/checksheet-approval")({
  head: () => ({
    meta: [
      { title: "Approval — Utility Monitoring System" },
      { name: "description", content: "Review and approve checksheet logs from shift operators across plant areas." },
    ],
  }),
  component: ChecksheetApproval,
});

function ChecksheetApproval() {
  const [requests, setRequests] = useState<ApprovalRequest[]>(APPROVAL_REQUESTS);
  const [tab, setTab] = useState<"Pending" | "Approved" | "Rejected">("Pending");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = useState("");
  const [selectedDetail, setSelectedDetail] = useState<ApprovalRequest | null>(null);

  const filtered = requests.filter((r) => r.status === tab);

  const pendingCount = requests.filter((r) => r.status === "Pending").length;
  const approvedCount = requests.filter((r) => r.status === "Approved").length;
  const rejectedCount = requests.filter((r) => r.status === "Rejected").length;

  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "Approved",
              approvedBy: "Admin (Supervisor)",
              approvedAt: new Date().toLocaleString("en-GB", { hour12: false }),
            }
          : r
      )
    );
  };

  const handleReject = (id: string) => {
    if (!rejectReasonInput.trim()) return;
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "Rejected",
              approvedBy: "Admin (Supervisor)",
              approvedAt: new Date().toLocaleString("en-GB", { hour12: false }),
              rejectionReason: rejectReasonInput,
            }
          : r
      )
    );
    setRejectingId(null);
    setRejectReasonInput("");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Title */}
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Checksheet System
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">
            Checksheet Approval Center
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review shift submissions, verify abnormalities, and grant formal approvals.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Panel title="Pending Approval">
          <div className="flex items-end justify-between">
            <ValueDisplay label="Requires Review" value={pendingCount} tone={pendingCount > 0 ? "warn" : "ok"} />
            <Clock className={`h-5 w-5 ${pendingCount > 0 ? "text-warn" : "text-ok"} mb-2`} />
          </div>
        </Panel>
        <Panel title="Approved Today">
          <div className="flex items-end justify-between">
            <ValueDisplay label="Verified Records" value={approvedCount} tone="ok" />
            <CheckCircle2 className="h-5 w-5 text-ok mb-2" />
          </div>
        </Panel>
        <Panel title="Rejected Submissions">
          <div className="flex items-end justify-between">
            <ValueDisplay label="Returned to Operator" value={rejectedCount} tone="danger" />
            <XCircle className="h-5 w-5 text-destructive mb-2" />
          </div>
        </Panel>
      </div>

      {/* Tabs & Content */}
      <Panel
        title="Checksheet Submissions"
        right={
          <div className="flex items-center gap-1 bg-secondary p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setTab("Pending")}
              className={`px-3 py-1 rounded-md transition ${
                tab === "Pending" ? "bg-card text-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setTab("Approved")}
              className={`px-3 py-1 rounded-md transition ${
                tab === "Approved" ? "bg-card text-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Approved ({approvedCount})
            </button>
            <button
              onClick={() => setTab("Rejected")}
              className={`px-3 py-1 rounded-md transition ${
                tab === "Rejected" ? "bg-card text-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Rejected ({rejectedCount})
            </button>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <ShieldCheck className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
            <p className="text-sm">No submissions in "{tab}" status.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((r) => (
              <div
                key={r.id}
                className="rounded-lg border border-border/80 bg-secondary/30 p-4 hover:bg-secondary/50 transition"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* Left details */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-primary">{r.id}</span>
                      <span className="rounded bg-secondary px-2 py-0.5 text-[10px] uppercase font-semibold">
                        {r.area}
                      </span>
                      <span className="text-xs font-medium text-foreground">{r.shift}</span>
                    </div>
                    <h4 className="text-sm font-semibold">{r.title}</h4>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                      <span>Date: <strong className="text-foreground">{r.date}</strong></span>
                      <span>Submitted by: <strong className="text-foreground">{r.submittedBy}</strong> at {r.submittedAt}</span>
                      {r.ngItems > 0 ? (
                        <span className="inline-flex items-center gap-1 text-warn font-semibold">
                          <AlertTriangle className="h-3 w-3" /> {r.ngItems} NG Item(s)
                        </span>
                      ) : (
                        <span className="text-ok font-medium">All items OK</span>
                      )}
                    </div>

                    {r.comments && (
                      <div className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground bg-background/60 p-2 rounded border border-border/40">
                        <MessageSquare className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <span>Operator Note: <em>"{r.comments}"</em></span>
                      </div>
                    )}

                    {r.rejectionReason && (
                      <div className="mt-2 flex items-start gap-1.5 text-xs text-destructive bg-destructive/10 p-2 rounded border border-destructive/20">
                        <XCircle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
                        <span>Rejection Reason: <em>"{r.rejectionReason}"</em></span>
                      </div>
                    )}

                    {r.approvedBy && (
                      <div className="mt-1 text-[11px] text-muted-foreground font-mono">
                        Actioned by {r.approvedBy} on {r.approvedAt}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      onClick={() => setSelectedDetail(r)}
                      className="inline-flex items-center gap-1.5 rounded border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-secondary"
                    >
                      <Eye className="h-3.5 w-3.5 text-muted-foreground" /> View Details
                    </button>

                    {r.status === "Pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(r.id)}
                          className="inline-flex items-center gap-1.5 rounded bg-ok px-3 py-1.5 text-xs font-medium text-ok-foreground hover:opacity-90 shadow-sm"
                        >
                          <Check className="h-3.5 w-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => {
                            setRejectingId(r.id);
                            setRejectReasonInput("");
                          }}
                          className="inline-flex items-center gap-1.5 rounded bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground hover:opacity-90 shadow-sm"
                        >
                          <X className="h-3.5 w-3.5" /> Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Inline Rejection Box */}
                {rejectingId === r.id && (
                  <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Enter rejection reason for operator..."
                      value={rejectReasonInput}
                      onChange={(e) => setRejectReasonInput(e.target.value)}
                      className="flex-1 rounded border border-destructive/50 bg-background px-3 py-1.5 text-xs focus:outline-none"
                    />
                    <button
                      onClick={() => handleReject(r.id)}
                      className="rounded bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground hover:opacity-90"
                    >
                      Confirm Reject
                    </button>
                    <button
                      onClick={() => setRejectingId(null)}
                      className="rounded border border-border px-3 py-1.5 text-xs hover:bg-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Panel>

      {/* Modal for Details */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-semibold text-base">{selectedDetail.title}</h3>
                <span className="text-xs font-mono text-muted-foreground">{selectedDetail.id}</span>
              </div>
              <button
                onClick={() => setSelectedDetail(null)}
                className="rounded p-1 hover:bg-secondary text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Area:</span>
                <span className="font-medium">{selectedDetail.area}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Shift:</span>
                <span className="font-medium">{selectedDetail.shift}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">{selectedDetail.date}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Submitted By:</span>
                <span className="font-medium">{selectedDetail.submittedBy} ({selectedDetail.submittedAt})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Status:</span>
                <span className={`font-semibold ${selectedDetail.status === "Approved" ? "text-ok" : selectedDetail.status === "Rejected" ? "text-destructive" : "text-warn"}`}>
                  {selectedDetail.status}
                </span>
              </div>
              {selectedDetail.comments && (
                <div className="py-1">
                  <span className="text-muted-foreground">Comments:</span>
                  <p className="mt-1 bg-secondary/50 p-2 rounded text-foreground italic">{selectedDetail.comments}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedDetail(null)}
                className="rounded-md border border-border px-4 py-2 text-xs font-medium hover:bg-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
