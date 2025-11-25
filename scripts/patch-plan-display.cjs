const fs = require('fs');
const p = 'src/components/PlanDisplay.tsx';
let s = fs.readFileSync(p,'utf8');
const old = "const [emailError, setEmailError] = useState('');\r\n  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);\r\n\r\n  const handleActionClick = (type: 'download' | 'save') => {\r\n    setModalType(type);\r\n    setShowEmailModal(true);\r\n  };";
const newS = "const [emailError, setEmailError] = useState('');\r\n  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);\r\n\r\n  const handleActionClick = (type: 'download' | 'save') => {\r\n    console.log('🖱️ handleActionClick invoked, type=', type);\r\n    setModalType(type);\r\n    setShowEmailModal(true);\r\n  };";
if (s.includes(old)) {
  s = s.replace(old, newS);
  fs.writeFileSync(p, s, 'utf8');
  console.log('Patched PlanDisplay (handleActionClick)');
} else {
  console.log('Pattern not found - aborting');
}
