import {textifyUserPreferences} from './textify';
import {vectorEmbedding} from './vectorEmbedding';

export async function generateEmbeddingForUser(userPreferences, firebaseUID) {
  console.log('Generating embedding for user:', userPreferences);
  console.log('Firebase UID:', firebaseUID);
  try {
    // Generate a descriptive text from user preferences
    const textResponse = await textifyUserPreferences(userPreferences);

    // Generate the vector embedding from the descriptive text
    const vectorResponse = await vectorEmbedding(textResponse);

    // Return the embedding for the user preferences
    return {
      id: firebaseUID, // Use the Firebase UID as the unique ID
      embedding: vectorResponse.data[0].embedding,
    };
  } catch (error) {
    console.error('Error in generateEmbeddingForUser:', error);
    throw error;
  }
}
