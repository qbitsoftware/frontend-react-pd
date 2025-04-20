
import { jsPDF } from 'jspdf';

export const PrintPDF = async (containerId: string, title: string = 'Tournament Bracket') => {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  try {
    const svgElements = container.querySelectorAll('svg');
    svgElements.forEach(svg => {
      if (!svg.getAttribute('width')) {
        svg.setAttribute('width', svg.getBoundingClientRect().width.toString());
      }
      if (!svg.getAttribute('height')) {
        svg.setAttribute('height', svg.getBoundingClientRect().height.toString());
      }
    });
    
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    pdf.setFontSize(16);
    pdf.text(title, 149, 15, { align: 'center' });
    
    pdf.html(container, {
      callback: function(pdf) {
        pdf.save(`${title.replace(/\s+/g, '_')}.pdf`);
      },
      x: 10,
      y: 25,
      width: 277, 
      autoPaging: 'text'
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF');
  }
};