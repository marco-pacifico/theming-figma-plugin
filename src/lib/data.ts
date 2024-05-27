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

export const getThemesPromise = async () => {
  // Declare a promise and create a function to resolve it later, when we receive the themes from the invisible iframe
  return new Promise<string[]>((resolve) => {
    // Create an invisible iframe UI to use network API to fetch themes
    // This iframe will fetch the themes and send them to the plugin as a message
    // postMessage is used to send messages from the iframe to the plugin
    figma.showUI(
      `<script>
      (async (event) => {
        try {
          const res = await fetch("https://theming-playground.vercel.app/api/themes");
          const json = await res.json();
          window.parent.postMessage({ pluginMessage: json }, "*");
        } catch (error) {
          window.parent.postMessage({ pluginMessage: { error: error.message } }, "*");
        }
      })();
    </script>`,
      { visible: false }
    );
    // Resolve the themes promise when the message is received from the iframe
    // onmessage is used to listen for messages from the iframe
    // The message contains the themes fetched from the API
    figma.ui.onmessage = (json) => {
      resolve(json);
    };
  });
};
