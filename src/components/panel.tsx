import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Panel({
  title, subtitle, right, children, className, bodyClassName, tone = "default",
}: {
  title?: ReactNode; subtitle?: ReactNode; right?: ReactNode;
  children: ReactNode; className?: string; bodyClassName?: string;
  tone?: "default" | "ok" | "warn" | "danger";
}) {
  const toneBorder = {
    default: "border-border",
    ok: "border-ok/40",
    warn: "border-warn/50",
    danger: "border-destructive/60",
  }[tone];
  return (
    <section className={cn(
      "rounded-xl border bg-card text-card-foreground shadow-sm",
      toneBorder, className,
    )}>
      {(title || right) && (
        <header className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border">
          <div>
            {title && <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{title}</h3>}
            {subtitle && <p className="text-sm text-foreground mt-0.5">{subtitle}</p>}
          </div>
          {right}
        </header>
      )}
      <div className={cn("p-4", bodyClassName)}>{children}</div>
    </section>
  );
}

export function StatusDot({ state, size = 10, pulse = false }: { state: "on" | "off" | "warn" | "alarm" | "idle"; size?: number; pulse?: boolean }) {
  const color = {
    on: "bg-ok shadow-[0_0_10px_var(--ok)]",
    off: "bg-muted-foreground/60",
    warn: "bg-warn shadow-[0_0_10px_var(--warn)]",
    alarm: "bg-destructive shadow-[0_0_12px_var(--destructive)]",
    idle: "bg-muted-foreground/40",
  }[state];
  return <span className={cn("inline-block rounded-full", color, pulse && "pulse-alarm")} style={{ width: size, height: size }} />;
}

export function ValueDisplay({ label, value, unit, tone = "default", mono = true }:
  { label: string; value: string | number; unit?: string; tone?: "default" | "ok" | "warn" | "danger"; mono?: boolean }) {
  const toneCls = {
    default: "text-foreground",
    ok: "text-ok",
    warn: "text-warn",
    danger: "text-destructive",
  }[tone];
  return (
    <div className="rounded-md bg-secondary/50 px-3 py-2.5 border border-border/50">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={cn("mt-1 flex items-baseline gap-1.5", mono && "font-mono")}>
        <span className={cn("text-2xl font-semibold tabular-nums", toneCls)}>{value}</span>
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}
