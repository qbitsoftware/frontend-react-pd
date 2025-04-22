import html2canvas from "html2canvas";
import { setupCloneStyles } from "./pdf_utils/styles";
import { createDebugWrapper } from "./pdf_utils/debug";
import { processElementsForPDF } from "./pdf_utils/element-processor";
import { generatePDF } from "./pdf_utils/generator";

/**
 * Prints the specified container as a PDF file
 * @param containerId - ID of the container to print
 * @param title - Title for the PDF file
 * @param debugMode - Whether to show debug preview
 */
export const PrintPDF = async (
  containerId: string,
  title: string = "turna bracket",
  debugMode = false,
) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const clone = container.cloneNode(true) as HTMLElement;
    const rect = container.getBoundingClientRect();

    setupCloneStyles(clone, rect, debugMode);

    const debugWrapper = debugMode
      ? createDebugWrapper(containerId, title)
      : null;

    processElementsForPDF(clone);

    if (debugMode && debugWrapper) {
      debugWrapper.appendChild(clone);
      console.log("HTML clone for PDF:", clone.outerHTML);
      return;
    }

    document.body.appendChild(clone);

    const canvas = await html2canvas(clone, {
      logging: false,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      imageTimeout: 15000,
      foreignObjectRendering: false,
      removeContainer: false,
    });

    document.body.removeChild(clone);

    generatePDF(canvas, title, 1.0);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF: " + (error as Error).message);
  }
};
