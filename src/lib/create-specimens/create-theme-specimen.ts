import { componentKeys } from "../component-keys";
import createColorSpecimens from "./create-color-specimens";
import createRadiusSpecimens  from "./create-radius-specimens";
import { loadFonts } from "../utils/fonts";
import {
  getInstanceOfComponent,
  getNode,
  removeExistingNode,
} from "../utils/nodes";

export default async function createThemeSpecimen(themeName: string) {
  // Remove current radius specimens if they exist
  removeExistingNode({
    name: "Theme",
    type: "FRAME",
  });

  // Get component instances needed for documentation
  const themeWrapper = (
    await getInstanceOfComponent(componentKeys.wrapper)
  ).detachInstance();
  themeWrapper.name = "Theme";

  // Load fonts in Color Chip and Color Wrapper
  await loadFonts(themeWrapper);

  // Update Section Title of Radius Wrapper
  const sectionTitle = getNode({
    name: "Section Title",
    type: "TEXT",
    parent: themeWrapper,
  }) as TextNode;
  sectionTitle.characters = `${themeName} Theme`;
  // Remove Section Heading from Radius Wrapper
  removeExistingNode({
    name: "Section Heading",
    type: "TEXT",
    parent: themeWrapper,
  });

  const colorSpecimens = await createColorSpecimens();
  const radiusSpecimens = await createRadiusSpecimens();

  themeWrapper.appendChild(colorSpecimens);
  themeWrapper.appendChild(radiusSpecimens);
}
