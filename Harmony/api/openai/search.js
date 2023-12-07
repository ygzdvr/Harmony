import {Pinecone} from '@pinecone-database/pinecone';
const pinecone = new Pinecone({
  environment: 'us-west1-gcp',
  apiKey: '1eb47e0b-06bb-4b48-b1a1-152c4bedd031',
});
export async function search(textData) {
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
const pineconeIndex = pinecone.index('harmony-songs');
console.log('pineconeIndex', pineconeIndex);
const textData = 'song by INJI';
search(textData).then(async result => {
  const queryResult = await pineconeIndex.query({
    vector: result.data[0].embedding,
    topK: 5, // Fetch top 20 similar vectors
    includeMetadata: true, // Include metadata in results if available
  });
  console.log('queryResult', queryResult);
});
