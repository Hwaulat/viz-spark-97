import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Activity } from "lucide-react";

export const Route = createFileRoute("/monitoring-area/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Monitoring Details — ${params.id}` },
      { name: "description", content: `Monitoring details for ${params.id}` },
    ],
  }),
  component: MonitoringAreaDetails,
});

function MonitoringAreaDetails() {
  const { id } = Route.useParams();

  // Format the ID back to a readable name
  const name = id
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <Link
            to="/monitoring-area"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Monitoring Area
          </Link>
          <div className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Area Details
          </div>
          <h1 className="text-2xl font-semibold mt-1 inline-flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" /> {name}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Detailed parameter monitoring for this section will be displayed here.
          </p>
        </div>
      </div>

      {/* Placeholder Content */}
      <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground bg-secondary/20">
        <Activity className="h-8 w-8 mx-auto mb-3 text-muted-foreground/50" />
        <p className="text-sm font-medium">Empty Section</p>
        <p className="text-xs mt-1">Data and charts are currently being prepared.</p>
      </div>
    </div>
  );
}
