import { Theme } from "../types";
import { getFigmaStyleName } from "../utils/fonts";
import { getCollectionAndModeId } from "../utils/variables";

export default async function createTypographyVars(theme: Theme) {
  // Create a collection for the typography variables or use existing collection if it exists
  const { collection, modeId } = await getCollectionAndModeId("_Typography");

  // Get Figma font sytle name based on the theme's font family and weight number, and load the font
  const figmaStyleName = await getFigmaStyleName({
    fontFamily: theme.heading.font,
    fontWeight: theme.heading.weight,
  });


  // If font variables already exist, update them
  if ((await existingFontVaraibles()).exist) {
    const { fontFamilyVariable, fontStyleVariable } = (
      await existingFontVaraibles()
    ).variables;
    await updateExistingVariables({
      fontFamilyVariable,
      fontStyleVariable,
      modeId,
      fontFamily: theme.heading.font,
      figmaStyleName,
    });
    return;
  }

  // Create new font variables if none exist already
  createNewTypographyVariables({
    collection,
    modeId,
    fontFamilyName: theme.heading.font,
    figmaStyleName,
  });
}


// **************************************************************
// Create new font family and font style variables
// **************************************************************
function createNewTypographyVariables({
  collection,
  modeId,
  fontFamilyName,
  figmaStyleName,
}: {
  collection: VariableCollection;
  modeId: string;
  fontFamilyName: string;
  figmaStyleName: string;
}) {
  // Create a new font family variable
  const fontFamilyVariable = figma.variables.createVariable(
    "heading-font-family",
    collection,
    "STRING"
  );
  // Set its value
  fontFamilyVariable &&
    fontFamilyVariable.setValueForMode(modeId, fontFamilyName);
  //   fontFamilyVariable.scopes = [""];

  // Create a new font style variable
  const fontStyleVariable = figma.variables.createVariable(
    "heading-font-style",
    collection,
    "STRING"
  );

  fontStyleVariable &&
    fontStyleVariable.setValueForMode(modeId, figmaStyleName);
  //   fontStyleVariable.scopes = [""];
}

// **************************************************************
// Check if font variables already exist
// If they do, return the variables
// **************************************************************
async function existingFontVaraibles() {
  // Get all string variables in the file
  const existingStringVariables = await figma.variables.getLocalVariablesAsync(
    "STRING"
  );
  // If no string variables exist, return false
  if (existingStringVariables.length === 0) {
    return { exist: false, variables: {} };
  }

  const fontFamilyVariable = existingStringVariables.find(
    (variable) => variable.name === "heading-font-family"
  );
  const fontStyleVariable = existingStringVariables.find(
    (variable) => variable.name === "heading-font-style"
  );

  if (!fontFamilyVariable && !fontStyleVariable) {
    return { exist: false, variables: {} };
  }

  return {
    exist: true,
    variables: { fontFamilyVariable, fontStyleVariable },
  };
}

// **************************************************************
// Update existing font variables
// **************************************************************
async function updateExistingVariables({
  fontFamilyVariable,
  fontStyleVariable,
  modeId,
  fontFamily,
  figmaStyleName,
}: {
  fontFamilyVariable: Variable | undefined;
  fontStyleVariable: Variable | undefined;
  modeId: string;
  fontFamily: string;
  figmaStyleName: string;
}) {
  fontFamilyVariable && fontFamilyVariable?.setValueForMode(modeId, fontFamily);
  fontStyleVariable &&
    fontStyleVariable?.setValueForMode(modeId, figmaStyleName);
}
