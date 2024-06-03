import { NodeWithChildren } from "../types";
import { cloneObject } from "./formatting";

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

// **************************************************************
// Create a transparent frame, optionally with layout settings
// **************************************************************
export function createFrame({
  layoutMode = 'NONE',
  itemSpacing = 0,
  counterAxisSizingMode = 'AUTO',
  primaryAxisSizingMode = 'AUTO',
} : {
  layoutMode?: 'NONE' | 'HORIZONTAL' | 'VERTICAL';
  itemSpacing?: number;
  counterAxisSizingMode?: 'FIXED' | 'AUTO'
  primaryAxisSizingMode?: 'FIXED' | 'AUTO'
}) {
  // Create a frame to hold the color chip
  const frame = figma.createFrame();
  // Make the fill transparent
  const fills = cloneObject(frame.fills);
  fills[0].opacity = 0;
  fills[0].type = "SOLID";
  frame.fills = fills;
  // Set the layout mode and spacing of the frame
  frame.layoutMode = layoutMode;
  frame.primaryAxisSizingMode = primaryAxisSizingMode;
  frame.counterAxisSizingMode = counterAxisSizingMode;
  frame.itemSpacing = itemSpacing;
  return frame;
}