import { BoundVariables } from "../types";
import { NodeWithFills } from "../types";
import { cloneObject, hexToRgbFloat } from "./colors";

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
  // Check if a collection with the same name already exists
  const collection = existingCollections.find(
    (collection) => collection.name === collectionName
  );
  const variableIdsInCollection = collection?.variableIds || [];

  const variablesInCollection = [];

  for (const variableId of variableIdsInCollection) {
    const variable = await figma.variables.getVariableByIdAsync(variableId);
    variablesInCollection.push(variable);
  }
  return variablesInCollection;
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

type TCreateRadiusVariablesOrUpdateExisitng = {
  name: string;
  value: string;
  collection: VariableCollection;
  modeId: string;
  existingFloatVariables: Variable[];
};
export async function createRadiusVariableOrUseExisitng({
  name,
  value,
  collection,
  modeId,
  existingFloatVariables,
}: TCreateRadiusVariablesOrUpdateExisitng) {
  if (existingVariables && existingVariables.length > 0) {
    // Check if a variable with the same name already exists
    const existingVariable = existingFloatVariables.find(
      (variable) => variable.name === name
    );
    if (existingVariable) {
      // Update the existing variable with the same name
      value && existingVariable.setValueForMode(modeId, convertToPixels(value));
      existingVariable.scopes = ["CORNER_RADIUS"];
      return existingVariable;
    }
  }
  // Create a new variable if no variables exist
  const variable = figma.variables.createVariable(name, collection, "FLOAT");
  value && variable.setValueForMode(modeId, convertToPixels(value));
  variable.scopes = ["CORNER_RADIUS"];
  return variable;
}

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

export function groupVariablesByPrefix(
  colorVariables: Variable[]
): Record<string, Variable[]> {
  return colorVariables.reduce((groups, variable) => {
    const prefix = getPrefix(variable.name);
    if (!groups[prefix]) {
      groups[prefix] = [];
    }
    groups[prefix].push(variable);
    return groups;
  }, {} as Record<string, Variable[]>);
}

export function getPrefix(variableName: string): string {
  const match = variableName.match(/^[^-]+/);
  return match ? match[0] : "";
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function convertToPixels(value: string): number {
  if (value.endsWith("px")) {
    return parseFloat(value.replace("px", ""));
  } else if (value.endsWith("rem")) {
    return parseFloat(value.replace("rem", "")) * 16;
  } else {
    return parseFloat(value);
  }
}

export function getVariableIdsForFills(data: BoundVariables[]) {
  const variableIds: string[] = [];
  if (!Array.isArray(data)) {
    console.error("Expected data to be an array:", data);
    return variableIds;
  }

  data.forEach((item) => {
    if (Array.isArray(item.fills)) {
      item.fills.forEach((fill) => {
        if (fill.id) {
          variableIds.push(fill.id);
        }
      });
    }
  });

  return variableIds;
}
