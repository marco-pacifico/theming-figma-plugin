import { handleParametersInput } from "./lib/handleParametersInput";
import { getThemesPromise } from "./lib/data";
import { createColorVars } from "./lib/create-color-vars";

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
    const themeName = parameters?.theme;

    // Create color variables
    await createColorVars(themeName);

    // Close the plugin after running
    figma.closePlugin(`Theme created for: ${themeName}`);
  });
}

// Run the plugin
run();
