const fs = require('fs');
let svgContent = fs.readFileSync('Line Tracking.svg', 'utf-8');
svgContent = svgContent.replace(/stroke="#000000"/gi, 'stroke="#94a3b8" stroke-dasharray="10, 5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"');
svgContent = svgContent.replace(/stroke="black"/gi, 'stroke="#94a3b8" stroke-dasharray="10, 5" stroke-width="4" stroke-linecap=\"round" stroke-linejoin="round"');
svgContent = svgContent.replace(/stroke="#000"/gi, 'stroke="#94a3b8" stroke-dasharray="10, 5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"');
fs.writeFileSync('public/Line-Tracking.svg', svgContent);
fs.writeFileSync('Line Tracking.svg', svgContent);
console.log('done svg replacement');
