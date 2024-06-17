import { componentKeys } from "../component-keys";
import { loadFonts } from "../utils/fonts";
import { getInstanceOfComponent, getNode } from "../utils/nodes";
import { getVariablesInCollection } from "../utils/variables";

export default async function createTypographySpecimens({
  themeFont,
  figmaStyleName,
}: {
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
  headingFontTextNode.characters = `${themeFont} ${figmaStyleName}`;

  // Get all text nodes in the typography specimens with the name "Theme Heading"
  const headingsSpecimens =
    TypographyFrame &&
    (TypographyFrame.findAll(
      (node) => node.type === "TEXT" && node.name === "Theme Heading"
    ) as TextNode[]);

  // Create text styles with typography variables, and apply the styles to the headings text nodes
  for (const headingSpecimen of headingsSpecimens) {
    let headingTextStyle: TextStyle | null = null;
    // Check to see if the text style already exists
    const exisitingHeadingStyle = (await figma.getLocalTextStylesAsync()).find(
      (textStyle) => textStyle.name === headingSpecimen.characters
    );
    // If the text style already exists, use it
    if (exisitingHeadingStyle) {
      headingTextStyle = exisitingHeadingStyle;
    }
    // If the text style doesn't exist, create a new one
    if (!exisitingHeadingStyle) {
      // Get properties from the heading specimen text node
      const fontSize = headingSpecimen.fontSize;
      const lineHeight = headingSpecimen.lineHeight;
      const letterSpacing = headingSpecimen.letterSpacing;
      const textCase = headingSpecimen.textCase;
      const textDecoration = headingSpecimen.textDecoration;

      // Create a new text style with the name of the heading specimen
      headingTextStyle = figma.createTextStyle();
      headingTextStyle.name = headingSpecimen.characters;

      // Set text style properties from the heading specimen
      fontSize !== figma.mixed && (headingTextStyle.fontSize = fontSize);
      letterSpacing !== figma.mixed &&
        (headingTextStyle.letterSpacing = letterSpacing);
      lineHeight !== figma.mixed && (headingTextStyle.lineHeight = lineHeight);
      textCase !== figma.mixed && (headingTextStyle.textCase = textCase);
      textDecoration !== figma.mixed &&
        (headingTextStyle.textDecoration = textDecoration);
    }

    // APPLY FONT FAMILY AND FONT STYLE VARIABLES TO HEADING TEXT STYLE, NEW OR EXISITNG
    // Get font family and font style variables
    const typographyVariables = await getVariablesInCollection("_Typography");
    const fontFamilyVariable = typographyVariables.find(
      (variable) => variable?.name === "heading-font-family"
    );
    const fontStyleVariable = typographyVariables.find(
      (variable) => variable?.name === "heading-font-style"
    );

    if (fontFamilyVariable && fontStyleVariable && headingTextStyle) {
      // Bind font family and font style to the text style
      headingTextStyle.setBoundVariable("fontFamily", fontFamilyVariable);
      headingTextStyle.setBoundVariable("fontStyle", fontStyleVariable);
    }

    // Apply text style to the heading specimen text node
    if (headingTextStyle) {
      await headingSpecimen.setTextStyleIdAsync(headingTextStyle.id);
    }
  }

  return typographySpecimens;
}

