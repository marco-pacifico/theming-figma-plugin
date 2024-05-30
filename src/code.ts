import { arrangeNodesOnPage } from "./lib/arrange-nodes-on-page";
import { createColorVars } from "./lib/create-color-vars";
import { createRadiusVars } from "./lib/create-radius-vars";
import createThemeSpecimen from "./lib/create-theme-specimen";
import { getThemeByName, getThemesPromise } from "./lib/data";
import { handleParametersInput } from "./lib/handleParametersInput";
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
    await createThemeSpecimen(themeName);

    // Swap bounded variables 
    await swapVariables();

    // arrangeNodesOnPage();
    
    // Close the plugin after running
    figma.closePlugin(`Theme created for: ${themeName}`);
  });
}

// Run the plugin
run();
