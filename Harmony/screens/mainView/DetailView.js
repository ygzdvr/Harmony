import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import axios from 'axios';
import COLORS from '../../constants/colors';
import DetailStyles from '../../constants/styles/DetailStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ScrollView, TouchableOpacity} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {DB_FIREBASE, STORAGE} from '../../api/firebase/firebase';
import GradientText from '../../components/GradientText';
import {get} from '../../api/util/get';
import {ref, getDownloadURL} from 'firebase/storage';
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  arrayUnion,
  arrayRemove,
  updateDoc,
} from 'firebase/firestore';
const DetailView = ({navigation}) => {
  const route = useRoute();
  const {userId, profilePhoto} = route.params;
  const [userData, setUserData] = useState(null);
  const [topSong, setTopSong] = useState('');
  const [userPhotos, setUserPhotos] = useState([]);
  const [friendRequestStatus, setFriendRequestStatus] =
    useState('Send Request');

  const fetchUserPhotos = async () => {
    console.log('fetchUserPhotos');
    const photoUrls = [];
    for (let i = 0; i < 6; i++) {
      const photoRef = ref(STORAGE, `userPhotos/${userId}/${i}`);
      try {
        const url = await getDownloadURL(photoRef);
        photoUrls.push(url);
      } catch (error) {
        console.error(`Error fetching photo ${i}:`, error);
      }
    }
    setUserPhotos(photoUrls);
    console.log('userPhotos2', userPhotos);
  };
  const renderUserPhotos = () => {
    console.log('userPhotos', userPhotos);
    return (
      <View style={DetailStyles.userPhotosContainer}>
        <View style={DetailStyles.column}>
          {userPhotos.slice(0, 3).map((url, index) => (
            <Image
              key={`left-${index}`}
              source={{uri: url}}
              style={
                index === 1
                  ? DetailStyles.verticalRectangle
                  : DetailStyles.square
              }
            />
          ))}
        </View>

        <View style={DetailStyles.column}>
          <Image
            source={{uri: userPhotos[3]}}
            style={DetailStyles.verticalRectangle}
          />
          {userPhotos.slice(4, 6).map((url, index) => (
            <Image
              key={`right-${index}`}
              source={{uri: url}}
              style={DetailStyles.square}
            />
          ))}
        </View>
      </View>
    );
  };

  const handleMessagePress = () => {
    console.log('Message button pressed');
  };

  const handleAddFriendPress = async () => {
    const currentUserUid = await get('@user_id');
    const viewedUserUid = route.params.userId;

    const currentUserRef = doc(DB_FIREBASE, 'users', currentUserUid);
    const viewedUserRef = doc(DB_FIREBASE, 'users', viewedUserUid);

    const currentUserDoc = await getDoc(currentUserRef);
    const viewedUserDoc = await getDoc(viewedUserRef);

    if (currentUserDoc.exists() && viewedUserDoc.exists()) {
      const currentUserData = currentUserDoc.data();
      const viewedUserData = viewedUserDoc.data();

      if (friendRequestStatus === 'Accept Request') {
        // Accept the friend request
        await updateDoc(currentUserRef, {
          friends: arrayUnion(viewedUserUid),
          pendingFriends: arrayRemove(viewedUserUid),
        });
        await updateDoc(viewedUserRef, {
          friends: arrayUnion(currentUserUid),
          requestedFriends: arrayRemove(currentUserUid),
        });
        setFriendRequestStatus('Harmony');
      } else if (!currentUserData.friends.includes(viewedUserUid)) {
        // Send a new friend request
        await updateDoc(currentUserRef, {
          requestedFriends: arrayUnion(viewedUserUid),
        });
        await updateDoc(viewedUserRef, {
          pendingFriends: arrayUnion(currentUserUid),
        });
        setFriendRequestStatus('Request Sent');
      }
    }
  };

  const handleFriendRequestStatus = async () => {
    const currentUserUid = await get('@user_id');
    const viewedUserUid = route.params.userId;
    const currentUserDoc = await getDoc(
      doc(DB_FIREBASE, 'users', currentUserUid),
    );
    const viewedUserDoc = await getDoc(
      doc(DB_FIREBASE, 'users', viewedUserUid),
    );
    if (currentUserDoc.exists() && viewedUserDoc.exists()) {
      const currentUserData = currentUserDoc.data();
      const viewedUserData = viewedUserDoc.data();
      if (currentUserData.friends.includes(viewedUserUid)) {
        setFriendRequestStatus('Harmony');
        return 'Harmony';
      } else if (currentUserData.pendingFriends.includes(viewedUserUid)) {
        setFriendRequestStatus('Accept Request');
        return 'Accept Request';
      } else if (currentUserData.requestedFriends.includes(viewedUserUid)) {
        setFriendRequestStatus('Request Sent');
        return 'Request Sent';
      } else {
        setFriendRequestStatus('Send Request');
        return 'Send Request';
      }
    }
  };

  useEffect(() => {
    handleFriendRequestStatus().then(status => {
      setFriendRequestStatus(status);
      if (status === 'Harmony') {
        fetchUserPhotos();
      }
    });
  }, [userId]);

  useEffect(() => {
    const fetchUserData = async () => {
      const userRef = doc(DB_FIREBASE, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserData(userSnap.data());
        const topMediumTimeTrackID = userSnap.data().topTrackMediumTerm;
        if (topMediumTimeTrackID) {
          const songDocRef = doc(DB_FIREBASE, 'songs', topMediumTimeTrackID);
          const songDocSnap = await getDoc(songDocRef);
          if (songDocSnap.exists()) {
            setTopSong(songDocSnap.data().name);
          }
        }
      } else {
        console.log('No such user!');
      }
    };

    fetchUserData();
  }, [userId]);

  if (!userData) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={DetailStyles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={DetailStyles.backButton}>
        <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
      </TouchableOpacity>
      <View style={DetailStyles.cardContainer}>
        <Image source={{uri: profilePhoto}} style={DetailStyles.profilePhoto} />
        <Text style={DetailStyles.nameText}>{userData.name}</Text>
        <View style={DetailStyles.additionalInfoContainer}>
          <GradientText style={DetailStyles.infoText}>
            @{userData.username} | {userData.friendCount} Friends
          </GradientText>
        </View>
        <View style={DetailStyles.musicPreferences}>
          <View style={DetailStyles.musicPreferenceTile}>
            <Text style={DetailStyles.musicPreferenceLabel}>Top Genre</Text>
            <Text style={DetailStyles.musicPreferenceText}>
              {userData.topArtistMediumTermGenres[0]}
            </Text>
          </View>

          <View style={DetailStyles.musicPreferenceTile}>
            <Text style={DetailStyles.musicPreferenceLabel}>Top Artist</Text>
            <Text style={DetailStyles.musicPreferenceText}>
              {userData.topArtistMediumTerm}
            </Text>
          </View>

          <View style={DetailStyles.musicPreferenceTile}>
            <Text style={DetailStyles.musicPreferenceLabel}>Top Song</Text>
            <Text style={DetailStyles.musicPreferenceText}>{topSong}</Text>
          </View>
        </View>
        <View style={DetailStyles.buttonContainer}>
          <TouchableOpacity
            style={DetailStyles.messageButton}
            onPress={handleMessagePress}>
            <Text style={DetailStyles.buttonTextWhite}>Message</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={DetailStyles.addFriendButton}
            onPress={handleAddFriendPress}>
            <Text style={DetailStyles.buttonText}>{friendRequestStatus}</Text>
          </TouchableOpacity>
        </View>
      </View>
      {friendRequestStatus === 'Harmony' && renderUserPhotos()}
    </ScrollView>
  );
};

export default DetailView;
