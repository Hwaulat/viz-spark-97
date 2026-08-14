const fs = require('fs');

// 1. T1 and T2 horizontal in Boiler Area
let indexContent = fs.readFileSync('src/routes/monitoring-area.index.tsx', 'utf-8');
// Before: <div className=\"flex gap-4 text-xs font-mono items-center\"> <span className=\"text-muted-foreground flex flex-col items-center\">T1 <span className=\"text-foreground font-bold text-2xl mt-1\">{b.temp1.toFixed(1)}°C</span></span>
// We want: side by side.
indexContent = indexContent.replace(
  /<div className=\"flex gap-4 text-xs font-mono items-center\">\s*<span className=\"text-muted-foreground flex flex-col items-center\">T1 <span className=\"text-foreground font-bold text-2xl mt-1\">\{b\.temp1\.toFixed\(1\)}°C<\/span><\/span>\s*<span className=\"text-muted-foreground flex flex-col items-center\">T2 <span className=\"text-foreground font-bold text-2xl mt-1\">\{b\.temp2\.toFixed\(1\)}°C<\/span><\/span>\s*<\/div>/g,
  `<div className=\"flex gap-4 text-xs font-mono items-center\">
    <span className=\"text-muted-foreground flex items-baseline gap-2\">T1 <span className=\"text-foreground font-bold text-2xl\">{b.temp1.toFixed(1)}°C</span></span>
    <span className=\"text-muted-foreground flex items-baseline gap-2\">T2 <span className=\"text-foreground font-bold text-2xl\">{b.temp2.toFixed(1)}°C</span></span>
  </div>`
);

// 2. Pre Degreasing and Phosphate vertical 
// Before: <div className=\"grid grid-cols-2 gap-3 mt-2\">
indexContent = indexContent.replace(
  /\{area\.type === "temp-dual" && \(\s*<div className="grid grid-cols-2 gap-3 mt-2">/g,
  '{area.type === "temp-dual" && (\n                <div className="flex flex-col gap-3 mt-2">'
);
fs.writeFileSync('src/routes/monitoring-area.index.tsx', indexContent);

// 3. Remove Oven Area and CED Area from sidebar in __root.tsx
let rootContent = fs.readFileSync('src/routes/__root.tsx', 'utf-8');
rootContent = rootContent.replace(/\{ to: "\/ced", label: "CED Area", icon: Waves \},\n\s*\{ to: "\/oven", label: "Oven Area", icon: Thermometer \},\n/g, '');
fs.writeFileSync('src/routes/__root.tsx', rootContent);

// 4. Update Line Tracking UI in monitoring-area.$id.tsx
let detailContent = fs.readFileSync('src/routes/monitoring-area.$id.tsx', 'utf-8');
// a) prevent crop: h-[550px] -> min-h-[550px]
detailContent = detailContent.replace(/<div className="relative w-full h-\[550px\] overflow-auto flex items-center justify-center bg-background p-4">/g, '<div className="relative w-full min-h-[600px] overflow-auto flex items-center justify-center bg-background p-4 bg-[url(\'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CiAgPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlNWU3ZWIiIHN0cm9rZS13aWR0aD0iMC41Ii8+Cjwvc3ZnPg==\')] dark:bg-[url(\'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CiAgPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJub25lIiBzdHJva2U9IiMzMzQxNTUiIHN0cm9rZS13aWR0aD0iMC41Ii8+Cjwvc3ZnPg==\')]">');
// b) change SVG line to path: add a CSS filter or similar to the image
detailContent = detailContent.replace(/className="max-w-full h-auto object-contain drop-shadow-sm"/g, 'className="max-w-full h-auto object-contain drop-shadow-sm dark:invert dark:opacity-80" style={{ filter: "drop-shadow(0px 0px 4px rgba(0,0,0,0.2))" }}');
fs.writeFileSync('src/routes/monitoring-area.$id.tsx', detailContent);

console.log('done');
