const fs = require('fs');
const p = 'src/components/PlanDisplay.tsx';
let s = fs.readFileSync(p,'utf8');
const old = "    console.log(`Captured email for ${modalType}:`, email);\r\n\r\n    if (modalType === 'download') {\r\n        setIsGeneratingPdf(true);\r\n        try {\r\n            await generatePDF(plan, originalImage);\r\n        } catch (error) {\r\n            console.error(\"PDF Generation failed\", error);\r\n        } finally {\r\n            setIsGeneratingPdf(false);\r\n        }\r\n    } else {";
const newS = "    console.log(`Captured email for ${modalType}:`, email);\r\n    // Debug: detect accidental auto-submit or automatic modal actions\r\n    console.log('📢 handleEmailSubmit called; modalType=', modalType, 'isGeneratingPdf=', isGeneratingPdf);\r\n\r\n    if (modalType === 'download') {\r\n        setIsGeneratingPdf(true);\r\n        try {\r\n            await generatePDF(plan, originalImage);\r\n        } catch (error) {\r\n            console.error(\"PDF Generation failed\", error);\r\n        } finally {\r\n            setIsGeneratingPdf(false);\r\n        }\r\n    } else {";
if (s.includes(old)) {
  s = s.replace(old, newS);
  fs.writeFileSync(p, s, 'utf8');
  console.log('Patched PlanDisplay (handleEmailSubmit)');
} else {
  console.log('Pattern not found - aborting');
}
