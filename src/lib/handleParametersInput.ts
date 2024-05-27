export async function handleParametersInput(
  inputEvent: ParameterInputEvent,
  themesPromise: Promise<string[]>
) {
  // Destructure the input event
  const { key, query, result } = inputEvent;
  // When fetching data, show a loading message
  result.setLoadingMessage("Loading themes...");
  // Fetch themes
  const themes = await themesPromise;
  // Set suggestions based on the themes fetched
  result.setSuggestions(
    // Filter suggestions based on the query entered
    themes.filter((theme) => theme.toLowerCase().includes(query.toLowerCase()))
  );
}
