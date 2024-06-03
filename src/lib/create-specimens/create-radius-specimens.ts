import { componentKeys } from "../component-keys";
import { loadFonts } from "../utils/fonts";
import {
  createFrame,
  getInstanceOfComponent,
  getNode,
  removeExistingNode,
} from "../utils/nodes";
import {
  getCollectionAndModeId,
  getVariablesInCollection,
} from "../utils/variables";

export default async function createRadiusSpecimens() {
  // Get component instances needed for documentation
  const radiusScale = await getInstanceOfComponent(componentKeys.radiusScale);
  // Get radius wrapper and detach it from the instance
  const radiusWrapper = (
    await getInstanceOfComponent(componentKeys.sectionWrapper)
  ).detachInstance();
  radiusWrapper.name = "Radius";

  // Load fonts in Color Chip and Color Wrapper
  await loadFonts(radiusWrapper);

  // Update Section Title of Radius Wrapper
  const sectionTitle = getNode({
    name: "Title",
    type: "TEXT",
    parent: radiusWrapper,
  }) as TextNode;
  sectionTitle.characters = "Radius Scale";
  // Remove Section Heading from Radius Wrapper
  removeExistingNode({
    name: "Section Heading",
    type: "TEXT",
    parent: radiusWrapper,
  });

  // Get radius variables in the Radius collection
  const radiusVariables = await getVariablesInCollection("_Radius");
  const { modeId } = await getCollectionAndModeId("_Radius");

  // Create empty frame to hold radius specimens
  const radiusScaleRow = createFrame({
    layoutMode: "HORIZONTAL",
    counterAxisSizingMode: "AUTO",
    itemSpacing: 24,
  });

  // Create a radius scale for each variable
  for (const variable of radiusVariables) {
    const radiusScaleInstance = radiusScale.clone();

    // Get text nodes to update with variable name and size
    const NameAndSize = getNode({
      name: "Name and Size",
      type: "FRAME",
      parent: radiusScaleInstance,
    }) as FrameNode;

    // Update Variable Name
    await loadFonts(NameAndSize);
    const Name = getNode({
      name: "Name",
      type: "TEXT",
      parent: NameAndSize,
    }) as TextNode;
    Name && (Name.characters = variable?.name || "radius");

    // Update Variable Size in Pixels
    const Size = getNode({
      name: "Size",
      type: "TEXT",
      parent: NameAndSize,
    }) as TextNode;

    Size && (Size.characters = `${variable?.valuesByMode[modeId]}px` || "0");

    // Bound radius varaible Example frame
    const Example = getNode({
      name: "Example",
      type: "FRAME",
      parent: radiusScaleInstance,
    }) as FrameNode;
    Example.setBoundVariable("topLeftRadius", variable);
    Example.setBoundVariable("topRightRadius", variable);
    Example.setBoundVariable("bottomLeftRadius", variable);
    Example.setBoundVariable("bottomRightRadius", variable);

    // Append radius scale instance to radius scale row
    radiusScaleRow.appendChild(radiusScaleInstance);
  }
  // Append radius scale row to radius wrapper
  radiusWrapper.appendChild(radiusScaleRow);

  // Remove unused imported Radius Scale component
  radiusScale.remove();

  return radiusWrapper;
}
