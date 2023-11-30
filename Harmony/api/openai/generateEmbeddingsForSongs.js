import axios from 'axios';
import {textifySongs} from './textify';
import {vectorEmbedding} from './vectorEmbedding';
import {Pinecone} from '@pinecone-database/pinecone';
export async function generateEmbeddingsForSongs(songs) {
  const pinecone = new Pinecone({
    environment: 'us-west1-gcp',
    apiKey: '1eb47e0b-06bb-4b48-b1a1-152c4bedd031',
  });
  const index = pinecone.index('harmony-songs');
  const embeddings = [];
  for (const song of songs) {
    try {
      console.log('checking if song exists in index', song.trackID);
      const fetchResult = await index.fetch([song.trackID]);
      console.log('checkcomplete');
      console.log('this is the fetch result', fetchResult);
      if (fetchResult.records[song.trackID]) {
        // Song already exists in the index, skip to the next one
        console.log(`Song with ID ${song.trackID} already exists. Skipping.`);
        continue;
      } else {
        console.log('song does not exist in index');
        const textResponse = await textifySongs(song);
        const vectorResponse = await vectorEmbedding(textResponse);
        embeddings.push({
          id: song.trackID,
          embedding: vectorResponse.data[0].embedding,
        });
      }
    } catch (error) {
      console.error('Error generating embedding for song:', error);
    }
  }
  return embeddings;
}
