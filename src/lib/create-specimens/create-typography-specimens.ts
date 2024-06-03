import { componentKeys } from "../component-keys";
import { loadFonts } from "../utils/fonts";
import { getInstanceOfComponent, getNode } from "../utils/nodes";
import { getVariablesInCollection } from "../utils/variables";

export default async function createTypographySpecimens({
  themeFont,
  figmaStyleName,
} : {
  themeFont: string;
  figmaStyleName: string;
}) {
  // Get component instances needed for documentation
  const typographySpecimens = (
    await getInstanceOfComponent(componentKeys.typography)
  ).detachInstance();
  typographySpecimens.name = "Typography";
  // Load fonts in Color Chip and Color Wrapper
  await loadFonts(typographySpecimens);

  // Get typography specimens frame
  const TypographyFrame = getNode({
    name: "Typography",
    type: "FRAME",
    parent: figma.currentPage,
  }) as FrameNode;

  // Print heading font family and font style in the typography specimen 
  const headingFontTextNode = TypographyFrame.findOne(
    (node) => node.type === "TEXT" && node.name === "Heading Font"
  ) as TextNode;
  // Update the font family and font style text node
  headingFontTextNode.characters = `${themeFont} ${figmaStyleName}`

  
  // Get all text nodes in the typography specimens with the name "Theme Heading"
  const headings =
    TypographyFrame &&
    (TypographyFrame.findAll(
      (node) => node.type === "TEXT" && node.name === "Theme Heading"
    ) as TextNode[]);

  // Create text styles with typography variables, and apply the styles to the headings text nodes
  for (const heading of headings) {
    // Delete existing text style that will be replaced
    const existingTextStyle = (await figma.getLocalTextStylesAsync()).find(
      (textStyle) => textStyle.name === heading.characters
    );
    if (existingTextStyle) {
      existingTextStyle.remove();
    }

    // Get properties from the heading text node
    const fontSize = heading.fontSize;
    const lineHeight = heading.lineHeight;
    const letterSpacing = heading.letterSpacing;
    const textCase = heading.textCase;
    const textDecoration = heading.textDecoration;

    // Create text style for the heading
    const textStyle = figma.createTextStyle();
    textStyle.name = heading.characters;

    // Set text style properties
    fontSize !== figma.mixed && (textStyle.fontSize = fontSize);
    letterSpacing !== figma.mixed && (textStyle.letterSpacing = letterSpacing);
    lineHeight !== figma.mixed && (textStyle.lineHeight = lineHeight);
    textCase !== figma.mixed && (textStyle.textCase = textCase);
    textDecoration !== figma.mixed &&
      (textStyle.textDecoration = textDecoration);

    // Get font family and font style variables
    const typographyVariables = await getVariablesInCollection("_Typography");
    const fontFamilyVariable = typographyVariables.find(
      (variable) => variable?.name === "heading-font-family"
    );
    const fontStyleVariable = typographyVariables.find(
      (variable) => variable?.name === "heading-font-style"
    );

    if (fontFamilyVariable && fontStyleVariable) {
      // Bind font family and font style to the text style
      textStyle.setBoundVariable("fontFamily", fontFamilyVariable);
      textStyle.setBoundVariable("fontStyle", fontStyleVariable);
    }

    // Apply the text style to the heading
    await heading.setTextStyleIdAsync(textStyle.id);
  }

  return typographySpecimens;
}

// function getHeadingTextNodes() {
//   const TypographyFrame = getNode({
//     name: "Typography",
//     type: "FRAME",
//     parent: figma.currentPage,
//   }) as FrameNode;
//   const HeadingTextNodes =
//     TypographyFrame &&
//     (TypographyFrame.findAll(
//       (node) => node.type === "TEXT" && node.name === "Theme Heading"
//     ) as TextNode[]);
//   return HeadingTextNodes;
// }

