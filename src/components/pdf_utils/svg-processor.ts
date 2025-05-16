export function processSVGElements(clone: HTMLElement) {
  const svgElements = clone.querySelectorAll("svg.pdf-connector-grid");
  // console.log(`Found ${svgElements.length} SVG connector grid elements`);

  svgElements.forEach((svg) => {
    // Force set the attributes with both methods
    svg.setAttribute("width", "1080");
    svg.setAttribute("height", "1440");
    svg.setAttribute("style", "top: 15px !important; ");

    // console.log(
    //   "Processed SVG connector grid:",
    //   svg.outerHTML.substring(0, 150) + "...",
    // );
  });
}
