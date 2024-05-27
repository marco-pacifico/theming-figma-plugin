import { hexToRgbFloat } from "./utils/colors";
import { getThemeByName } from "./data";
import { createCollection } from "./utils/variables";

export async function createColorVars(themeName: string) {
  try {
    // Get the theme by name
    const theme = await getThemeByName(themeName);
    if (!theme) {
      console.error("Theme not found");
      return;
    }
    // Define the color roles
    const colorRoles = ["brand", "accent", "supplemental", "neutral"];
    // Create a collection for the colors
    const { collection, modeId } = createCollection("colors");

    // Create variables for the colors
    colorRoles.forEach((role) => {
      const colorRamp = theme[role];
      const baseShade = colorRamp["BASE"].toString();
      let basePointsTo: Variable | undefined = undefined;
      for (const shade in colorRamp) {
        const variableName = `${role}-${shade}`;
        if (shade !== "BASE") {
          const colorHex = colorRamp[shade];
          const variable = figma.variables.createVariable(
            variableName,
            collection,
            "COLOR"
          );
          variable.setValueForMode(modeId, hexToRgbFloat(colorHex));
          if (shade === baseShade) {
            basePointsTo = variable;
          }
        } else if (shade === "BASE") {
          const baseVariable = figma.variables.createVariable(
            `${role}-base`,
            collection,
            "COLOR"
          );
          if (basePointsTo !== undefined) {
            const alias = figma.variables.createVariableAlias(basePointsTo);
            baseVariable.setValueForMode(modeId, alias);
          }
        }
      }
    });
  } catch (error) {
    console.error("Error creating color variables:", error);
  }
}
