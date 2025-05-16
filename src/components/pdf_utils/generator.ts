import { jsPDF } from "jspdf";

export function generatePDF(
  canvas: HTMLCanvasElement,
  title: string,
  scale: number = 1.0, // Default to original size
) {
  const usePortrait = canvas.height > canvas.width;

  const pdf = new jsPDF({
    orientation: usePortrait ? "portrait" : "landscape",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // console.log("PDF height", pageHeight);
  const contentWidth = pageWidth;
  const contentHeight = pageHeight;

  const aspectRatio = canvas.width / canvas.height;

  let imgWidth = contentWidth * scale;
  let imgHeight = imgWidth / aspectRatio;
  // console.log("img height", imgHeight);

  if (imgHeight > contentHeight * scale) {
    imgHeight = contentHeight * scale;
    imgWidth = imgHeight * aspectRatio;
  }

  const xPos = (pageWidth - imgWidth) / 2;

  pdf.addImage(
    canvas.toDataURL("image/png", 1.0),
    "PNG",
    xPos,
    0,
    imgWidth,
    imgHeight + 10,
  );

  pdf.save(`${title.replace(/\s+/g, "_")}.pdf`);
}
