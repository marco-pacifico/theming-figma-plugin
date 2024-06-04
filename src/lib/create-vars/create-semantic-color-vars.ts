import { SemanticColorMap, Theme } from "../types";
import {
  createColorOrUpdateVariable,
  getCollectionAndModeId,
  getVariablesInCollection,
  createAndAliasToColorVariable,
} from "../utils/variables";

export default async function createSemanticColorVars(theme: Theme) {
  // Create a collection for the colors or use existing collection if it exists
  const { collection, modeId } = await getCollectionAndModeId(
    "_Semantic Colors"
  );

  // Get the existing color variables in the file
  const colorVariables = await getVariablesInCollection("_Colors");
  const semanticVariables = await getVariablesInCollection("_Semantic Colors");

  // Get the semantic color map
  const SHADE_NUMBERS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  const SEMANTIC_COLOR_MAP = getSemanticColorMap(theme, SHADE_NUMBERS);

  // And map through it to create semantic variables
  for (const colorType in SEMANTIC_COLOR_MAP) {
    // Color Type = text, bg, border, icon, link
    for (const colorRole in SEMANTIC_COLOR_MAP[colorType]) {
      // Color Role = neutral, brand, accent, success, warning, danger
      for (const colorProminence in SEMANTIC_COLOR_MAP[colorType][colorRole]) {
        // Color Prominence = primary, secondary, etc..
        let name = colorType;
        // Don't include "neutral" to the variable name
        // Don't include "brand" in the variable name for links
        if (colorRole !== "neutral" && colorType !== "link") {
          name += `-${colorRole}`;
        }
        // Don't include "primary" in the variable name
        if (colorProminence !== "primary") {
          name += `-${colorProminence}`;
        }

        const semanticVariableName = `os-color-${name}`;
        const shadeIndex =
          SEMANTIC_COLOR_MAP[colorType][colorRole][colorProminence];

        if (shadeIndex === "white") {
          // Special case for white
          // If white there is no variable to alias to in the theme, it's just white
          await createColorOrUpdateVariable({
            name: semanticVariableName,
            hex: "#FFFFFF",
            collection,
            modeId,
            variablesInCollection: semanticVariables,
          });
        } else {
          await createAndAliasToColorVariable({
            name: semanticVariableName,
            aliasTo: `${colorRole}-${SHADE_NUMBERS[+shadeIndex]}`,
            collection,
            modeId,
            colorVariables,
            semanticVariables,
          });
        }
      }
    }
  }
}

function getSemanticColorMap(
  theme: Theme,
  SHADE_NUMBERS: number[]
): SemanticColorMap {
  const brandBaseIndex = SHADE_NUMBERS.indexOf(theme.brand.BASE);
  const accentBaseIndex = SHADE_NUMBERS.indexOf(theme.accent.BASE);
  const supplementalBaseIndex = SHADE_NUMBERS.indexOf(theme.supplemental.BASE);
  const brandForegroundIndex = SHADE_NUMBERS.indexOf(theme.brand.FOREGROUND);
  const accentForegroundIndex = SHADE_NUMBERS.indexOf(theme.accent.FOREGROUND);
  const supplementalForegroundIndex = SHADE_NUMBERS.indexOf(
    theme.supplemental.FOREGROUND
  );

  const SEMANTIC_COLOR_MAP = {
    link: {
      brand: {
        primary: 7,
        hover: 8,
      },
    },
    text: {
      neutral: {
        primary: 8,
        secondary: 6,
        tertiary: 5,
        placeholder: 4,
        disabled: 3,
        "brand-foreground-disabled": 7,
      },
      brand: {
        primary: 9,
        secondary: 8,
        foreground: brandForegroundIndex,
      },
      accent: {
        primary: 9,
        secondary: 8,
        foreground: accentForegroundIndex,
      },
      supplemental: {
        primary: 9,
        secondary: 8,
        foreground: supplementalForegroundIndex,
      },
    },
    bg: {
      neutral: {
        page: "white",
        secondary: 0,
        tertiary: 2,
        hover: 0,
        selected: 1,
        pressed: 2,
        disabled: 1,
      },
      brand: {
        primary: brandBaseIndex,
        secondary: 0,
        tertiary: 2,
        hover: getHoverIndex(brandBaseIndex),
        pressed: getPressedIndex(brandBaseIndex),
      },
      accent: {
        primary: accentBaseIndex,
        secondary: 0,
        tertiary: 2,
        hover: getHoverIndex(accentBaseIndex),
        pressed: getPressedIndex(accentBaseIndex),
      },
      supplemental: {
        primary: supplementalBaseIndex,
        secondary: 0,
        tertiary: 2,
        hover: getHoverIndex(supplementalBaseIndex),
        pressed: getPressedIndex(supplementalBaseIndex),
      },
    },
    border: {
      neutral: {
        primary: 2,
        secondary: 1,
        strong: 6,
      },
      brand: {
        primary: brandBaseIndex,
        hover: getHoverIndex(brandBaseIndex),
        pressed: getPressedIndex(brandBaseIndex),
        secondary: 1,
      },
      accent: {
        primary: accentBaseIndex,
        hover: getHoverIndex(accentBaseIndex),
        pressed: getPressedIndex(accentBaseIndex),
        secondary: 1,
      },
      supplemental: {
        primary: supplementalBaseIndex,
        hover: getHoverIndex(supplementalBaseIndex),
        pressed: getPressedIndex(supplementalBaseIndex),
        secondary: 1,
      },
    },
    icon: {
      neutral: {
        primary: brandBaseIndex,
        secondary: 4,
        disabled: 3,
        hover: getHoverIndex(brandBaseIndex),
        pressed: getPressedIndex(brandBaseIndex),
        "brand-foreground-disabled": 7,
      },
      brand: {
        primary: 9,
        secondary: 8,
        foreground: brandForegroundIndex,
      },
      accent: {
        primary: 9,
        secondary: 8,
        foreground: accentForegroundIndex,
      },
      supplemental: {
        primary: 9,
        secondary: 8,
        foreground: supplementalForegroundIndex,
      },
    },
  };

  return SEMANTIC_COLOR_MAP;
}

function getHoverIndex(inputIndex: number) {
  if (inputIndex === 10) {
    return 9;
  }
  return inputIndex + 1;
}
function getPressedIndex(inputIndex: number) {
  if (inputIndex === 10 || inputIndex === 9) {
    return 8;
  }
  return inputIndex + 2;
}
