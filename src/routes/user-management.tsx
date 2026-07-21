import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/panel";
import { Plus, Search, Shield, UserCog, MoreHorizontal } from "lucide-react";

export const Route = createFileRoute("/user-management")({
  head: () => ({
    meta: [
      { title: "User Management — Utility Monitoring System" },
      { name: "description", content: "Manage users, roles, and access to the utility monitoring platform." },
    ],
  }),
  component: UserManagementPage,
});

const USERS = [
  { id: "U-001", name: "Andi Wijaya", email: "andi.wijaya@plant.local", role: "Super Admin", area: "All", status: "Active", last: "2 min ago" },
  { id: "U-002", name: "Rina Puspita", email: "rina.puspita@plant.local", role: "Supervisor", area: "Boiler, Oven", status: "Active", last: "18 min ago" },
  { id: "U-003", name: "Budi Santoso", email: "budi.santoso@plant.local", role: "Operator", area: "Boiler", status: "Active", last: "1 hour ago" },
  { id: "U-004", name: "Siti Nurhaliza", email: "siti.nurhaliza@plant.local", role: "Operator", area: "CED", status: "Active", last: "3 hours ago" },
  { id: "U-005", name: "Dedi Kurniawan", email: "dedi.kurniawan@plant.local", role: "Operator", area: "Oven", status: "Active", last: "5 hours ago" },
  { id: "U-006", name: "Maya Lestari", email: "maya.lestari@plant.local", role: "Viewer", area: "All", status: "Inactive", last: "3 days ago" },
];

const ROLES = [
  { role: "Super Admin", count: 1, perms: "Full access — config, users, master data" },
  { role: "Supervisor", count: 2, perms: "Acknowledge alarms, edit parameter setpoints" },
  { role: "Operator", count: 3, perms: "Monitor & acknowledge assigned area" },
  { role: "Viewer", count: 1, perms: "Read-only dashboard access" },
];

function initials(n: string) {
  return n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

function UserManagementPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">User Management</div>
          <h1 className="text-2xl font-semibold mt-1">Users & Roles</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage accounts, role assignments, and area access.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs hover:bg-secondary"><Shield className="h-3.5 w-3.5" />Roles</button>
          <button className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"><Plus className="h-3.5 w-3.5" />Invite User</button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { l: "Total Users", v: USERS.length.toString() },
          { l: "Active", v: USERS.filter((u) => u.status === "Active").length.toString(), tone: "text-ok" },
          { l: "Inactive", v: USERS.filter((u) => u.status !== "Active").length.toString(), tone: "text-muted-foreground" },
          { l: "Online Now", v: "3", tone: "text-ok" },
        ].map((k) => (
          <Panel key={k.l} title={k.l}>
            <div className={`text-3xl font-semibold font-mono tabular-nums ${k.tone ?? ""}`}>{k.v}</div>
          </Panel>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2" title="Users" right={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input placeholder="Search user…" className="h-8 w-64 rounded-md border border-border bg-card pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
        }>
          <div className="overflow-x-auto -mx-4 -my-4">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-[10px] uppercase tracking-widest text-muted-foreground">
                <tr>
                  {["User", "Role", "Area", "Status", "Last Active", ""].map((h) => (
                    <th key={h} className="text-left font-semibold px-4 py-2.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {USERS.map((u) => (
                  <tr key={u.id} className="hover:bg-secondary/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 text-primary text-xs font-semibold">{initials(u.name)}</div>
                        <div>
                          <div className="text-sm font-medium">{u.name}</div>
                          <div className="text-[11px] text-muted-foreground">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded px-2 py-0.5 text-[10px] font-mono uppercase ${
                        u.role === "Super Admin" ? "bg-primary/15 text-primary" :
                        u.role === "Supervisor" ? "bg-warn/15 text-warn" :
                        u.role === "Operator" ? "bg-secondary text-foreground" :
                        "bg-muted text-muted-foreground"
                      }`}>{u.role}</span>
                    </td>
                    <td className="px-4 py-3 text-xs">{u.area}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-mono ${u.status === "Active" ? "text-ok" : "text-muted-foreground"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${u.status === "Active" ? "bg-ok" : "bg-muted-foreground"}`} />
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{u.last}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-secondary" aria-label="more">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title={<span className="inline-flex items-center gap-2"><UserCog className="h-3.5 w-3.5" />Roles & Permissions</span>}>
          <ul className="space-y-2">
            {ROLES.map((r) => (
              <li key={r.role} className="rounded-lg border border-border p-3 hover:bg-secondary/40">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{r.role}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">{r.count} USERS</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{r.perms}</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
