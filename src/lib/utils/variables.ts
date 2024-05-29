import { BoundVariables } from "../types";
// **************************************************************
// Create new or use existing collection with the given name

import { NodeWithFills } from "../types";
import { cloneObject, hexToRgbFloat } from "./colors";

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


export function bindColorVariableToNode (colorVariable: Variable, nodeToPaint: NodeWithFills) {
   // Get the fills of the frame node
   const fills = nodeToPaint && cloneObject(nodeToPaint.fills);
   // Set the fill to the variable color
   fills[0] = figma.variables.setBoundVariableForPaint(
     fills[0],
     "color",
     colorVariable
   );
   // Update the fills of the frame node
   nodeToPaint.fills = fills;
}

export function groupVariablesByPrefix(colorVariables: Variable[]): Record<string, Variable[]> {
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

// interface HasFills {
//   fills: VariableAlias[];
// }

// export function filterDataWithFills<T>(data: T[]): HasFills[] {
//   return data.filter((item): item is HasFills => 'fills' in item);
// }

// export function getVariableIdsForFills(data: HasFills[]): string[] {
//   const variableIds: string[] = [];

//   data.forEach(item => {
//     item.fills.forEach(fill => {
//       if (fill.id) {
//         variableIds.push(fill.id);
//       }
//     });
//   });

//   return variableIds;
// }


export function getVariableIdsForFills(data: BoundVariables[]) {
  const variableIds: string[] = [];
  if (!Array.isArray(data)) {
    console.error('Expected data to be an array:', data);
    return variableIds;
  }

  data.forEach(item => {
    if (Array.isArray(item.fills)) {
      item.fills.forEach(fill => {
        if (fill.id) {
          variableIds.push(fill.id);
        }
      });
    }
  });

  return variableIds;
}