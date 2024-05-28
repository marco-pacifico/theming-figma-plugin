// **************************************************************
// Clone an object
// **************************************************************
export function cloneObject<T>(val: T) {
  return JSON.parse(JSON.stringify(val));
}
// **************************************************************
// Convert HEX as a string to RGB float
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
// Function to remove A from RGB
// **************************************************************
type RGBObject = { a: number; r: number; g: number; b: number };
export function removeAFromRGB(rgbObject: RGBObject): {
  r: number;
  g: number;
  b: number;
} {
  const { a, ...rgbWithoutA } = rgbObject;
  return rgbWithoutA;
}

// **************************************************************
// Function to convert an individual RGBA value to hex
// **************************************************************
export function componentToHex(c: number): string {
  const hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

// **************************************************************
// Function to convert RGBA to HEX
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
