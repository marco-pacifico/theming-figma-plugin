import { componentKeys } from "./component-keys";
import { loadFonts } from "./utils/fonts";
import {
  getInstanceOfComponent,
  getNode,
  removeExistingNode,
} from "./utils/nodes";
import {
  getCollectionAndModeId,
  getVariablesInCollection,
} from "./utils/variables";

export async function createRadiusSpecimens() {
  // Remove current radius specimens if they exist
  removeExistingNode({
    name: "Radius",
    type: "FRAME",
  });

  // Get component instances needed for documentation
  const radiusScale = await getInstanceOfComponent(componentKeys.radiusScale);
  const radiusWrapper = (
    await getInstanceOfComponent(componentKeys.wrapper)
  ).detachInstance();
  radiusWrapper.name = "Radius";

  // Load fonts in Color Chip and Color Wrapper
  await loadFonts(radiusWrapper);

  // Update Section Title of Radius Wrapper
  const sectionTitle = getNode({
    name: "Section Title",
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
    const name = getNode({
      name: "Name",
      type: "TEXT",
      parent: NameAndSize,
    }) as TextNode;
    name.characters = variable?.name || "radius";

    // Update Variable Size in Pixels
    const Size = getNode({
      name: "Size",
      type: "FRAME",
      parent: NameAndSize,
    }) as FrameNode;
    await loadFonts(Size);
    const sizePx = getNode({
      name: "size-px",
      type: "TEXT",
      parent: Size,
    }) as TextNode;
    sizePx.characters = `${variable?.valuesByMode[modeId]}px` || "0";
    // Hide Text Node for Size in Rem
    const sizeRem = getNode({
      name: "size-rem",
      type: "TEXT",
      parent: Size,
    }) as TextNode;
    sizeRem.opacity = 0;

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

    // Append radius scale instance to radius wrapper
    radiusWrapper.appendChild(radiusScaleInstance);
  }
  // Remove imported Radius Scale component
  radiusScale.remove();
}
