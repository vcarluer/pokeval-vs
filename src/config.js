export const config = {
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    model: "gpt-4o-mini",
    defaultModel: "gpt-4o-mini",
    maxTokens: 150,
  },
  pokemonTcg: {
    baseUrl: 'https://api.pokemontcg.io/v2',
    pageSize: 12,
    apiKey: import.meta.env.VITE_POKEMON_TCG_API_KEY,
  }
};

if (!config.openai.apiKey) {
  console.error('La clé API OpenAI n\'est pas configurée. Veuillez créer un fichier .env avec VITE_OPENAI_API_KEY');
}

if (!config.pokemonTcg.apiKey) {
  console.error('La clé API Pokemon TCG n\'est pas configurée. Veuillez créer un fichier .env avec VITE_POKEMON_TCG_API_KEY');
}
