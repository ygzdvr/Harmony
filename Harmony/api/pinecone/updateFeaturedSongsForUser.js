import {Pinecone} from '@pinecone-database/pinecone';
import {doc, updateDoc} from 'firebase/firestore';
import {DB_FIREBASE} from '../firebase/firebase';

export async function updateFeaturedSongsForUser(firebaseUID) {
  console.log(`Updating featured songs for user ${firebaseUID}`);
  try {
    const pinecone = new Pinecone({
      environment: 'us-west1-gcp',
      apiKey: '1eb47e0b-06bb-4b48-b1a1-152c4bedd031',
    });
    const userIndex = pinecone.index('harmony-users');
    const songIndex = pinecone.index('harmony-songs');

    // Fetch the user's vector embedding
    const userEmbedding = await userIndex.fetch([firebaseUID]);
    if (!userEmbedding.records[firebaseUID]) {
      console.log(`No vector found for user with ID ${firebaseUID}`);
      return false;
    }

    // Query the song index using the user's vector
    const queryResult = await songIndex.query({
      vector: userEmbedding.records[firebaseUID].values,
      topK: 10,
    });
    console.log('Found matches');
    console.log(queryResult);

    // Extract song IDs from the query result
    const featuredSongIDs = queryResult.matches.map(match => match.id);
    console.log('Featured song IDs:');
    console.log(featuredSongIDs);

    // Update the Firebase database
    const userRef = doc(DB_FIREBASE, 'users', firebaseUID);
    await updateDoc(userRef, {
      featuredSongs: featuredSongIDs,
    });

    console.log(`Updated featured songs for user ${firebaseUID}`);
    return true;
  } catch (error) {
    console.error('Error updating featured songs:', error);
  }
}
