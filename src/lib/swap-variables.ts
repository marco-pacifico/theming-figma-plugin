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

  const boundedFillsVariables = await Promise.all(
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

  const boundedStokesVariables = await Promise.all(
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
  boundedStokesVariables.forEach(({ node, colorVariablesToSwapOut }) => {
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
  boundedFillsVariables.forEach(({ node, colorVariablesToSwapOut }) => {
    colorVariablesToSwapOut?.forEach((variableToSwapOut) => {
      const variableToSwapIn = exisitingColorVariables.find(
        (variable) => variable.name === variableToSwapOut?.name
      );
      if (variableToSwapIn) {
        bindFillsVariableToNode(variableToSwapIn, node as NodeWithFills);
      }
    });
  });

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
