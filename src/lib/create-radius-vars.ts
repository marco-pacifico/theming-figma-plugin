import { Theme } from "./types";
import { getCollectionAndModeId, createRadiusVariableOrUseExisitng } from "./utils/variables";

export async function createRadiusVars(theme: Theme) {
  // Create a collection for the radius variables or use existing collection if it exists
  const { collection, modeId } = await getCollectionAndModeId("_Radius");

  // Get the existing color variables in the file
  // Need this to check if a variable already exists
  const existingFloatVariables = await figma.variables.getLocalVariablesAsync(
    "FLOAT"
  );
  for (const radiusName in theme.radius) {
    createRadiusVariableOrUseExisitng({
        name: `radius-${radiusName.toLowerCase()}`,
        value: theme.radius[radiusName].toString(),
        collection,
        modeId,
        existingFloatVariables,
    });
  }
}
