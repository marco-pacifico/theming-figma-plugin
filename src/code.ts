import createThemeSpecimen from "./lib/create-specimens/create-theme-specimen";
import createColorVars from "./lib/create-vars/create-color-vars";
import createSemanticColorVars from "./lib/create-vars/create-semantic-color-vars";
import createRadiusVars from "./lib/create-vars/create-radius-vars";
import createTypographyVars from "./lib/create-vars/create-typography-vars";
import { getThemeByName, getThemesPromise } from "./lib/data";
import { handleParametersInput } from "./lib/handleParametersInput";
import swapTextStyles from "./lib/swap-text-styles";
import swapVariables from "./lib/swap-variables";
import { getFigmaStyleName } from "./lib/utils/fonts";

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

    // Get Figma font sytle name based on the theme's font family and weight number, and load the font
    const figmaStyleName = await getFigmaStyleName({
      fontFamily: theme.heading.font,
      fontWeight: theme.heading.weight,
      fontStyle: theme.heading.style,
    });

    // Create variables
    await createColorVars(theme);
    await createSemanticColorVars(theme);
    await createRadiusVars(theme);
    await createTypographyVars(theme, figmaStyleName);

    // Create specimens
    await createThemeSpecimen({
      themeName: theme.name,
      themeFont: theme.heading.font,
      figmaStyleName,
    });

    // Swap bounded variables
    await swapVariables();

    // Swap text styles
    await swapTextStyles();

    // Close the plugin after running
    figma.closePlugin(`Theme created for: ${themeName}`);
  });
}

// Run the plugin
run();
