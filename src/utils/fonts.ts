type NodeWithChildren = ComponentNode | ComponentSetNode | FrameNode | PageNode | InstanceNode | GroupNode | SectionNode;
// **************************************************************
// Load fonts in a page
// **************************************************************
export function getFonts(node: NodeWithChildren) {
    const textNodes = node.findChildren((node) => node.type === "TEXT") as TextNode[];
    const fontNames = textNodes.map((node) => node.fontName);
    return fontNames;
  }
  