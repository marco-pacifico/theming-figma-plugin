// **************************************************************
// Create new or use existing collection with the given name

import { hexToRgbFloat } from "./colors";

// **************************************************************
export async function getCollectionAndModeId(name: string) {
  // Initialize the collection and modeId
  let collection: VariableCollection | null = null;
  let modeId: string | null = null;
  // Get all the existing collections in the file
  const existingCollections =
    await figma.variables.getLocalVariableCollectionsAsync();
  // Check if a collection with the same name already exists
  const collectionWithSameName = existingCollections.find(
    (collection) => collection.name === name
  );
  if (collectionWithSameName) {
    collection = collectionWithSameName;
    modeId = collectionWithSameName.modes[0].modeId;
  } else {
    // Create a new collection if one with the same name doesn't exist
    collection = figma.variables.createVariableCollection(name);
    modeId = collection.modes[0].modeId;
  }
  return { collection, modeId };
}

// **************************************************************
// Get an array of the existing variables, optionally filtered by type
// **************************************************************
export async function existingVariables(type: VariableResolvedDataType) {
  return await figma.variables.getLocalVariablesAsync(type);
}

// **************************************************************
// Create a new variable or update an existing variable with the same name
// **************************************************************
type TCreateColorVariablesOrUpdateExisitng = {
  name: string;
  hex?: string;
  collection: VariableCollection;
  modeId: string;
  existingColorVariables: Variable[];
};
export async function createColorVariableOrUseExisitng({
  name,
  hex,
  collection,
  modeId,
  existingColorVariables,
}: TCreateColorVariablesOrUpdateExisitng) {
  if (existingVariables && existingVariables.length > 0) {
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
