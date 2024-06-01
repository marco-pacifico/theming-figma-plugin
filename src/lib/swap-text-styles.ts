export default async function swapTextStyles() {
  // Get text nodes in the file
  const allTextNodesInFile = figma.currentPage.findAll(
    (n) => n.type === "TEXT"
  ) as TextNode[];

  // Get all local heading text styles
  const headingTextStyles = (await figma.getLocalTextStylesAsync()).filter(
    (textStyle) => textStyle.name.includes("Heading")
  );


  // Swap component instance text styles with local text styles
  // Match text styles by name
  for (const textNode of allTextNodesInFile) {
    // Get the name of the text style attached to the text node
    const textStyleId = textNode.textStyleId;
    const textStyle =
      textStyleId !== figma.mixed &&
      (await figma.getStyleByIdAsync(textStyleId));
    const textStyleName = textStyle && textStyle.name;

    for (const headingTextStyle of headingTextStyles) {
      if (textStyleName === headingTextStyle.name) {
        await textNode.setTextStyleIdAsync(headingTextStyle.id);
      }
    }
  }
}
