import { Theme } from "../types";
import { getCollectionAndModeId } from "../utils/variables";
import { getPixelValue } from "../utils/formatting";

export default async function createRadiusVars(theme: Theme) {
  // Create a collection for the radius variables or use existing collection if it exists
  const { collection, modeId } = await getCollectionAndModeId("_Radius");

  // Get the existing float variables in the file
  // Need this to check if a variable already exists
  const existingFloatVariables = await figma.variables.getLocalVariablesAsync(
    "FLOAT"
  );
  for (const radiusName in theme.radius) {
    createRadiusVariable({
        name: `radius-${radiusName.toLowerCase()}`,
        value: theme.radius[radiusName].toString(),
        collection,
        modeId,
        existingFloatVariables,
    });
  }
}

// **************************************************************
// Create a new variable or update an existing variable with the same name
// **************************************************************
async function createRadiusVariable({
  name,
  value,
  collection,
  modeId,
  existingFloatVariables,
}: {
  name: string;
  value: string;
  collection: VariableCollection;
  modeId: string;
  existingFloatVariables: Variable[];
}) {
  if (existingFloatVariables && existingFloatVariables.length > 0) {
    // Check if a variable with the same name already exists
    const existingVariable = existingFloatVariables.find(
      (variable) => variable.name === name
    );
    if (existingVariable) {
      // Update the existing variable with the same name
      value && existingVariable.setValueForMode(modeId, getPixelValue(value));
      existingVariable.scopes = ["CORNER_RADIUS"];
      return existingVariable;
    }
  }
  // Create a new variable if no variables exist
  const variable = figma.variables.createVariable(name, collection, "FLOAT");
  value && variable.setValueForMode(modeId, getPixelValue(value));
  variable.scopes = ["CORNER_RADIUS"];
  return variable;
}