import {Pinecone} from '@pinecone-database/pinecone';

export async function storeUserVectorPinecone(userData) {
  console.log('Storing user data in Pinecone:', userData);
  try {
    const pinecone = new Pinecone({
      environment: 'us-west1-gcp',
      apiKey: '1eb47e0b-06bb-4b48-b1a1-152c4bedd031',
    });
    const index = pinecone.index('harmony-users');

    // Since we are dealing with single user data, we don't need a loop or batch processing
    await index.upsert([
      {
        id: userData.id,
        values: userData.embedding,
      },
    ]);
    console.log(
      `Successfully stored user data in Pinecone index for user ID: ${userData.id}`,
    );
  } catch (error) {
    console.error('Error storing user vector data in Pinecone:', error);
  }
}
