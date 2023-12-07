import React, {useState, useEffect, useRef} from 'react';
import {
  Alert,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import Icon from 'react-native-vector-icons/Feather';
import COLORS from '../../constants/colors';
import {DB_FIREBASE} from '../../api/firebase/firebase';
import {
  doc,
  getDoc,
  arrayUnion,
  updateDoc,
  arrayRemove,
} from 'firebase/firestore';
import {get} from '../../api/util/get';
import {STORAGE} from '../../api/firebase/firebase';
import {ref, getDownloadURL} from 'firebase/storage';
import LinearGradient from 'react-native-linear-gradient';
import {Pinecone} from '@pinecone-database/pinecone';
import {
  fetchUserVector,
  findMatchingUsers,
  updateMatchesInFirebase,
} from '../../api/pinecone/userMatching';
const pinecone = new Pinecone({
  environment: 'us-west1-gcp',
  apiKey: '1eb47e0b-06bb-4b48-b1a1-152c4bedd031',
});
const MatchView = ({navigation}) => {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchMatches = async () => {
      const useruid = await get('@user_id');
      const userRef = doc(DB_FIREBASE, 'users', useruid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const {matches: matchIds} = userData;
        console.log('matchIds', matchIds);
        const matchDataPromises = matchIds.map(async matchId => {
          const matchRef = doc(DB_FIREBASE, 'users', matchId);
          const matchDoc = await getDoc(matchRef);
          if (matchDoc.exists()) {
            const profilePictureUrl = await fetchProfilePictureUrl(matchId);
            return {
              userId: matchId,
              ...matchDoc.data(),
              photoUrl: profilePictureUrl,
            };
          }
          return null;
        });
        const matchData = await Promise.all(matchDataPromises);
        setMatches(matchData.filter(match => match != null));
      }
      setIsLoading(false);
    };
    const pineconeIndex = pinecone.index('harmony-users');
    console.log('pineconeIndex', pineconeIndex);
    fetchUserVector(pineconeIndex).then(userVector => {
      if (userVector) {
        findMatchingUsers(userVector, pineconeIndex).then(matched => {
          updateMatchesInFirebase(matched).then(() => {
            fetchMatches();
          });
        });
      }
    });
  }, []);

  const fetchProfilePictureUrl = async userId => {
    const photoRef = ref(STORAGE, `profilePhotos/${userId}`);
    try {
      return await getDownloadURL(photoRef);
    } catch (error) {
      console.error('Error fetching profile photo:', error);
      return '';
    }
  };
  const handleSelectUser = user => {
    console.log('user', user);
    navigation.navigate('DetailView', {
      userId: user.userId,
      profilePhoto: user.photoUrl,
    });
  };

  const handleLeftSwipe = async cardIndex => {
    const currentUserId = await get('@user_id');
    const passedUserId = matches[cardIndex].userId;
    const currentUserRef = doc(DB_FIREBASE, 'users', currentUserId);

    // Update Firebase
    await updateDoc(currentUserRef, {
      passedMatches: arrayUnion(passedUserId),
      matches: arrayRemove(passedUserId),
    });
  };

  const handleRightSwipe = async cardIndex => {
    const currentUserId = await get('@user_id');
    const friendUserId = matches[cardIndex].userId;
    const friendUserRef = doc(DB_FIREBASE, 'users', friendUserId);
    const currentUserRef = doc(DB_FIREBASE, 'users', currentUserId);

    const currentUserDoc = await getDoc(currentUserRef);
    const friendUserDoc = await getDoc(friendUserRef);

    let isMatchMade = false;

    if (currentUserDoc.exists() && friendUserDoc.exists()) {
      const currentUserData = currentUserDoc.data();
      const viewedUserData = friendUserDoc.data();
      // Check if the friendUserId is already in the current user's requestedFriends
      if (
        currentUserData.pendingFriends.some(
          friend => friend.userId === friendUserId,
        )
      ) {
        const updatedPendingFriends = currentUserData.pendingFriends.filter(
          item => item.userId !== friendUserId,
        );
        const updatedRequestedFriends = viewedUserData.requestedFriends.filter(
          item => item.userId !== currentUserId,
        );
        // Move both users to friends
        await updateDoc(currentUserRef, {
          friends: arrayUnion({
            userId: friendUserId,
            timestamp: new Date(),
          }),
          matches: arrayRemove(friendUserId),
          pendingFriends: updatedPendingFriends,
          friendCount: currentUserData.friendCount + 1,
        });
        await updateDoc(friendUserRef, {
          friends: arrayUnion({
            userId: currentUserId,
            timestamp: new Date(),
          }),
          requestedFriends: updatedRequestedFriends,
          friendCount: viewedUserData.friendCount + 1,
        });
        isMatchMade = true;
      } else {
        // Update pending and requested friends
        await updateDoc(friendUserRef, {
          pendingFriends: arrayUnion({
            userId: currentUserId,
            timestamp: new Date(),
          }),
        });
        await updateDoc(currentUserRef, {
          requestedFriends: arrayUnion({
            userId: friendUserId,
            timestamp: new Date(),
          }),
          matches: arrayRemove(friendUserId),
        });
      }
    }
    if (isMatchMade) {
      Alert.alert('Friendship Made!', 'You and this user are now friends.', [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Matches...</Text>
      </View>
    );
  }
  if (matches.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          You have reached your limit for today, come back tomorrow!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Swiper
        ref={swiperRef}
        cards={matches}
        renderCard={card => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={1}
            onPress={() => handleSelectUser(card)} // Navigate to detail view when a card is pressed
          >
            {card.photoUrl && (
              <Image source={{uri: card.photoUrl}} style={styles.cardImage} />
            )}
            <LinearGradient
              colors={['transparent', COLORS.background]}
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1}}
              style={styles.textOverlay}>
              <Text
                style={styles.tileTitle}
                numberOfLines={1}
                ellipsizeMode="tail">
                {card.name}
              </Text>
              <Text
                style={styles.modeTitle}
                numberOfLines={1}
                ellipsizeMode="tail">
                Looking for a {card.mode}
              </Text>
              <Text
                style={styles.tileSubtitle}
                numberOfLines={1}
                ellipsizeMode="tail">
                Top Artist: {card.topArtistMediumTerm} | Top Genre:{' '}
                {card.topArtistMediumTermGenres[0]}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
        onSwipedLeft={cardIndex => handleLeftSwipe(cardIndex)}
        onSwipedRight={cardIndex => handleRightSwipe(cardIndex)}
        backgroundColor={COLORS.background}
        onSwipedAll={() => {
          setMatches([]);
        }}
        stackSize={3}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLeftSwipe}>
          <Icon name="x" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleRightSwipe}>
          <Icon name="heart" size={20} color={COLORS.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontSize: 20,
    color: COLORS.text,
    textAlign: 'center',
    fontWeight: 'bold',
    paddingHorizontal: 20,
  },
  tileSubtitle: {
    fontSize: 12,
    color: 'white',
    marginBottom: 30,
  },
  modeTitle: {
    fontSize: 12,
    color: 'white',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  card: {
    flex: 0.85,
    borderRadius: 35,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginBottom: 75,
  },
  cardImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  cardText: {
    marginBottom: 10,
    marginLeft: 10,
    fontSize: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 20,
    marginBottom: -400,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.titlePurple,
  },
  textOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    height: 100,
  },
  tileTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
});

export default MatchView;
