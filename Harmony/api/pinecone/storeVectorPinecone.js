import {Pinecone} from '@pinecone-database/pinecone';

export async function storeVectorPinecone(songData) {
  try {
    const pinecone = new Pinecone({
      environment: 'gcp-starter',
      apiKey: ' ',
    });

    const index = pinecone.index('songs-harmony');
    const record = {
      id: songData.id,
      values: songData.embedding,
    };
    await index.upsert([record]);
    console.log('Successfully stored the vector data in Pinecone index');
  } catch (error) {
    console.error('Error storing vector data in Pinecone:', error);
  }
}
