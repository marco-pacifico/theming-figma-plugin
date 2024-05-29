import { componentKeys } from "./component-keys";
import { cloneObject, rgbaToHex } from "./utils/colors";
import { loadFonts } from "./utils/fonts";
import { getInstanceOfComponent, getNode } from "./utils/nodes";
import {
  bindFillsVariableToNode,
  getCollectionAndModeId,
  groupVariablesByPrefix,
  capitalizeFirstLetter,
} from "./utils/variables";

export async function createColorSpecimens() {
  // Remove current color specimens if they exist
  const exisitngColorWrapper = getNode({
    name: "Colors",
    type: "FRAME",
    parent: figma.currentPage,
  }) as FrameNode;
  if (exisitngColorWrapper) {
    exisitngColorWrapper.remove();
  }
  // Get color variables in the file
  const colorVariables = await figma.variables.getLocalVariablesAsync("COLOR");

  // Group color variables by prefix
  const groupedVariables = groupVariablesByPrefix(colorVariables);

  // Get color collection mode id
  const { modeId } = await getCollectionAndModeId("_Colors");

  // Get component instances needed for documentation
  const colorChip = await getInstanceOfComponent(componentKeys.colorChip);
  const colorWrapper = (
    await getInstanceOfComponent(componentKeys.wrapper)
  ).detachInstance();
  colorWrapper.name = "Colors";

  // Load fonts in Color Chip and Color Wrapper
  await loadFonts(colorChip);
  await loadFonts(colorWrapper);

  // Update title of Color Wrapper
  const sectionTitle = getNode({
    name: "Section Title",
    type: "TEXT",
    parent: colorWrapper,
  }) as TextNode;
  sectionTitle.characters = "Colors";

  // Update heading of Color Wrapper
  const sectionHeading = getNode({
    name: "Section Heading",
    type: "TEXT",
    parent: colorWrapper,
  }) as TextNode;

  // Create a color chip row for each group
  for (const scale in groupedVariables) {
    const colorHeading = sectionHeading.clone();
    colorHeading.name = capitalizeFirstLetter(scale);
    colorHeading.characters = capitalizeFirstLetter(scale);
    const variables = groupedVariables[scale];
    const colorChipRow = createColorChipRow();
    for (const colorVariable of variables) {
      const colorChipInstance = await createColorChip(
        colorVariable,
        colorChip,
        modeId
      );
      colorChipRow.appendChild(colorChipInstance);
    }
    // Append color heading and color chip row to color wrapper
    colorWrapper.appendChild(colorHeading);
    colorWrapper.appendChild(colorChipRow);
  }

  colorChip.remove();
  if (sectionHeading) {
    sectionHeading.remove();
  }
}

async function createColorChip(
  colorVariable: Variable,
  colorChip: InstanceNode,
  modeId: string
) {
  // Duplicate Color Chip
  const colorChipInstance = colorChip.clone();

  // Get text node for "variable-name" and set text to the color variable's name
  //   nameNode(name: colorVariable.name, nodeName: "variable-name", nodeType: "TEXT", parentNode: colorChipInstance);
  const variableNameTextNode = getNode({
    name: "variable-name",
    type: "TEXT",
    parent: colorChipInstance,
  }) as TextNode;
  variableNameTextNode.characters = colorVariable.name;

  // Get text node for value and set the color value
  const hexValueTextNode = getNode({
    name: "hex-value",
    type: "TEXT",
    parent: colorChipInstance,
  }) as TextNode;
  const variableValue = colorVariable.valuesByMode[modeId];

  if (typeof variableValue === "string") {
    hexValueTextNode.characters = variableValue;
  } else if (
    typeof variableValue === "object" &&
    "r" in variableValue &&
    "g" in variableValue &&
    "b" in variableValue &&
    "a" in variableValue
  ) {
    hexValueTextNode.characters = rgbaToHex(variableValue)
      .toString()
      .toUpperCase();
  } else if (typeof variableValue === "object" && "type" in variableValue) {
    hexValueTextNode.characters = "Alias";
    const aliasId = variableValue.id;
    const alias = await figma.variables.getVariableByIdAsync(aliasId);
    if (alias) {
      hexValueTextNode.characters = alias.name;
    }
  } else {
    hexValueTextNode.characters = "Unknown";
  }

  // Get frame node to paint and bind the color variable to it
  const colorSpecimenFrame = getNode({
    name: "color-specimen",
    type: "FRAME",
    parent: colorChipInstance,
  }) as FrameNode;
  bindFillsVariableToNode(colorVariable, colorSpecimenFrame);

  return colorChipInstance;
}

function createColorChipRow() {
  const columnGap = 24;
  // Create a frame to hold the color chip
  const frame = figma.createFrame();
  // Make the fill transparent
  const fills = cloneObject(frame.fills);
  fills[0].opacity = 0;
  fills[0].type = "SOLID";
  frame.fills = fills;
  // Set the layout mode and spacing of the frame
  frame.layoutMode = "HORIZONTAL";
  frame.counterAxisSizingMode = "AUTO";
  frame.itemSpacing = columnGap;
  return frame;
}
