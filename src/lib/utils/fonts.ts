import { FontWeightsMap, NodeWithChildren } from "../types";
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

export async function getFigmaStyleName({
  fontFamily,
  fontWeight,
  fontStyle,
}: {
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
}) {
  // MAP FONT WEIGHT NUMBER AND STYLE TO FIGMA FONT STYLE NAMES
  // e.g. Weight: 500, Style: italic => "Medium Italic"
  // Get all available fonts in the file: all fonts available in Figma font picker
  const availableFonts = await figma.listAvailableFontsAsync();
  // Find all fonts in the font family
  const fonts = availableFonts.filter(
    (font) => font.fontName.family === fontFamily
  );
  if (fonts.length === 0) {
    throw new Error(`${fontFamily} is not available in file`);
  }
  // Get all styles in for the font family
  const styleNamesInFamily = fonts.map((font) => font.fontName.style);
  // Filter style names based on the font style
  const filteredStyleNamesInFamily =
    fontStyle === "italic"
      ? styleNamesInFamily.filter((style) => style.includes("Italic"))
      : styleNamesInFamily.filter((style) => !style.includes("Italic"));
  // Create a map of font weights to style names
  const fontWeightMap: FontWeightsMap = {};
  const weightKeywords = [
    { weight: 100, keyword: "Thin" },
    { weight: 200, keyword: "ExtraLight" },
    { weight: 300, keyword: "Light" },
    { weight: 400, keyword: "Regular" },
    { weight: 500, keyword: "Medium" },
    { weight: 600, keyword: "SemiBold" },
    { weight: 700, keyword: "Bold" },
    { weight: 800, keyword: "ExtraBold" },
    { weight: 900, keyword: "Black" },
  ];
  // For each style name, go through list of keywords and find the keyword that matches the style name in lower case
  // Then push the original style name with its corresponding weight to the font weight map
  // Need to do this beacuse some fonts have different naming conventions for font weights e.g. Semi Bold vs SemiBold
  for (const styleName of filteredStyleNamesInFamily) {
    const styleNameWithOutSpaces = styleName.replace(/\s/g, ""); // Remove any spaces for matching
    for (const { weight, keyword } of weightKeywords) {
      if (styleNameWithOutSpaces.includes(keyword)) {
        fontWeightMap[weight] = styleName;
      }
      // Special case for fonts that have weight 400 and style italic
      if (weight === 400 && fontStyle === "italic") {
        fontWeightMap[400] = "Italic";
      }
    }
  }

  // Load all weights in the font family, both regular and italic
  // Needed when updated existing font variables, prevents unloading font error
  for (const styleName of styleNamesInFamily) {
    await figma.loadFontAsync({ family: fontFamily, style: styleName });
  }

  return fontWeightMap[fontWeight];
}
