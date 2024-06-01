import { getNode } from "./utils/nodes";
import { getVariablesInCollection } from "./utils/variables";

export default async function swapTextStyles() {

  // Create style
  const textStyle = figma.createTextStyle();
  const textStyleId = textStyle.id;
  textStyle.name = "Test Text Style";

  // Create text node
  const text = figma.createText();
  text.characters = "Test Text Node";
  text.setTextStyleIdAsync(textStyle.id);

  const typographyVariables = await getVariablesInCollection("_Typography");
  const headingFontFamily = typographyVariables.find(
    (variable) => variable?.name === "heading-font-family"
  );
  const headingFontStyle = typographyVariables.find(
    (variable) => variable?.name === "heading-font-style"
  );

  // Apply variables
  if (headingFontFamily && typeof headingFontFamily !== "undefined") {
    textStyle.setBoundVariable("fontFamily", headingFontFamily);
  }
  if (headingFontStyle && typeof headingFontStyle !== "undefined") {
    textStyle.setBoundVariable("fontStyle", headingFontStyle);
  }
  

  // Getting a text node on the page that's using a library text style
  // Text node is in a frame called Heading
  const TestingInstance = getNode({
    name: "Testing",
    type: "INSTANCE",
    parent: figma.currentPage,
  });
  if (TestingInstance) {
    const libraryTextNode = getNode({
      name: "Heading/5XL (Desktop)",
      type: "TEXT",
      parent: TestingInstance as InstanceNode,
    }) as TextNode;

    // Set style on library text node to the first local text style
    if (typeof textStyleId === "string") {
      await libraryTextNode.setTextStyleIdAsync(textStyleId);
    }
  }
}
