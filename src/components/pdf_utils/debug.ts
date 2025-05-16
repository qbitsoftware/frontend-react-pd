import { PrintPDF } from "../print-pdf";

/**
 * Creates a debug wrapper overlay for PDF preview
 */
export function createDebugWrapper(
  containerId: string,
  title: string,
): HTMLDivElement {
  const wrapper = document.createElement("div");
  wrapper.id = "pdf-debug-wrapper";
  wrapper.style.position = "fixed";
  wrapper.style.top = "0";
  wrapper.style.left = "0";
  wrapper.style.width = "100%";
  wrapper.style.height = "100%";
  wrapper.style.backgroundColor = "rgba(0,0,0,0.8)";
  wrapper.style.zIndex = "9999";
  wrapper.style.overflow = "auto";
  wrapper.style.padding = "20px";

  // Add close button
  const closeButton = document.createElement("button");
  closeButton.textContent = "Close Preview";
  closeButton.style.position = "fixed";
  closeButton.style.top = "10px";
  closeButton.style.right = "10px";
  closeButton.style.zIndex = "10001";
  closeButton.style.padding = "8px 16px";
  closeButton.style.backgroundColor = "#f44336";
  closeButton.style.color = "white";
  closeButton.style.border = "none";
  closeButton.style.borderRadius = "4px";
  closeButton.style.cursor = "pointer";
  closeButton.onclick = () => document.body.removeChild(wrapper);

  // Add continue button
  const continueButton = document.createElement("button");
  continueButton.textContent = "Continue to PDF";
  continueButton.style.position = "fixed";
  continueButton.style.bottom = "10px";
  continueButton.style.right = "10px";
  continueButton.style.zIndex = "10001";
  continueButton.style.padding = "8px 16px";
  continueButton.style.backgroundColor = "#4CAF50";
  continueButton.style.color = "white";
  continueButton.style.border = "none";
  continueButton.style.borderRadius = "4px";
  continueButton.style.cursor = "pointer";
  continueButton.onclick = () => {
    document.body.removeChild(wrapper);
    PrintPDF(containerId, title, false);
  };

  wrapper.appendChild(closeButton);
  wrapper.appendChild(continueButton);
  document.body.appendChild(wrapper);

  return wrapper;
}
