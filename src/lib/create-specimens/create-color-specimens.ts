import { componentKeys } from "../component-keys";
import { loadFonts } from "../utils/fonts";
import {
  capitalizeFirstLetter,
  groupVariablesByPrefix, rgbaToHex
} from "../utils/formatting";
import { createFrame, getInstanceOfComponent, getNode } from "../utils/nodes";
import {
  bindFillsVariableToNode,
  getCollectionAndModeId,
  getVariablesInCollection,
} from "../utils/variables";

export default async function createColorSpecimens() {
  // Get color variables in the file
  const colorVariables = await getVariablesInCollection("_Colors");

  // Group color variables by prefix
  const groupedVariables = groupVariablesByPrefix(colorVariables);

  // Get color collection mode id
  const { modeId } = await getCollectionAndModeId("_Colors");

  // Get component instances needed for documentation
  const colorChip = await getInstanceOfComponent(componentKeys.colorChip);
  const colorWrapper = (
    await getInstanceOfComponent(componentKeys.sectionWrapper)
  ).detachInstance();
  colorWrapper.name = "Colors";

  // Load fonts in Color Chip and Color Wrapper
  await loadFonts(colorChip);
  await loadFonts(colorWrapper);

  // Update title of Color Wrapper
  const sectionTitle = getNode({
    name: "Title",
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
    const colorChipRow = createFrame({
      layoutMode: "HORIZONTAL",
      counterAxisSizingMode: "AUTO",
      itemSpacing: 24,
    });
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

  // Remove unused nodes, imported colorChip and original section heading
  colorChip.remove();
  if (sectionHeading) {
    sectionHeading.remove();
  }

  return colorWrapper;
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
