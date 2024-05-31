import { ColorScale, Theme } from "../types";
import { hexToRgbFloat } from "../utils/formatting";
import {
    getCollectionAndModeId,
} from "../utils/variables";

export default async function createColorVars(theme: Theme) {
  try {
    
    // Create a collection for the colors or use existing collection if it exists
    const { collection, modeId } = await getCollectionAndModeId("_Colors");

    // Get the existing color variables in the file
    // Need this to check if a variable already exists
    const existingColorVariables = await figma.variables.getLocalVariablesAsync(
      "COLOR"
    );

    // Define the color roles
    const COLOR_ROLES = ["brand", "accent", "supplemental", "neutral"];
    // Create variables for the colors
    for (const role of COLOR_ROLES) {
      const scale = theme[role] as ColorScale;

      // Needed to capture the shade that the base shade will be aliased to later
      let baseAliasedTo: Variable | undefined = undefined;

      for (const shade in scale) {
        if (shade !== "BASE") {
          // Create new variable or update existing variable with the same name
          const variable = await createColorVariable({
            name: `${role}-${shade}`,
            hex: scale[shade].toString(),
            collection,
            modeId,
            existingColorVariables,
          });
          // If a base shade exisits in the scale and the current shade = base shade, capture the variable to alias to later
          if (scale["BASE"] && shade === scale["BASE"].toString()) {
            baseAliasedTo = variable;
          }
        } else if (shade === "BASE") {
          const baseVariable = await createColorVariable({
            name: `${role}-base`,
            collection,
            modeId,
            existingColorVariables,
          });
          // If there's a base shade, set role-base = role-base_shade (e.g. brand-base = brand-500)
          if (baseAliasedTo !== undefined) {
            const alias = figma.variables.createVariableAlias(baseAliasedTo);
            baseVariable.setValueForMode(modeId, alias);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error creating color variables:", error);
  }
}


// **************************************************************
// Create a new variable or update an existing variable with the same name
// **************************************************************
async function createColorVariable({
  name,
  hex,
  collection,
  modeId,
  existingColorVariables,
}: {
  name: string;
  hex?: string;
  collection: VariableCollection;
  modeId: string;
  existingColorVariables: Variable[];
}) {
  if (existingColorVariables && existingColorVariables.length > 0) {
    // Check if a variable with the same name already exists
    const existingVariable = existingColorVariables.find(
      (variable) => variable.name === name
    );
    if (existingVariable) {
      // Update the existing variable with the same name
      hex && existingVariable.setValueForMode(modeId, hexToRgbFloat(hex));
      return existingVariable;
    }
  }
  // Create a new variable if no variables exist
  const variable = figma.variables.createVariable(name, collection, "COLOR");
  hex && variable.setValueForMode(modeId, hexToRgbFloat(hex));
  return variable;
}