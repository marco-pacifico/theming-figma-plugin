import { Theme } from "../types";
import { getCollectionAndModeId } from "../utils/variables";

export default async function createTypographyVars(theme: Theme) {
  // Create a collection for the typography variables or use existing collection if it exists
  const { collection, modeId } = await getCollectionAndModeId("_Typography");

  // Get the existing float and string variables in the file
  // Need this to check if a variable already exists
  const existingFloatVariables = await figma.variables.getLocalVariablesAsync(
    "FLOAT"
  );
  const existingStringVariables = await figma.variables.getLocalVariablesAsync(
    "STRING"
  );

  // Create heading font variable
  createTypographyVariable({
    name: "heading-font",
    value: theme.heading.font,
    type: "STRING",
    collection,
    modeId,
    existingVariables: existingStringVariables,
  });

  // Create font weight variables
  createTypographyVariable({
    name: "heading-weight",
    value: theme.heading.weight,
    type: "FLOAT",
    collection,
    modeId,
    existingVariables: existingFloatVariables,
  });

  // Create heading style variables
  createTypographyVariable({
    name: "heading-style",
    value: theme.heading.style,
    type: "STRING",
    collection,
    modeId,
    existingVariables: existingStringVariables,
  });
}

// **************************************************************
// Create a new variable or update an existing variable with the same name
// **************************************************************
async function createTypographyVariable({
  name,
  value,
  type,
  collection,
  modeId,
  existingVariables,
}: {
  name: string;
  value: string | number;
  type: VariableResolvedDataType;
  collection: VariableCollection;
  modeId: string;
  existingVariables: Variable[];
}) {

  // If the variable type is a float, convert the value to a number
  value = type === "FLOAT" ? Number(value) : value;

  // Get existing variable with the same name, if it exists
  if (existingVariables.length > 0) {
    // Check if a variable with the same name already exists
    const existingVariable = existingVariables.find(
      (variable) => variable.name === name
    );
    // If a variable with the same name exists, update the value
    if (existingVariable) {
      // Update the existing variable with the same name
      value && existingVariable.setValueForMode(modeId, value);
    //   existingVariable.scopes = ["TEXT_CONTENT"];
      return existingVariable;
    }
  }
  // Create a new variable if no variables exist
  const variable = figma.variables.createVariable(name, collection, type);
  value && variable.setValueForMode(modeId, value);
//   variable.scopes = [""];
  return variable;
}
