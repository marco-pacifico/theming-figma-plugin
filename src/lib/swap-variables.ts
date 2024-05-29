import { componentKeys } from "./component-keys";
import { NodeWithFills } from "./types";
import {
  bindFillsVariableToNode,
  bindStrokesVariableToNode,
  existingVariables,
} from "./utils/variables";

export default async function swapVariables() {
  // Import a component by key
  const component = await figma.importComponentByKeyAsync(
    componentKeys.testing
  );
  // Create an instance of the component
  component.createInstance();

  // Get the existing color variables in the file
  const exisitingColorVariables = await existingVariables("COLOR");

  const nodes = figma.currentPage.findAll();
  const filteredNodes = nodes.filter((node) => node.name !== "Rows/ColorChip");

  const boundFillsVariables = await Promise.all(
    filteredNodes.map(async (node) => {
      const colorVariablesToSwapOut = await Promise.all(
        node.boundVariables?.fills?.map(async (variable) => {
          return await figma.variables.getVariableByIdAsync(variable.id);
        }) || []
      );
      return {
        node,
        colorVariablesToSwapOut,
      };
    })
  );

  const boundStokesVariables = await Promise.all(
    filteredNodes.map(async (node) => {
      const colorVariablesToSwapOut = await Promise.all(
        node.boundVariables?.strokes?.map(async (variable) => {
          return await figma.variables.getVariableByIdAsync(variable.id);
        }) || []
      );
      return {
        node,
        colorVariablesToSwapOut,
      };
    })
  );

  // Swap out color variables in strokes
  boundStokesVariables.forEach(({ node, colorVariablesToSwapOut }) => {
    colorVariablesToSwapOut?.forEach((variableToSwapOut) => {
      const variableToSwapIn = exisitingColorVariables.find(
        (variable) => variable.name === variableToSwapOut?.name
      );
      if (variableToSwapIn) {
        bindStrokesVariableToNode(variableToSwapIn, node as NodeWithFills);
      }
    });
  });

  // Swap out color variables in fills
  boundFillsVariables.forEach(({ node, colorVariablesToSwapOut }) => {
    colorVariablesToSwapOut?.forEach((variableToSwapOut) => {
      const variableToSwapIn = exisitingColorVariables.find(
        (variable) => variable.name === variableToSwapOut?.name
      );
      if (variableToSwapIn) {
        bindFillsVariableToNode(variableToSwapIn, node as NodeWithFills);
      }
    });
  });
}
