import {doc, getDoc, updateDoc} from 'firebase/firestore';
import {DB_FIREBASE} from '../firebase/firebase';
import {get} from '../util/get';
export async function fetchUserVector(pineconeIndex) {
  try {
    const userId = await get('@user_id');
    console.log('fetchUserVector userId', userId);
    const fetchResult = await pineconeIndex.fetch([userId]);
    return fetchResult.records[userId]?.values;
  } catch (error) {
    console.error('Error fetching user vector:', error);
  }
}

export async function findMatchingUsers(userVector, pineconeIndex) {
  try {
    const userId = await get('@user_id');
    console.log('findMatchingUsers userId', userId);
    const queryResult = await pineconeIndex.query({
      vector: userVector,
      topK: 20, // Fetch top 20 similar vectors
      includeMetadata: true, // Include metadata in results if available
    });
    const currentUserRef = doc(DB_FIREBASE, 'users', userId);
    const currentUserDoc = await getDoc(currentUserRef);
    const currentUserData = currentUserDoc.data();
    const friendsUids =
      currentUserData.friends?.map(friend => friend.userId) || [];
    const requestedFriends =
      currentUserData.requestedFriends?.map(friend => friend.userId) || [];
    const passedMatchesUids = currentUserData.passedMatches || [];
    const currentUserGender = currentUserData.gender;
    const currentUserInterest = currentUserData.interest;

    const filteredMatches = await Promise.all(
      queryResult.matches.slice(1).map(async match => {
        if (
          !friendsUids.includes(match.id) &&
          !passedMatchesUids.includes(match.id) &&
          !requestedFriends.includes(match.id)
        ) {
          const matchRef = doc(DB_FIREBASE, 'users', match.id);
          const matchDoc = await getDoc(matchRef);
          if (matchDoc.exists()) {
            const matchData = matchDoc.data();
            if (
              matchData.gender === currentUserInterest &&
              matchData.interest === currentUserGender
            ) {
              return match.id;
            }
          }
        }
      }),
    );

    return filteredMatches.filter(match => match != null);
  } catch (error) {
    console.error('Error finding matching users:', error);
  }
}

export async function updateMatchesInFirebase(matches) {
  const userId = await get('@user_id');
  console.log('updateMatchesInFirebase userId', userId);
  const userRef = doc(DB_FIREBASE, 'users', userId);
  try {
    await updateDoc(userRef, {
      matches: matches,
    });
    console.log('Matches updated successfully');
  } catch (error) {
    console.error('Error updating matches in Firebase:', error);
  }
}
