import { applyPDFStyles } from "./styles";
import { processSVGElements } from "./svg-processor";

export function processElementsForPDF(clone: HTMLElement) {
  removeUnwantedElements(clone);

  applyPDFStyles(clone);

  processSVGElements(clone);
}

export function removeUnwantedElements(clone: HTMLElement) {
  const elementsToRemove = [".pdf-remove-in-print"];

  elementsToRemove.forEach((selector) => {
    clone.querySelectorAll(selector).forEach((el) => el.remove());
  });
}
