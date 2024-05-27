import { createColorVars } from "./lib/create-color-vars";
import { getThemeByName, getThemesPromise } from "./lib/data";
import { handleParametersInput } from "./lib/handleParametersInput";

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

    // Fetch the theme data 
    const theme = await getThemeByName(themeName);
    if (!theme) {
      console.error("Theme not found");
      return;
    }

    // Create color variables
    await createColorVars(theme);
    
    // Close the plugin after running
    figma.closePlugin(`Theme created for: ${themeName}`);
  });
}

// Run the plugin
run();
