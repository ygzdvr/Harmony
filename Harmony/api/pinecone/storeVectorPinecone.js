import {Pinecone} from '@pinecone-database/pinecone';

export async function storeVectorPinecone(songsData) {
  console.log('this is the songs data', songsData);
  try {
    const pinecone = new Pinecone({
      environment: 'us-west1-gcp',
      apiKey: '1eb47e0b-06bb-4b48-b1a1-152c4bedd031',
    });
    const index = pinecone.index('harmony-songs');

    const upsertLimit = 100;

    for (let i = 0; i < songsData.length; i += upsertLimit) {
      // Create batches of songs for upsert
      const batch = songsData.slice(i, i + upsertLimit).map(song => ({
        id: song.id,
        values: song.embedding,
      }));

      // Upsert the batch into the index
      await index.upsert(batch);
      console.log(
        `Successfully stored a batch of ${batch.length} songs in Pinecone index`,
      );
    }
  } catch (error) {
    console.error('Error storing vector data in Pinecone:', error);
  }
}
