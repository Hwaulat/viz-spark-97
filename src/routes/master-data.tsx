import { createFileRoute, Outlet, Link, useLocation } from "@tanstack/react-router";

export const Route = createFileRoute("/master-data")({
  component: MasterDataLayout,
});

function MasterDataLayout() {
  const location = useLocation();
  const currentPath = location.pathname;

  const tabs = [
    { name: "Equipment", path: "/master-data/equipment" },
    { name: "Station", path: "/master-data/station" },
    { name: "Unit of Measurement", path: "/master-data/uom" },
    { name: "Colors", path: "/master-data/colors" },
    { name: "Type", path: "/master-data/type" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-foreground">Master Data</h1>
        <p className="text-sm text-muted-foreground">Manage configuration data for the system.</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = currentPath.startsWith(tab.path);
            return (
              <Link
                key={tab.name}
                to={tab.path}
                className={`
                  whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                  }
                `}
                aria-current={isActive ? "page" : undefined}
              >
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="pt-2">
        <Outlet />
      </div>
    </div>
  );
}
