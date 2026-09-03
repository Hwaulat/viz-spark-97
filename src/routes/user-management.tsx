import { createFileRoute } from "@tanstack/react-router";
import {
  Eye,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Users,
  UserCheck,
  UserMinus,
  RefreshCw,
  Pencil,
  Trash2,
  X,
  Upload,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/user-management")({
  head: () => ({
    meta: [
      { title: "User Management — Utility Monitoring System" },
      {
        name: "description",
        content: "Manage users, roles, and permissions.",
      },
    ],
  }),
  component: UserManagementPage,
});

/* ── Types ────────────────────────────────────────────────── */
interface UserRow {
  id: string;
  status: "Active" | "Inactive";
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface RoleRow {
  name: string;
  count: number;
}

/* ── Mock Data ────────────────────────────────────────────── */
const USERS: UserRow[] = [
  {
    id: "U1",
    status: "Inactive",
    name: "Kathryn Murphy",
    email: "admin@ragdalion.com",
    role: "Super Admin",
    avatar: "https://i.pravatar.cc/150?u=1",
  },
  {
    id: "U2",
    status: "Active",
    name: "Hasan Waulat",
    email: "admin@ragdalion.com",
    role: "Super Admin",
    avatar: "https://i.pravatar.cc/150?u=2",
  },
  {
    id: "U3",
    status: "Active",
    name: "Albert Flores",
    email: "admin@ragdalion.com",
    role: "Super Admin",
    avatar: "https://i.pravatar.cc/150?u=3",
  },
  {
    id: "U4",
    status: "Active",
    name: "Theresa Webb",
    email: "admin@ragdalion.com",
    role: "Super Admin",
    avatar: "https://i.pravatar.cc/150?u=4",
  },
  {
    id: "U5",
    status: "Active",
    name: "Brooklyn Simmons",
    email: "admin@ragdalion.com",
    role: "Super Admin",
    avatar: "https://i.pravatar.cc/150?u=5",
  },
  {
    id: "U6",
    status: "Active",
    name: "Annette Black",
    email: "admin@ragdalion.com",
    role: "Admin",
    avatar: "https://i.pravatar.cc/150?u=6",
  },
  {
    id: "U7",
    status: "Active",
    name: "Marvin McKinney",
    email: "admin@ragdalion.com",
    role: "Admin",
    avatar: "https://i.pravatar.cc/150?u=7",
  },
  {
    id: "U8",
    status: "Active",
    name: "Arlene McCoy",
    email: "admin@ragdalion.com",
    role: "User",
    avatar: "https://i.pravatar.cc/150?u=8",
  },
  {
    id: "U9",
    status: "Active",
    name: "Eleanor Pena",
    email: "admin@ragdalion.com",
    role: "User",
    avatar: "https://i.pravatar.cc/150?u=9",
  },
  {
    id: "U10",
    status: "Active",
    name: "Guy Hawkins",
    email: "admin@ragdalion.com",
    role: "Admin",
    avatar: "https://i.pravatar.cc/150?u=10",
  },
];

const ROLES: RoleRow[] = [
  { name: "Super Admin", count: 2 },
  { name: "Admin", count: 4 },
  { name: "PIC", count: 4 },
  { name: "Manager", count: 4 },
];

/* ── Component ────────────────────────────────────────────── */
function UserManagementPage() {
  const [tab, setTab] = useState<"users" | "roles">("users");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);

  const totalUsers = 10;
  const activeUsers = 9;
  const inactiveUsers = 1;

  return (
    <div className="p-6 space-y-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-5 w-5 text-foreground" />
        <div>
          <h1 className="text-xl font-bold tracking-tight">Users Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage users, roles, and permissions
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-border">
        <button
          onClick={() => setTab("users")}
          className={`flex items-center gap-2 px-1 py-3 text-sm font-semibold border-b-2 transition-colors ${
            tab === "users"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="h-4 w-4" />
          User Account
        </button>
        <button
          onClick={() => setTab("roles")}
          className={`flex items-center gap-2 px-1 py-3 text-sm font-semibold border-b-2 transition-colors ${
            tab === "roles"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <UserCheck className="h-4 w-4" />
          Role Permissions
        </button>
      </div>

      {tab === "users" && (
        <div className="space-y-4 pt-4">
          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <SummaryCard
              label="Total Users"
              value={totalUsers}
              icon={<Users className="h-5 w-5 text-primary" />}
              iconBg="bg-primary/10"
            />
            <SummaryCard
              label="Active Users"
              value={activeUsers}
              icon={<UserCheck className="h-5 w-5 text-ok" />}
              iconBg="bg-ok/10"
              valueColor="text-ok"
            />
            <SummaryCard
              label="Inactive Users"
              value={inactiveUsers}
              icon={<UserMinus className="h-5 w-5 text-destructive" />}
              iconBg="bg-destructive/10"
              valueColor="text-destructive"
            />
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-3 flex-wrap pt-2">
            <div className="flex items-center gap-2 flex-1 min-w-[300px] rounded-lg border border-border bg-card px-3 py-2.5">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                placeholder="Search by username or email"
              />
            </div>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2.5 text-sm whitespace-nowrap">
              All Role
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Create New User
            </button>
          </div>

          {/* Table */}
          <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden mt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50 text-[10px] uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="text-left font-semibold px-6 py-3 w-40">
                      Action
                    </th>
                    <th className="text-left font-semibold px-6 py-3">
                      Status ▾
                    </th>
                    <th className="text-left font-semibold px-6 py-3">
                      Username ▾
                    </th>
                    <th className="text-left font-semibold px-6 py-3">
                      Role ▾
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {USERS.map((user) => (
                    <tr key={user.id} className="hover:bg-secondary/30">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="rounded p-1.5 hover:bg-secondary text-muted-foreground"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="rounded p-1.5 hover:bg-secondary text-muted-foreground">
                            <RefreshCw className="h-4 w-4" />
                          </button>
                          <button className="rounded p-1.5 hover:bg-secondary text-muted-foreground">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button className="rounded p-1.5 hover:bg-secondary text-muted-foreground">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            className={`w-9 h-5 rounded-full relative transition-colors ${
                              user.status === "Active"
                                ? "bg-primary"
                                : "bg-muted-foreground/30"
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${
                                user.status === "Active" ? "translate-x-4" : ""
                              }`}
                            />
                          </button>
                          <span className="text-sm font-medium">
                            {user.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-8 w-8 rounded-full object-cover bg-secondary"
                          />
                          <div>
                            <div className="text-sm font-semibold">
                              {user.name}
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-sm text-muted-foreground">
                        {user.role}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-border text-sm text-muted-foreground">
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
                    className={`h-8 w-8 rounded text-sm font-medium ${
                      p === 1
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
      )}

      {tab === "roles" && (
        <div className="pt-4 grid gap-6 md:grid-cols-[300px_1fr] items-start">
          {/* Roles List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Roles</h2>
              <button className="inline-flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90">
                <Plus className="h-3.5 w-3.5" />
                Create New Role
              </button>
            </div>
            <div className="space-y-2">
              {ROLES.map((role, idx) => (
                <div
                  key={role.name}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    idx === 0
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border"
                  }`}
                >
                  <div>
                    <div className="font-semibold">{role.name}</div>
                    <div
                      className={`text-xs ${
                        idx === 0 ? "text-primary-foreground/80" : "text-muted-foreground"
                      }`}
                    >
                      {role.count} users
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      className={`rounded p-1.5 ${
                        idx === 0
                          ? "bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border border-primary-foreground/30"
                          : "bg-primary text-primary-foreground hover:opacity-90"
                      }`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button className="rounded p-1.5 bg-destructive text-destructive-foreground hover:opacity-90">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Permissions Table */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-bold">Super Admin</h2>
            <p className="text-xs text-muted-foreground mb-6">
              Configure access by module
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
                  <tr>
                    <th className="text-left font-semibold pb-3">Fitur ▾</th>
                    <th className="text-center font-semibold pb-3">
                      All Access
                    </th>
                    <th className="text-center font-semibold pb-3">Create</th>
                    <th className="text-center font-semibold pb-3">Update</th>
                    <th className="text-center font-semibold pb-3">Delete</th>
                    <th className="text-center font-semibold pb-3">
                      Only View
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    "Dashboard",
                    "Daily Progres",
                    "Reports",
                    "All Master Data",
                    "Users Management",
                  ].map((feature, fi) => {
                    // Just some mock logic to match the design (Dashboard & Reports have fewer checks)
                    const fullChecks = fi === 1 || fi === 3 || fi === 4;
                    return (
                      <tr key={feature}>
                        <td className="py-4 font-medium">{feature}</td>
                        <td className="py-4 text-center">
                          <CheckIcon checked={true} />
                        </td>
                        <td className="py-4 text-center">
                          <CheckIcon checked={fullChecks} />
                        </td>
                        <td className="py-4 text-center">
                          <CheckIcon checked={fullChecks} />
                        </td>
                        <td className="py-4 text-center">
                          <CheckIcon checked={fullChecks} />
                        </td>
                        <td className="py-4 text-center">
                          <CheckIcon checked={false} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Modals ────────────────────────────────────────────── */}

      {/* Create New User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-primary">
                  <Plus className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-bold">Create New User</h2>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded p-1 hover:bg-secondary text-muted-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 mb-4">
              <FormField label="Name" required>
                <input
                  type="text"
                  placeholder="Hasanwaulat"
                  className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
                />
              </FormField>
              <FormField label="Email" required>
                <input
                  type="email"
                  placeholder="hasan@gmail.com"
                  className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
                />
              </FormField>
              <div className="md:col-span-2">
                <FormField label="Role" required>
                  <div className="relative">
                    <select className="w-full appearance-none rounded-lg border border-border bg-card px-3 py-2.5 text-sm">
                      <option>Admin</option>
                      <option>Super Admin</option>
                      <option>User</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </FormField>
              </div>
              <div className="md:col-span-2">
                <FormField label="Upload Photo" required>
                  <div className="flex items-center justify-between rounded-lg border border-border bg-card/50 p-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded bg-destructive/10 text-destructive font-bold text-[10px]">
                        PNG
                      </div>
                      <div>
                        <div className="text-sm font-semibold">Image.png</div>
                        <div className="text-[11px] text-muted-foreground">
                          2 MB
                        </div>
                      </div>
                    </div>
                    <button className="text-destructive hover:opacity-80">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </FormField>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-secondary"
              >
                Cancel
              </button>
              <button className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-primary">
                  <Eye className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-bold">Details</h2>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="rounded p-1 hover:bg-secondary text-muted-foreground z-10 relative"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Photo Column */}
              <div className="space-y-3 shrink-0">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="w-48 h-48 rounded-lg object-cover border border-border bg-secondary"
                />
                <button className="w-full inline-flex justify-center items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:bg-secondary">
                  <Pencil className="h-4 w-4 text-muted-foreground" />
                  Change Photo
                </button>
              </div>
              {/* Details Column */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Status
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      selectedUser.status === "Active"
                        ? "text-ok"
                        : "text-muted-foreground"
                    }`}
                  >
                    {selectedUser.status}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Name</div>
                  <div className="text-sm font-semibold">
                    {selectedUser.name.replace(" ", "")}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Email
                  </div>
                  <div className="text-sm font-semibold">
                    {selectedUser.email.replace("admin@ragdalion.com", "hasan@gmail.com")}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Role</div>
                  <div className="text-sm font-semibold">
                    {selectedUser.role}
                  </div>
                </div>
                <div className="col-span-2 flex justify-end mt-4">
                  <button className="inline-flex items-center gap-2 rounded-lg bg-ok px-5 py-2.5 text-sm font-semibold text-ok-foreground shadow-sm hover:opacity-90">
                    <RefreshCw className="h-4 w-4" />
                    Reset Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ───────────────────────────────────────── */
function SummaryCard({
  label,
  value,
  icon,
  iconBg,
  valueColor = "text-foreground",
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
  valueColor?: string;
}) {
  return (
    <div className="rounded-lg bg-card border border-border p-4 shadow-sm flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
      <div>
        <div className={`text-2xl font-bold ${valueColor}`}>{value}</div>
      </div>
    </div>
  );
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
      <label className="text-sm font-semibold text-foreground">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function CheckIcon({ checked }: { checked: boolean }) {
  if (!checked) {
    return <div className="mx-auto h-5 w-5 rounded bg-secondary/50 border border-border/50" />;
  }
  return (
    <div className="mx-auto grid h-5 w-5 place-items-center rounded bg-primary text-primary-foreground">
      <CheckCircle2 className="h-4 w-4" />
    </div>
  );
}
