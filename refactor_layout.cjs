const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'routes', 'monitoring-area.index.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

const moStart = content.indexOf('function MonitoringArea() {');
const headerStart = content.indexOf('{/* Header */}', moStart);
const gridStart = content.indexOf('{/* Grid of Sections */}', moStart);

const headerBlock = content.substring(headerStart, gridStart).trim();

const linkStart = content.indexOf('<Link', gridStart);
let linkEndMatch;
const regex = /<\/Link>/g;
regex.lastIndex = gridStart;
let match;
while ((match = regex.exec(content)) !== null) {
  linkEndMatch = match;
}

if (!linkEndMatch) {
  console.error("Link not found");
  process.exit(1);
}

const linkEnd = linkEndMatch.index + '</Link>'.length;
let linkBlock = content.substring(linkStart, linkEnd);

// Fix the Link className and remove key
linkBlock = linkBlock.replace(/className="block group"/g, 'className="block group h-full"');
linkBlock = linkBlock.replace(/key=\{area\.id\}/g, '');

const areaCardComp = `
function AreaCard({ area }: { area: AreaDef }) {
  return (
    ${linkBlock}
  );
}
`;

const monitoringAreaComp = `
function MonitoringArea() {
  const col1Areas = ["boiler-area"].map(id => AREAS.find(a => a.id === id)).filter(Boolean) as AreaDef[];
  const col2Areas = ["flood-station", "degreasing", "pted-bag-filter"].map(id => AREAS.find(a => a.id === id)).filter(Boolean) as AreaDef[];
  const col3Areas = ["pree-degreasing", "phosphate"].map(id => AREAS.find(a => a.id === id)).filter(Boolean) as AreaDef[];
  const ovenAreas = ["oven-sealing", "oven-topcoat", "oven-ced"].map(id => AREAS.find(a => a.id === id)).filter(Boolean) as AreaDef[];

  return (
    <div className="p-6 space-y-6">
      ${headerBlock}

      {/* Layout Grid */}
      <div className="flex flex-col gap-6">
        {/* Top Section */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Column 1: Boiler Area */}
          <div className="flex flex-col gap-4">
            {col1Areas.map(area => <AreaCard key={area.id} area={area} />)}
          </div>
          
          {/* Column 2: Flood, Degreasing, PTED */}
          <div className="flex flex-col gap-4">
            {col2Areas.map(area => <AreaCard key={area.id} area={area} />)}
          </div>
          
          {/* Column 3: Pre Degreasing, Phosphate */}
          <div className="flex flex-col gap-4">
            {col3Areas.map(area => <AreaCard key={area.id} area={area} />)}
          </div>
        </div>

        {/* Bottom Section: Ovens */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ovenAreas.map(area => <AreaCard key={area.id} area={area} />)}
        </div>
      </div>
    </div>
  );
}
`;

const newContent = content.substring(0, moStart) + areaCardComp + monitoringAreaComp;
fs.writeFileSync(filePath, newContent, 'utf-8');
console.log("Done");
