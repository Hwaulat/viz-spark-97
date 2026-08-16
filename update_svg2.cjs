const fs = require('fs');
let svgContent = fs.readFileSync('Line Tracking.svg', 'utf-8');
svgContent = svgContent.replace(/stroke="#000000"/gi, 'stroke="#94a3b8" stroke-dasharray="15, 10" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"');
svgContent = svgContent.replace(/stroke="black"/gi, 'stroke="#94a3b8" stroke-dasharray="15, 10" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"');
svgContent = svgContent.replace(/stroke="#000"/gi, 'stroke="#94a3b8" stroke-dasharray="15, 10" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"');
fs.writeFileSync('src/assets/Line-Tracking.svg', svgContent);
console.log('SVG updated and copied to assets');
