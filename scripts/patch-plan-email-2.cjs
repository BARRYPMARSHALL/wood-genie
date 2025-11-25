const fs = require('fs');
const p = 'src/components/PlanDisplay.tsx';
let s = fs.readFileSync(p,'utf8');
const target = "console.log(`Captured email for ${modalType}:`, email);";
if (s.includes(target)) {
  const replacement = target + "\n\n    // Debug: detect accidental auto-submit or automatic modal actions\n    console.log('📢 handleEmailSubmit called; modalType=', modalType, 'isGeneratingPdf=', isGeneratingPdf);";
  s = s.replace(target, replacement);
  fs.writeFileSync(p, s, 'utf8');
  console.log('Inserted debug log after captured email line');
} else {
  console.log('Target line not found');
}
