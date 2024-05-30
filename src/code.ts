import { createColorSpecimens } from "./lib/color-specimens";
import { createColorVars } from "./lib/create-color-vars";
import { createRadiusVars } from "./lib/create-radius-vars";
import { getThemeByName, getThemesPromise } from "./lib/data";
import { handleParametersInput } from "./lib/handleParametersInput";
import { createRadiusSpecimens } from "./lib/radius-specimens";
import swapVariables from "./lib/swap-variables";

async function run() {
  // Fetch list of themes
  const themesPromise = getThemesPromise();

  // Show list of themes in the plugin parameters input field
  figma.parameters.on(
    "input",
    async (inputEvent: ParameterInputEvent) =>
      await handleParametersInput(inputEvent, themesPromise)
  );

  // When user selects a theme name, use theme name to generate theme variables and styles
  figma.on("run", async ({ parameters }: RunEvent) => {
    
    // Get the theme name from the plugin parameters
    const themeName = parameters?.theme;

    // Notify the user that the plugin is processing
    figma.notify(`Creating theme for: ${themeName}`);

    // Fetch the theme data
    const theme = await getThemeByName(themeName);

    // Create variables
    await createColorVars(theme);
    await createRadiusVars(theme);

    // Create specimens
    await createColorSpecimens();
    await createRadiusSpecimens();

    // Swap bounded variables 
    await swapVariables();
    
    // Close the plugin after running
    figma.closePlugin(`Theme created for: ${themeName}`);
  });
}

// Run the plugin
run();
