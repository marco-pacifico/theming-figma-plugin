import { componentKeys } from "../component-keys";
import { loadFonts } from "../utils/fonts";
import {
  getInstanceOfComponent,
  getNode,
  removeExistingNode,
} from "../utils/nodes";
import createColorSpecimens from "./create-color-specimens";
import createRadiusSpecimens from "./create-radius-specimens";
import createTypographySpecimens from "./create-typography-specimens";

export default async function createThemeSpecimen({
  themeName,
  themeFont,
  figmaStyleName,
}: {
  themeName: string;
  themeFont: string;
  figmaStyleName: string;
}) {
  const page = figma.currentPage;
  await page.loadAsync();
  // Remove current theme specimens if they exist
  removeExistingNode({
    name: "Theme",
    type: "FRAME",
    parent: page,
  });

  // Get component instances needed for documentation
  const themeWrapper = (
    await getInstanceOfComponent(componentKeys.themeWrapper)
  ).detachInstance();
  themeWrapper.name = "Theme";

  // Load fonts in Color Chip and Color Wrapper
  await loadFonts(themeWrapper);

  // Update Section Title of Radius Wrapper
  const sectionTitle = getNode({
    name: "Theme",
    type: "TEXT",
    parent: themeWrapper,
  }) as TextNode;
  sectionTitle.characters = themeName;
  // Remove Section Heading from Radius Wrapper
  removeExistingNode({
    name: "Section Heading",
    type: "TEXT",
    parent: themeWrapper,
  });

  const colorSpecimens = await createColorSpecimens();
  const radiusSpecimens = await createRadiusSpecimens();
  const typographySpecimens = await createTypographySpecimens({
    themeFont,
    figmaStyleName,
  });

  themeWrapper.appendChild(typographySpecimens);
  themeWrapper.appendChild(colorSpecimens);
  themeWrapper.appendChild(radiusSpecimens);
}
