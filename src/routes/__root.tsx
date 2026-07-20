import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Activity, Flame, Waves, Thermometer, Gauge } from "lucide-react";

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
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const NAV = [
  { to: "/", label: "Overview", icon: Gauge, exact: true },
  { to: "/boiler", label: "Boiler Area", icon: Flame },
  { to: "/ced", label: "CED Area", icon: Waves },
  { to: "/oven", label: "Oven Area", icon: Thermometer },
];

function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-60 shrink-0 flex-col border-r border-border bg-panel">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-border">
        <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/15 text-primary">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-semibold leading-tight">UtilityOps</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Plant Control</div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            activeOptions={{ exact: n.exact }}
            className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
            activeProps={{ className: "flex items-center gap-3 rounded-md px-3 py-2 text-sm bg-accent text-foreground border-l-2 border-primary" }}
          >
            <n.icon className="h-4 w-4" />
            {n.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-border">
        <div className="rounded-md bg-secondary/60 p-3 text-[11px]">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>PLC LINK</span>
            <span className="inline-flex items-center gap-1.5 text-ok"><span className="h-1.5 w-1.5 rounded-full bg-ok animate-pulse" />ONLINE</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-muted-foreground">
            <span>MC PROTOCOL</span>
            <span className="text-foreground">42 ms</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function TopBar() {
  const now = new Date();
  const ts = now.toLocaleString("en-GB", { hour12: false });
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-panel/60 px-6 backdrop-blur">
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-ok" />AC 220V</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-ok" />DC 24V</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-ok" />RUN</span>
        <span className="inline-flex items-center gap-1.5 opacity-60"><span className="h-2 w-2 rounded-full bg-muted-foreground" />STOP</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-warn" />1 ALARM</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="rounded-md bg-secondary px-2.5 py-1 text-[11px] font-mono text-muted-foreground">MODE: AUTO</span>
        <span className="font-mono text-xs text-foreground">{ts}</span>
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
