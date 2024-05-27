// **************************************************************
// Create a collection
// **************************************************************
export function createCollection(name: string) {
    const collection = figma.variables.createVariableCollection(name);
    const modeId = collection.modes[0].modeId;
    return { collection, modeId };
  }