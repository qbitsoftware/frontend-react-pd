export function setupCloneStyles(
  clone: HTMLElement,
  rect: DOMRect,
  debugMode: boolean,
) {
  // Set styles for better rendering
  clone.style.position = "absolute";
  clone.style.left = debugMode ? "0" : "-9999px";
  clone.style.top = debugMode ? "0" : "0";
  clone.style.width = rect.width + "px";
  clone.style.height = rect.height + "px";
  clone.style.background = "#ffffff";
  clone.style.transform = "none";
  clone.style.transformOrigin = "top left";
  clone.style.zIndex = debugMode ? "10000" : "auto";
  clone.style.border = debugMode ? "2px solid red" : "none";
}

export function applyPDFStyles(clone: HTMLElement) {
  clone.querySelectorAll(".pdf-no-padding").forEach((el) => {
    (el as HTMLElement).style.padding = "0";
  });

  clone.querySelectorAll(".pdf-participant").forEach((el) => {
    console.log("Found pariticpants", el);
    const element = el as HTMLElement;
    element.style.marginBottom = "15px";
    element.style.overflow = "visible";
  });

  clone.querySelectorAll(".pdf-participant-box").forEach((el) => {
    const element = el as HTMLElement;
    console.log("found el", el);
    element.style.border = "2px solid black";
  });

  clone.querySelectorAll(".pdf-game-court").forEach((el) => {
    const element = el as HTMLElement;
    console.log("found el", el);
    element.style.top = "-30px";
  });

  clone.querySelectorAll(".pdf-background").forEach((el) => {
    const element = el as HTMLElement;
    console.log("found el", el);
    element.style.background = "#FFFFFF";
  });
}
