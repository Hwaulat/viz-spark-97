import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Activity, Flame, Waves, Thermometer, Gauge, Sun, Moon, Bell, PanelLeftClose, LayoutDashboard, FileText, History, Database, Users, ChevronDown } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Panel unreachable</h1>
        <p className="mt-2 text-sm text-muted-foreground">A rendering error occurred.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Retry</button>
          <a href="/" className="rounded-md border border-border px-4 py-2 text-sm font-medium">Dashboard</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Utility Monitoring System — Plant Control Center" },
      { name: "description", content: "Real-time monitoring dashboard for Boiler, CED, and Oven areas." },
      { property: "og:title", content: "Utility Monitoring System" },
      { property: "og:description", content: "Real-time plant utility monitoring — Boiler, CED, Oven." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

const themeInitScript = `try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}`;

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const DASHBOARD_CHILDREN = [
  { to: "/", label: "General", icon: Gauge, exact: true },
  { to: "/boiler", label: "Boiler Area", icon: Flame },
  { to: "/ced", label: "CED Area", icon: Waves },
  { to: "/oven", label: "Oven Area", icon: Thermometer },
] as const;

const OTHER_NAV = [
  { to: "/report", label: "Report", icon: FileText },
  { to: "/log-history", label: "Log History", icon: History },
  { to: "/master-data", label: "Master Data", icon: Database },
  { to: "/user-management", label: "User Management", icon: Users },
] as const;

const linkBase =
  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/75 hover:bg-white/5 hover:text-sidebar-foreground transition";
const linkActive =
  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm bg-sidebar-accent text-white shadow-md shadow-sidebar-accent/30";

function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const dashboardActive = DASHBOARD_CHILDREN.some((c) =>
    c.exact ? pathname === c.to : pathname.startsWith(c.to),
  );
  const [dashOpen, setDashOpen] = useState(dashboardActive);
  useEffect(() => { if (dashboardActive) setDashOpen(true); }, [dashboardActive]);

  return (
    <aside className="hidden md:flex md:w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-sidebar-accent to-primary/60 shadow-lg">
          <Activity className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="text-sm font-semibold leading-tight">UtilityOps</div>
          <div className="text-[10px] uppercase tracking-widest text-sidebar-muted">Monitoring System</div>
        </div>
      </div>

      <div className="px-5 pt-4 pb-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-muted">
        Core Functions
      </div>
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        <button
          type="button"
          onClick={() => setDashOpen((v) => !v)}
          className={`w-full ${dashboardActive ? "text-sidebar-foreground" : "text-sidebar-foreground/75"} flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-white/5 transition`}
          aria-expanded={dashOpen}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span className="flex-1 text-left">Dashboard</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${dashOpen ? "rotate-180" : ""}`} />
        </button>
        {dashOpen && (
          <div className="ml-3 pl-3 border-l border-sidebar-border space-y-1">
            {DASHBOARD_CHILDREN.map((c) => (
              <Link
                key={c.to}
                to={c.to}
                activeOptions={{ exact: c.exact }}
                className={linkBase + " py-2 text-[13px]"}
                activeProps={{ className: linkActive + " py-2 text-[13px]" }}
              >
                <c.icon className="h-3.5 w-3.5" />
                {c.label}
              </Link>
            ))}
          </div>
        )}

        <div className="pt-3 mt-3 border-t border-sidebar-border" />

        {OTHER_NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            className={linkBase}
            activeProps={{ className: linkActive }}
          >
            <n.icon className="h-4 w-4" />
            {n.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 mt-2">
        <div className="rounded-lg bg-white/5 border border-sidebar-border p-3 text-[11px]">
          <div className="flex items-center justify-between text-sidebar-muted">
            <span>PLC LINK</span>
            <span className="inline-flex items-center gap-1.5 text-ok"><span className="h-1.5 w-1.5 rounded-full bg-ok animate-pulse" />ONLINE</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-sidebar-muted">
            <span>MC PROTOCOL</span>
            <span className="text-sidebar-foreground">42 ms</span>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-[10px] text-sidebar-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-ok" />
          System Online
          <span className="ml-auto font-mono">v2.4.1</span>
        </div>
      </div>
    </aside>
  );
}

function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    try { localStorage.setItem("theme", next); } catch {}
  };
  return { theme, toggle };
}

function TopBar() {
  const { theme, toggle } = useTheme();
  const [ts, setTs] = useState("");
  useEffect(() => {
    const tick = () => setTs(new Date().toLocaleString("en-GB", { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-3">
        <button className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-secondary" aria-label="collapse">
          <PanelLeftClose className="h-4 w-4" />
        </button>
        <div className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-ok" />AC 220V</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-ok" />DC 24V</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-ok" />RUN</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-warn" />1 ALARM</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline rounded-md bg-secondary px-2.5 py-1 text-[11px] font-mono text-muted-foreground">MODE: AUTO</span>
        <span className="font-mono text-xs text-foreground tabular-nums">{ts || "—"}</span>
        <button
          onClick={toggle}
          className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <button className="relative grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground" aria-label="notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
        </button>
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">A</div>
          <div className="hidden sm:block text-xs leading-tight">
            <div className="font-semibold">Admin</div>
            <div className="text-muted-foreground text-[10px]">Super Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <main className="flex-1 overflow-auto"><Outlet /></main>
        </div>
      </div>
    </QueryClientProvider>
  );
}
