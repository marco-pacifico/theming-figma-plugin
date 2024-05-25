// Declare a promise and assign its resolve function to resolveThemes so we can resolve it later, when we receive the themes from the invisible iframe
let resolveThemes: (value: string[] | PromiseLike<string[]>) => void;
const themesPromise = new Promise<string[]>((resolve) => {
  resolveThemes = resolve
});

// Create an invisible iframe UI to use network API to fetch themes
figma.showUI(
  `<script>
    (async (event) => {
      const res = await fetch("https://theming-playground.vercel.app/api/themes");
      const json = await res.json();
      window.parent.postMessage({ pluginMessage: json }, "*");
    })();
  </script>`,
  { visible: false }
);

// Resolve the themes promise when a message is received from the iframe
figma.ui.onmessage = (json) => {
  resolveThemes(json);
};

// Listen for the input event and fetch the themes when the user types in the input
// Set the suggestions based on the themes fetched
// Filter the suggestions based on the query entered
figma.parameters.on(
  'input',
  async ({ key, query, result }: ParameterInputEvent) => {
    // When fetching data show a loading message
    result.setLoadingMessage('Loading themes...');
    const themes = await themesPromise;
    result.setSuggestions(
      // Filter suggestions based on the query entered
      themes.filter((theme) =>
        theme.toLowerCase().includes(query.toLowerCase())
      )
    );
  }
);

figma.on('run', ({ parameters }: RunEvent) => {
  const themeName = parameters?.theme;
  figma.closePlugin(`You selected the theme: ${themeName}`);
});