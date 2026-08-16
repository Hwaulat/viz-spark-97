const fs = require('fs');
let indexContent = fs.readFileSync('src/routes/monitoring-area.index.tsx', 'utf-8');

// Add Line Tracking to AREAS
if (!indexContent.includes('{ id: "line-tracking"')) {
    indexContent = indexContent.replace(
        /const AREAS: AreaDef\[\] = \[/,
        'const AREAS: AreaDef[] = [\n  { id: "line-tracking", name: "Line Tracking", type: "line-tracking" },'
    );
}

// Add line-tracking to AreaCardType
if (!indexContent.includes('"line-tracking"')) {
    indexContent = indexContent.replace(
        /type AreaCardType = "boiler" \| "temp-single" \| "temp-dual" \| "oven-elec" \| "temp-pressure";/,
        'type AreaCardType = "boiler" | "temp-single" | "temp-dual" | "oven-elec" | "temp-pressure" | "line-tracking";'
    );
}

// Add to col1Areas
if (!indexContent.includes('"line-tracking"')) {
  indexContent = indexContent.replace(
    /const col1Areas = \["boiler-area"\]/g,
    'const col1Areas = ["boiler-area", "line-tracking"]'
  );
} else {
  // If line-tracking is not in col1Areas, add it.
  if (!indexContent.match(/const col1Areas = \[[^\]]*"line-tracking"[^\]]*\]/)) {
     indexContent = indexContent.replace(
       /const col1Areas = \["boiler-area"\]/g,
       'const col1Areas = ["boiler-area", "line-tracking"]'
     );
  }
}

// Also wait, I need to add AreaCard support for type === 'line-tracking'
if (!indexContent.includes('area.type === "line-tracking"')) {
  // I need to add it inside AreaCard
  const lineTrackingCard = `              {area.type === "line-tracking" && (
                <div className="grid gap-2 mt-2">
                  <div className="rounded-md bg-secondary/50 p-2 border border-border/50">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-muted-foreground">Pre-Degreasing</span>
                      <div className="flex gap-2">
                        <span className="text-foreground">PV: 46.2°C</span>
                        <span className="text-muted-foreground">SP: 45.0°C</span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-md bg-secondary/50 p-2 border border-border/50">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-muted-foreground">Degreasing</span>
                      <div className="flex gap-2">
                        <span className="text-foreground">PV: 52.8°C</span>
                        <span className="text-muted-foreground">SP: 52.0°C</span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-md bg-secondary/50 p-2 border border-border/50">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-muted-foreground">Flood</span>
                      <div className="flex gap-2">
                        <span className="text-destructive font-semibold">PV: 28.5°C</span>
                        <span className="text-muted-foreground">SP: 30.0°C</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}`;
  
  indexContent = indexContent.replace(
    /(<Panel[^>]*>)/,
    `$1\n${lineTrackingCard}`
  );
}

fs.writeFileSync('src/routes/monitoring-area.index.tsx', indexContent);
