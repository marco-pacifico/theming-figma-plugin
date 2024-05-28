import { NodeWithChildren } from "../types";
// **************************************************************
// Load fonts in a page
// **************************************************************
export async function loadFonts(node: NodeWithChildren = figma.currentPage) {
  const textNodes = node.findChildren(
    (node) => node.type === "TEXT"
  ) as TextNode[];

  // Filter text nodes with mixed fonts
  const filteredTextNodes = textNodes.filter(
    (textNode) => textNode.fontName !== figma.mixed
  );

  const fonts = filteredTextNodes.map(
    (textNode) => textNode.fontName as FontName
  );

  for (const font of fonts) {
    await figma.loadFontAsync(font);
  }
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
}
