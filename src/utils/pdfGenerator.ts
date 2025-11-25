
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { WoodworkingPlan } from "../types";

export const generatePDF = async (plan: WoodworkingPlan, imageSrc: string | null) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let yPos = 20;

  // Title
  doc.setFontSize(22);
  doc.setTextColor(40, 40, 40);
  doc.text(plan.title, margin, yPos);
  yPos += 10;

  // Description
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  const splitDesc = doc.splitTextToSize(plan.description, pageWidth - margin * 2);
  doc.text(splitDesc, margin, yPos);
  yPos += splitDesc.length * 5 + 5;

  // --- Original Photo ---
  if (imageSrc) {
    try {
        const imgProps = doc.getImageProperties(imageSrc);
        // Constrain width to 120mm to save space
        const imgWidth = 120;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
        
        // Center the image
        const xPos = (pageWidth - imgWidth) / 2;
        doc.addImage(imageSrc, 'JPEG', xPos, yPos, imgWidth, imgHeight);
        
        // Stats Text below 
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        
        yPos += imgHeight + 15;
        
        // Dimensions
        doc.text("Project Dimensions", margin, yPos);
        doc.setFontSize(11);
        doc.text(`H: ${plan.overallDimensions.height}  W: ${plan.overallDimensions.width}  D: ${plan.overallDimensions.depth}`, margin, yPos + 7);
        
        yPos += 20;

    } catch (e) {
        console.warn("Could not add image to PDF", e);
        yPos += 20;
    }
  }

  // Shopping List
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Materials Needed", margin, yPos);
  yPos += 7;
  doc.setFontSize(10);
  plan.shoppingList.forEach((item) => {
    doc.text(`• ${item}`, margin + 5, yPos);
    yPos += 5;
  });
  yPos += 10;

  // Cut List Table
  doc.setFontSize(14);
  doc.text("Cut List", margin, yPos);
  yPos += 5;

  autoTable(doc, {
    startY: yPos,
    head: [['Part', 'Qty', 'Dimensions', 'Material', 'Notes']],
    body: plan.cutList.map(item => [
      item.partName,
      item.quantity,
      `${item.thickness} x ${item.width} x ${item.length}`,
      item.material,
      item.notes || '-'
    ]),
    theme: 'grid',
    headStyles: { fillColor: [66, 66, 66] },
  });

  // @ts-ignore
  yPos = doc.lastAutoTable.finalY + 15;

  // Instructions
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }
  
  doc.setFontSize(14);
  doc.text("Assembly Instructions", margin, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  plan.assemblySteps.forEach((step) => {
    const text = `${step.stepNumber}. ${step.instruction}`;
    const splitText = doc.splitTextToSize(text, pageWidth - margin * 2);
    
    if (yPos + splitText.length * 5 > 280) {
        doc.addPage();
        yPos = 20;
    }
    
    doc.text(splitText, margin, yPos);
    yPos += splitText.length * 5 + 3;
  });

  doc.save(`${plan.title.replace(/\s+/g, '_')}_Plan.pdf`);
};
