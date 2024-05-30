// **************************************************************
// Capitalize the first letter of a string
// **************************************************************
export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  export function getPixelValue(value: string): number {
    if (value.endsWith("px")) {
      return parseFloat(value.replace("px", ""));
    } else if (value.endsWith("rem")) {
      return parseFloat(value.replace("rem", "")) * 16;
    } else {
      return parseFloat(value);
    }
  }

// **************************************************************
// Clone an object, used for clones fills and strokes
// **************************************************************
export function cloneObject<T>(val: T) {
  return JSON.parse(JSON.stringify(val));
}

// **************************************************************
// Convert HEX to RGB float
// **************************************************************
export function hexToRgbFloat(hex: string): RGB {
  // Remove the hash symbol if it exists
  if (hex.charAt(0) === "#") {
    hex = hex.substring(1);
  }

  // Convert the hex values to decimal and then to float RGB
  const r = parseInt(hex.slice(0, 2), 16) / 255.0;
  const g = parseInt(hex.slice(2, 4), 16) / 255.0;
  const b = parseInt(hex.slice(4, 6), 16) / 255.0;

  return { r, g, b };
}

// **************************************************************
// Convert RGBA float to HEX
// **************************************************************
export function rgbaToHex({
  r,
  g,
  b,
  a,
}: {
  r: number;
  g: number;
  b: number;
  a: number;
}): string {
  const hexR = componentToHex(Math.floor(r * 255));
  const hexG = componentToHex(Math.floor(g * 255));
  const hexB = componentToHex(Math.floor(b * 255));
  const hexA = componentToHex(Math.floor(a * 255));
  return `#${hexR}${hexG}${hexB}${hexA}`;
}

// **************************************************************
// Function to convert an individual RGBA value to hex
// **************************************************************
export function componentToHex(c: number): string {
  const hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

// **************************************************************
// Group by prefix
// **************************************************************
export function groupVariablesByPrefix(
  colorVariables: Variable[]
) {
  return colorVariables.reduce((groups, variable) => {
    const prefix = getPrefix(variable.name);
    if (!groups[prefix]) {
      groups[prefix] = [];
    }
    groups[prefix].push(variable);
    return groups;
  }, {} as Record<string, Variable[]>);
}

export function getPrefix(variableName: string): string {
  const match = variableName.match(/^[^-]+/);
  return match ? match[0] : "";
}

// **************************************************************
// Function to remove A from RGB
// **************************************************************
// type RGBObject = { a: number; r: number; g: number; b: number };
// export function removeAFromRGB(rgbObject: RGBObject): {
//   r: number;
//   g: number;
//   b: number;
// } {
//   const { a, ...rgbWithoutA } = rgbObject;
//   return rgbWithoutA;
// }