const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src/components');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.jsx'));

const replacements = [
  { regex: /bg-\[\#131313\]/g, replacement: 'bg-slate-50' },
  { regex: /bg-\[\#1c1b1b\]/g, replacement: 'bg-white' },
  { regex: /bg-\[\#201f1f\]/g, replacement: 'bg-slate-100' },
  { regex: /bg-\[\#353534\]/g, replacement: 'bg-slate-200' },
  { regex: /bg-\[\#252424\]/g, replacement: 'bg-slate-100' },
  { regex: /text-white/g, replacement: 'text-slate-900' },
  { regex: /text-gray-300/g, replacement: 'text-slate-600' },
  { regex: /text-gray-400/g, replacement: 'text-slate-500' },
  { regex: /text-\[\#00E5FF\]/g, replacement: 'text-blue-600' },
  { regex: /bg-\[\#00E5FF\]\/20/g, replacement: 'bg-blue-100' },
  { regex: /bg-\[\#00E5FF\]\/40/g, replacement: 'bg-blue-200' },
  { regex: /border-\[\#00E5FF\]\/40/g, replacement: 'border-blue-300' },
  { regex: /border-\[\#00E5FF\]/g, replacement: 'border-blue-500' },
  { regex: /text-\[\#97d700\]/g, replacement: 'text-emerald-600' },
  { regex: /bg-\[\#97d700\]\/20/g, replacement: 'bg-emerald-100' },
  { regex: /border-\[\#97d700\]\/40/g, replacement: 'border-emerald-300' },
  { regex: /border-\[\#97d700\]/g, replacement: 'border-emerald-500' },
  { regex: /border-white\/10/g, replacement: 'border-slate-200' },
  { regex: /border-white\/5/g, replacement: 'border-slate-100' },
  { regex: /shadow-neo/g, replacement: 'shadow-sm' },
  { regex: /from-\[\#1c1b1b\] to-\[\#131313\]/g, replacement: 'from-white to-slate-50' },
  { regex: /from-\[\#97d700\] to-\[\#00E5FF\]/g, replacement: 'from-emerald-500 to-blue-500' },
  { regex: /hover:bg-white\/5/g, replacement: 'hover:bg-slate-100' },
  { regex: /hover:text-white/g, replacement: 'hover:text-slate-900' }
];

files.forEach(file => {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
});
