// **************************************************************
// HELPER FUNCTIONS
// **************************************************************

// **************************************************************
// Get an instance of a component from a shared library
// **************************************************************
export async function importInstance(key: string) {
  const importComponent = await figma.importComponentByKeyAsync(key);
  const component = importComponent.createInstance();
  return component;
}

// **************************************************************
// Get a node by name and type
// **************************************************************
// function getNode(name: string, type: string, parent: BaseNode = figma.root) {
//   // eslint-disable-next-line @figma/figma-plugins/dynamic-page-find-method-advice
//   const node = parent.findOne(
//     (node: BaseNode) => node.type === type && node.name === name
//   );
//   return node;
// }