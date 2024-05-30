import { cloneObject } from "./utils/colors";

export function arrangeNodesOnPage() {
  const parent = figma.createFrame();
  // Make the fill transparent
  const fills = cloneObject(parent.fills);
  fills[0].opacity = 0;
  fills[0].type = "SOLID";
  parent.fills = fills;
  // Name the frame "Wrapper"
  parent.name = "Wrapper"
  parent.layoutMode = "HORIZONTAL";
  parent.itemSpacing = 40;
  const nodes = figma.currentPage.children; 
  nodes.forEach((node) => {
    if (node.name !== "Wrapper") {
        parent.appendChild(node);
    }
  });
  parent.layoutSizingVertical = "HUG";
  parent.layoutSizingHorizontal = "HUG";
  parent.children.forEach((node) => {
    figma.currentPage.appendChild(node);
  });
  parent.remove();
}
