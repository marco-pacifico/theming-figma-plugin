export async function getThemeByName(themeName: string) {
  const themeId = themeName.toLowerCase().replace(/\s/g, "-");
  try {
    const response = await fetch(
      `https://theming-playground.vercel.app/api/theme?id=${themeId}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const theme = await response.json();
    return theme;
  } catch (error) {
    console.error("Error:", error);
  }
}
