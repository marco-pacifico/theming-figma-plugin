let resolveThemes: (value: string[] | PromiseLike<string[]>) => void;
const themesPromise = new Promise<string[]>((resolve) => {
  resolveThemes = resolve
});

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