import { NodeWithFills } from "./types";
import { cloneObject } from "./utils/formatting";
import { removeExistingNode } from "./utils/nodes";
import {
  bindFillsVariableToNode,
  bindStrokesVariableToNode,
  existingVariables,
} from "./utils/variables";

export default async function swapVariables() {
  removeExistingNode({
    name: "Testing",
    type: "INSTANCE",
  });

  // Get the existing color variables in the file
  const existingColorVariables = await existingVariables("COLOR");

  const nodes = figma.currentPage.findAll();
  const filteredNodes = nodes.filter((node) => node.name !== "Rows/ColorChip");

  // SWAP FILLS
  // For each node find any bounded fills variables and swap them out with existing color variable of the same name
  for (const node of filteredNodes) {
    // If a text node, need to check if there are text segments with different fills
    if (node.type === "TEXT" && node.fills === figma.mixed) {
      // Get the text segments with fills
      const textSegmentsFills = node.getStyledTextSegments(["fills"]);
      // For each text segment, swap out the fill with the existing color variable
      for (const textSegment of textSegmentsFills) {
        const { start, end, fills } = textSegment;
        // Bound variables are only available for solid fills
        if (fills[0]?.type === "SOLID") {
          const variableToSwapOut = await figma.variables.getVariableByIdAsync(
            fills[0]?.boundVariables?.color?.id || ""
          );
          const variableToSwapIn = existingColorVariables.find(
            (variable) => variable.name === variableToSwapOut?.name
          );
          if (variableToSwapIn) {
            // Clone fill
            const clonedFills = cloneObject(fills);
            // Set the fill to the variable color
            clonedFills[0] = figma.variables.setBoundVariableForPaint(
              clonedFills[0],
              "color",
              variableToSwapIn
            );
            node.setRangeFills(start, end, clonedFills);
          }
        }
      }
    } else {
      // If not a text node, don't need to check if there are text segments with different fills
      // Get the variable that's bound to the fill of the node
      const fillVariableId = node.boundVariables?.fills?.[0]?.id;
      const variableToSwapOut = await figma.variables.getVariableByIdAsync(
        fillVariableId || ""
      );
      // Swap in the local variable of the same name
      const variableToSwapIn = existingColorVariables.find(
        (variable) => variable.name === variableToSwapOut?.name
      );
      if (variableToSwapIn) {
        bindFillsVariableToNode(variableToSwapIn, node as NodeWithFills);
      }
    }
  }

  // SWAP STROKES
  for (const node of filteredNodes) {
    const variablesToSwapOut = [];

    // There can be multiple strokes per node, so get an array of stroke variables to swap out for each node
    for (const strokeVariableAlias of node.boundVariables?.strokes || []) {
      const strokeVariable = await figma.variables.getVariableByIdAsync(
        strokeVariableAlias.id
      );
      variablesToSwapOut.push(strokeVariable);
    }

    for (const variableToSwapOut of variablesToSwapOut) {
      // Swap in the local variable of the same name
      const variableToSwapIn = existingColorVariables.find(
        (variable) => variable.name === variableToSwapOut?.name
      );
      if (variableToSwapIn) {
        bindStrokesVariableToNode(variableToSwapIn, node as NodeWithFills);
      }
    }
  }

  // SWAP RADIUS
  // Get the existing color variables in the file
  const existingFloatVariables = await existingVariables("FLOAT");
  // For each node find any bounded radius variables and swap them out with existing float variable of the same name

  for (const node of filteredNodes) {
    const boundedRadiusVars = [
      {
        field: "topLeftRadius",
        variable: await figma.variables.getVariableByIdAsync(
          node.boundVariables?.topLeftRadius?.id || ""
        ),
      },
      {
        field: "topRightRadius",
        variable: await figma.variables.getVariableByIdAsync(
          node.boundVariables?.topRightRadius?.id || ""
        ),
      },
      {
        field: "bottomLeftRadius",
        variable: await figma.variables.getVariableByIdAsync(
          node.boundVariables?.bottomLeftRadius?.id || ""
        ),
      },
      {
        field: "bottomRightRadius",
        variable: await figma.variables.getVariableByIdAsync(
          node.boundVariables?.bottomRightRadius?.id || ""
        ),
      },
    ];

    for (const { field, variable } of boundedRadiusVars) {
      // Find the existing float variable with the same name as the variable to swap out
      const variableToSwapIn = existingFloatVariables.find(
        (existingVariable) => existingVariable.name === variable?.name
      );

      // If a variable with the same name is found, swap it out
      if (variableToSwapIn) {
        node.setBoundVariable(
          field as VariableBindableNodeField,
          variableToSwapIn
        );
      }
    }
  }
}
