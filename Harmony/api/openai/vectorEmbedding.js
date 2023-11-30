export async function vectorEmbedding(textData) {
  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization:
          'Bearer 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',
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: textData,
      }),
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error('this is the result', error);
  }
}
