import { ColorScale, Theme } from "../types";
import { createColorOrUpdateVariable, getCollectionAndModeId, getVariablesInCollection } from "../utils/variables";

export default async function createColorVars(theme: Theme) {
  // Create a collection for the colors or use existing collection if it exists
  const { collection, modeId } = await getCollectionAndModeId("_Colors");

  // Get the existing color variables in the file
  // Need this to check if a variable already exists
  // const existingColorVariables = await figma.variables.getLocalVariablesAsync(
  //   "COLOR"
  // );
  const variablesInCollection = await getVariablesInCollection("_Colors");

  // Define the color roles
  const COLOR_ROLES = ["brand", "accent", "supplemental", "neutral"];
  // Create variables for the colors
  for (const role of COLOR_ROLES) {
    const scale = theme[role] as ColorScale;

    // Needed to capture the shade that the base shade will be aliased to later
    let baseAliasedTo: Variable | undefined = undefined;
    // Needed to capture the shade that the foreground shade will be aliased to later
    let foregroundAliasedTo: Variable | undefined = undefined;

    for (const shade in scale) {
      if (shade !== "BASE" && shade !== "FOREGROUND") {
        // Create new variable or update existing variable with the same name
        const variable = await createColorOrUpdateVariable({
          name: `${role}-${shade}`,
          hex: scale[shade].toString(),
          collection,
          modeId,
          variablesInCollection,
        });
        // If a base shade exisits in the scale and the current shade = base shade, capture the variable to alias to later
        if (scale["BASE"] && shade === scale["BASE"].toString()) {
          baseAliasedTo = variable;
        }
        // If a foreground shade exisits in the scale and the current shade = foreground shade, capture the variable to alias to later
        if (scale["FOREGROUND"] && shade === scale["FOREGROUND"].toString()) {
          foregroundAliasedTo = variable;
        }
      } else if (shade === "BASE") {
        const baseVariable = await createColorOrUpdateVariable({
          name: `${role}-base`,
          collection,
          modeId,
          variablesInCollection,
        });
        // If there's a base shade, set role-base = role-base_shade (e.g. brand-base = brand-500)
        if (baseAliasedTo !== undefined) {
          const alias = figma.variables.createVariableAlias(baseAliasedTo);
          baseVariable.setValueForMode(modeId, alias);
        }
      } else if (shade === "FOREGROUND") {
        const foregroundVariable = await createColorOrUpdateVariable({
          name: `${role}-foreground`,
          collection,
          modeId,
          variablesInCollection,
        });
        // If there's a foreground shade, set role-foreground = role-foreground_shade (e.g. brand-foreground = brand-500)
        if (foregroundAliasedTo !== undefined) {
          const alias =
            figma.variables.createVariableAlias(foregroundAliasedTo);
          foregroundVariable.setValueForMode(modeId, alias);
        }
      }
    }
  }
}

