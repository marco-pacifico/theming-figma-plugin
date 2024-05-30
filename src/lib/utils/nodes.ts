import { NodeWithChildren } from "../types";

// **************************************************************
// Get an instance of a component from a shared library
// **************************************************************
export async function getInstanceOfComponent(componentKey: string) {
  const importComponent = await figma.importComponentByKeyAsync(componentKey);
  const instance = importComponent.createInstance();
  return instance;
}

// **************************************************************
// Get a node by name and type
// **************************************************************
type TGetNodeArgs = {
  name: string;
  type: NodeType;
  parent?: NodeWithChildren;
};
export function getNode({
  name,
  type,
  parent = figma.currentPage,
}: TGetNodeArgs) {
  const node = parent.findOne(
    (node) => node.type === type && node.name === name
  );
  return node;
}

// **************************************************************
// Remove exisitng node
// **************************************************************
export function removeExistingNode({
  name,
  type,
  parent = figma.currentPage,
}: TGetNodeArgs) {
  const existingNode = getNode({ name, type, parent });
  existingNode && existingNode.remove();
}