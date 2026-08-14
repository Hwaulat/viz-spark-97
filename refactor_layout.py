import sys

with open(r'c:\Users\waula\Downloads\viz-spark-97-main\src\routes\monitoring-area.index.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# The map starts at: {AREAS.map((area) => (
# It ends at: ))}
import re

# Find the start of the MonitoringArea function
mo_start = content.find('function MonitoringArea() {')

header_start = content.find('{/* Header */}', mo_start)
grid_start = content.find('{/* Grid of Sections */}', mo_start)

# Extract the header block
header_block = content[header_start:grid_start].strip()

# Extract the Link block
link_start = content.find('<Link', grid_start)
link_end_match = list(re.finditer(r'</Link>', content[grid_start:]))
if not link_end_match:
    print("Link not found")
    sys.exit(1)
link_end = grid_start + link_end_match[-1].end()

link_block = content[link_start:link_end]

# Create AreaCard component
area_card_comp = f"""
function AreaCard({{ area }}: {{ area: AreaDef }}) {{
  return (
    {link_block.replace('key={area.id}', 'className="block group h-full"')}
  );
}}
"""

# Replace the original `className="block group"` inside AreaCard with `className="block group h-full"` so that cards stretch.
area_card_comp = area_card_comp.replace('className="block group"', 'className="block group h-full"')
area_card_comp = area_card_comp.replace('key={area.id}', '')

monitoring_area_comp = f"""
function MonitoringArea() {{
  const col1Areas = ["boiler-area"].map(id => AREAS.find(a => a.id === id)!).filter(Boolean);
  const col2Areas = ["flood-station", "degreasing", "pted-bag-filter"].map(id => AREAS.find(a => a.id === id)!).filter(Boolean);
  const col3Areas = ["pree-degreasing", "phosphate"].map(id => AREAS.find(a => a.id === id)!).filter(Boolean);
  const ovenAreas = ["oven-sealing", "oven-topcoat", "oven-ced"].map(id => AREAS.find(a => a.id === id)!).filter(Boolean);

  return (
    <div className="p-6 space-y-6">
      {header_block}

      {/* Layout Grid */}
      <div className="flex flex-col gap-6">
        {/* Top Section */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Column 1: Boiler Area */}
          <div className="flex flex-col gap-4">
            {{col1Areas.map(area => <AreaCard key={{area.id}} area={{area}} />)}}
          </div>
          
          {/* Column 2: Flood, Degreasing, PTED */}
          <div className="flex flex-col gap-4">
            {{col2Areas.map(area => <AreaCard key={{area.id}} area={{area}} />)}}
          </div>
          
          {/* Column 3: Pre Degreasing, Phosphate */}
          <div className="flex flex-col gap-4">
            {{col3Areas.map(area => <AreaCard key={{area.id}} area={{area}} />)}}
          </div>
        </div>

        {/* Bottom Section: Ovens */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {{ovenAreas.map(area => <AreaCard key={{area.id}} area={{area}} />)}}
        </div>
      </div>
    </div>
  );
}}
"""

new_content = content[:mo_start] + area_card_comp + monitoring_area_comp

with open(r'c:\Users\waula\Downloads\viz-spark-97-main\src\routes\monitoring-area.index.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Done")
