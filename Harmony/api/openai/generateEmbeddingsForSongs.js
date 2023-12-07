import axios from 'axios';
import {textifySongs} from './textify';
import {vectorEmbedding} from './vectorEmbedding';
import {Pinecone} from '@pinecone-database/pinecone';

async function processSong(song, index) {
  const fetchResult = await index.fetch([song.trackID]);
  if (fetchResult.records[song.trackID]) {
    console.log(`Song with ID ${song.trackID} already exists. Skipping.`);
    return null;
  }

  const textResponse = await textifySongs(song);
  const vectorResponse = await vectorEmbedding(textResponse);
  return {
    id: song.trackID,
    embedding: vectorResponse.data[0].embedding,
  };
}

export async function generateEmbeddingsForSongs(songs, index) {
  try {
    const songPromises = songs.map(song => processSong(song, index));
    const results = await Promise.all(songPromises);
    return results.filter(result => result !== null);
  } catch (error) {
    console.error('Error in generateEmbeddingsForSongs:', error);
    throw error;
  }
}
