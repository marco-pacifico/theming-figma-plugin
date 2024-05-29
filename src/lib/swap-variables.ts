import { componentKeys } from "./component-keys";
import { NodeWithFills } from "./types";
import { bindColorVariableToNode, existingVariables } from "./utils/variables";

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

  const boundVariables = await Promise.all(
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


  boundVariables.forEach(({ node, colorVariablesToSwapOut }) => {
    colorVariablesToSwapOut?.forEach((variableToSwapOut) => {
      const variableToSwapIn = exisitingColorVariables.find(
        (variable) => variable.name === variableToSwapOut?.name
      );
      if (variableToSwapIn) {
        bindColorVariableToNode(variableToSwapIn, node as NodeWithFills);
      }
    });
  });
}
