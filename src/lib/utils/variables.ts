import { NodeWithFills } from "../types";
import { cloneObject, hexToRgbFloat } from "./formatting";

// **************************************************************
// Create new or use existing collection with the given name
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
// Get an array of the existing local variables in a file, optionally filtered by type
// **************************************************************
export async function existingVariables(type: VariableResolvedDataType) {
  return await figma.variables.getLocalVariablesAsync(type);
}

// **************************************************************
// Get variables in a collection
// **************************************************************
export async function getVariablesInCollection(collectionName: string) {
  // Get all the existing collections in the file
  const existingCollections =
    await figma.variables.getLocalVariableCollectionsAsync();
  // Get the collection with the given name
  const collection = existingCollections.find(
    (collection) => collection.name === collectionName
  );
  // Get the variable ids in the collection
  const variableIdsInCollection = collection?.variableIds || [];
  // Get variables using the variable ids
  const variablesInCollection = [];
  for (const variableId of variableIdsInCollection) {
    const variable = await figma.variables.getVariableByIdAsync(variableId);
    variablesInCollection.push(variable);
  }
  return variablesInCollection;
}

// **************************************************************
// Bind color variable to fills in a node
// **************************************************************
export function bindFillsVariableToNode(
  colorVariable: Variable,
  nodeToPaint: NodeWithFills
) {
  // Clone the fills of the nodeToPaint
  const fills = nodeToPaint && cloneObject(nodeToPaint.fills);
  // Set the fill to the variable color
  fills[0] = figma.variables.setBoundVariableForPaint(
    fills[0],
    "color",
    colorVariable
  );
  // Update the fills of the nodeToPain
  nodeToPaint.fills = fills;
}

// **************************************************************
//  Bind color variable to strokes in a node
// **************************************************************
export function bindStrokesVariableToNode(
  colorVariable: Variable,
  nodeToPaint: NodeWithFills
) {
  // Clone the strokes of the nodeToPaint
  const clonedStrokes = nodeToPaint && cloneObject(nodeToPaint.strokes);
  // Set the stroke to the variable color
  clonedStrokes[0] = figma.variables.setBoundVariableForPaint(
    clonedStrokes[0],
    "color",
    colorVariable
  );
  // Update the fills of the frame node
  nodeToPaint.strokes = clonedStrokes;
}

// **************************************************************
// Create a new variable or update an existing variable with the same name
// **************************************************************
export async function createColorOrUpdateVariable({
  name,
  hex,
  collection,
  modeId,
  variablesInCollection,
}: {
  name: string;
  hex?: string;
  collection: VariableCollection;
  modeId: string;
  variablesInCollection: (Variable | null)[];
}) {
  if (variablesInCollection && variablesInCollection.length > 0) {
    // Check if a variable with the same name already exists
    const existingVariable = variablesInCollection.find(
      (variable) => variable?.name === name
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

// **************************************************************
// Create a new variable or update an existing variable with an alias
// **************************************************************
export async function createAndAliasToColorVariable({
  name,
  aliasTo,
  collection,
  modeId,
  colorVariables,
  semanticVariables,
}: {
  name: string;
  aliasTo: string;
  collection: VariableCollection;
  modeId: string;
  colorVariables: (Variable | null)[];
  semanticVariables: (Variable | null)[];
}) {
  // Get the color variable to alias to
  const colorVariableToAliasTo = colorVariables.find(
    (variable) => variable?.name === aliasTo
  );

  // Check if a semantic variable with the same name already exists
  const existingSemanticVariable = semanticVariables.find(
    (variable) => variable?.name === name
  );

  // If a semantic variable with the same name already exists, update it with the alias
  if (existingSemanticVariable && colorVariableToAliasTo) {
    const alias = figma.variables.createVariableAlias(colorVariableToAliasTo);
    existingSemanticVariable.setValueForMode(modeId, alias);
    return;
  }
  // If a semantic variables doesn't exist already, create a new variable and set the alias
  const variable = figma.variables.createVariable(name, collection, "COLOR");
  if (colorVariableToAliasTo) {
    const alias = figma.variables.createVariableAlias(colorVariableToAliasTo);
    variable.setValueForMode(modeId, alias);
  }
}
