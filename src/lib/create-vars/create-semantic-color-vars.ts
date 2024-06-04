import { ColorScale, Theme, SemanticColorMap } from "../types";
import { hexToRgbFloat } from "../utils/formatting";
import { getCollectionAndModeId } from "../utils/variables";

export default async function createSemanticColorVars(theme: Theme) {
  // Create a collection for the colors or use existing collection if it exists
  const { collection, modeId } = await getCollectionAndModeId(
    "_Semantic Colors"
  );

  // Get the existing color variables in the file
  const existingColorVariables = await getVariablesInCollection("_Colors");
  const existingSemanticColorVariables = await getVariablesInCollection(
    "_Semantic Colors"
  );
}

function getSemanticColorMap(theme: Theme): SemanticColorMap {
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
        foreground: theme.brand.foreground,
      },
      accent: {
        primary: 9,
        secondary: 8,
        foreground: theme.accent.foreground,
      },
      supplemental: {
        primary: 9,
        secondary: 8,
        foreground: theme.supplemental.foreground,
      },
    },
    bg: {
      neutral: {
        primary: "white",
        secondary: 0,
        tertiary: 2,
        hover: 0,
        selected: 1,
        pressed: 2,
        disabled: 1,
      },
      brand: {
        primary: theme.brand.BASE,
        secondary: 0,
        tertiary: 2,
        hover: getHoverIndex(theme.brand.BASE),
        pressed: getPressedIndex(theme.brand.BASE),
      },
      accent: {
        primary: theme.accent.BASE,
        secondary: 0,
        tertiary: 2,
        hover: getHoverIndex(theme.accent.BASE),
        pressed: getPressedIndex(theme.accent.BASE),
      },
      supplemental: {
        primary: theme.accent.BASE,
        secondary: 0,
        tertiary: 2,
        hover: getHoverIndex(theme.supplemental.BASE),
        pressed: getPressedIndex(theme.supplemental.BASE),
      },
    },
    border: {
      neutral: {
        primary: 2,
        secondary: 1,
        strong: 6,
      },
      brand: {
        primary: theme.brand.BASE,
        hover: getHoverIndex(theme.brand.BASE),
        pressed: getPressedIndex(theme.brand.BASE),
        secondary: 1,
      },
      accent: {
        primary: theme.accent.BASE,
        hover: getHoverIndex(theme.accent.BASE),
        pressed: getPressedIndex(theme.accent.BASE),
        secondary: 1,
      },
      supplemental: {
        primary: theme.supplemental.BASE,
        hover: getHoverIndex(theme.supplemental.BASE),
        pressed: getPressedIndex(theme.supplemental.BASE),
        secondary: 1,
      },
    },
    icon: {
      neutral: {
        primary: theme.brand.BASE,
        secondary: 4,
        disabled: 3,
        hover: getHoverIndex(theme.brand.BASE),
        pressed: getPressedIndex(theme.brand.BASE),
        "brand-foreground-disabled": 7
      },
      brand: {
        primary: 9,
        secondary: 8,
        foreground: theme.brand.foreground,
      },
      accent: {
        primary: 9,
        secondary: 8,
        foreground: theme.accent.foreground,
      },
      supplemental: {
        primary: 9,
        secondary: 8,
        foreground: theme.supplemental.foreground,
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
