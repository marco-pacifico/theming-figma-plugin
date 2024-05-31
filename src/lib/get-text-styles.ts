import { getNode } from "./utils/nodes";

export default async function getTextStyles() {
  // Get local text styles, don't need to do this, just wanted to see what the text sytle objects look like
  const localTextStyles = await figma.getLocalTextStylesAsync();
  const localTextStylesNames = localTextStyles.map((textStyle) => textStyle.name);
  console.log("localTextStyles are", localTextStylesNames);

    // Get the first local text style id
  const localTextStyleId = localTextStyles[2].id;

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
    console.log("libraryTextNode's name is", libraryTextNode?.name || "Not working");

    // Set style on library text node to the first local text style
    await libraryTextNode.setTextStyleIdAsync(localTextStyleId)
    console.log("libraryTextNode's style id is", libraryTextNode?.textStyleId || "Not working");


    // // Get Text Style Id from the text node
    // const libaryTextNodeStyleId = libraryTextNode?.textStyleId || "";
    // console.log("textNodeStyleId", libaryTextNodeStyleId || "Not working");
    // if (typeof libaryTextNodeStyleId === "string") {
    //   // Get the text style object from the style id
    //   const libraryTextStyle = (await figma.getStyleByIdAsync(
    //     libaryTextNodeStyleId
    //   )) as TextStyle;
    //   console.log("libraryTextStyle", libraryTextStyle || "Not working");

    //   // Get the bound variable ids from the text style
    //   const libraryTextStyleBoundVars = libraryTextStyle?.boundVariables as {
    //     fontFamily?: VariableAlias | undefined;
    //     fontSize?: VariableAlias | undefined;
    //     fontStyle?: VariableAlias | undefined;
    //     fontWeight?: VariableAlias | undefined;
    //     letterSpacing?: VariableAlias | undefined;
    //     lineHeight?: VariableAlias | undefined;
    //     paragraphSpacing?: VariableAlias | undefined;
    //     paragraphIndent?: VariableAlias | undefined;
    //   };
    //   console.log(
    //     "libraryTextStyleBoundVars",
    //     libraryTextStyleBoundVars || "Not working"
    //   );

    //   // Get the font family variable from the bound variables id for font family
    //   const boundFontFamilyVariable =
    //     await figma.variables.getVariableByIdAsync(
    //       libraryTextStyleBoundVars?.fontFamily?.id || ""
    //     );

    //   console.log(
    //     "boundFontFamilyVariable",
    //     boundFontFamilyVariable || "Not working"
    //   );

    //   // Set bound variable for font family with a local variable of the same name
    //   const localStringVariables = await figma.variables.getLocalVariablesAsync(
    //     "STRING"
    //   );
    //   const localFontFamilyVariable = localStringVariables.find(
    //     (variable) => variable.name === boundFontFamilyVariable?.name
    //   );

    //   if (localFontFamilyVariable) {
    //     // Set the bound variable for font family
    //     libraryTextStyle?.setBoundVariable(
    //       "fontFamily",
    //       localFontFamilyVariable
    //     );
    //     console.log(
    //       "libraryTextStyle with bound variable for font family",
    //       libraryTextStyleBoundVars || "Not working"
    //     );
    //   }
    // }
  }
}
