import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/master-data")({
  component: MasterDataLayout,
});

function MasterDataLayout() {
  return (
    <div className="p-6 space-y-6">
      {/* Page Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-foreground">Master Data</h1>
        <p className="text-sm text-muted-foreground">Manage configuration data for the system.</p>
      </div>

      {/* Main Content Area */}
      <Outlet />
    </div>
  );
}
