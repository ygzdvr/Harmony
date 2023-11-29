import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Image, Alert} from 'react-native';
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
  deleteField,
  arrayUnion,
  arrayRemove,
  updateDoc,
  serverTimestamp,
  runTransaction,
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
    
  };
  const renderUserPhotos = () => {
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
    if (friendRequestStatus !== 'Harmony') {
      Alert.alert(
        "Can't Send Message",
        'You need to be friends with this user to send a message.',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    } else {
      console.log('Navigate to messaging screen or handle message sending');
    }
  };

  const handleAddFriendPress = async () => {
    const currentUserUid = await get('@user_id');
    const viewedUserUid = route.params.userId;

    const currentUserRef = doc(DB_FIREBASE, 'users', currentUserUid);
    const viewedUserRef = doc(DB_FIREBASE, 'users', viewedUserUid);

    await updateDoc(currentUserRef, {tempTimestamp: serverTimestamp()});
    await updateDoc(viewedUserRef, {tempTimestamp: serverTimestamp()});

    await runTransaction(DB_FIREBASE, async transaction => {
      const currentUserDoc = await transaction.get(currentUserRef);
      const viewedUserDoc = await transaction.get(viewedUserRef);

      if (!currentUserDoc.exists() || !viewedUserDoc.exists()) {
        console.log('One of the users does not exist!');
        return;
      }
      const currentUserData = currentUserDoc.data();
      const viewedUserData = viewedUserDoc.data();

      const timestamp = currentUserData.tempTimestamp;
      if (friendRequestStatus === 'Accept Request') {
        const updatedPendingFriends = currentUserData.pendingFriends.filter(
          item => item.userId !== viewedUserUid,
        );
        const updatedRequestedFriends = viewedUserData.requestedFriends.filter(
          item => item.userId !== currentUserUid,
        );
        transaction.update(currentUserRef, {
          friends: arrayUnion({
            userId: viewedUserUid,
            timestamp: timestamp,
          }),
          pendingFriends: updatedPendingFriends,
          friendCount: currentUserData.friendCount + 1,
          tempTimestamp: deleteField(),
        });
        transaction.update(viewedUserRef, {
          friends: arrayUnion({
            userId: currentUserUid,
            timestamp: timestamp,
          }),
          requestedFriends: updatedRequestedFriends,
          friendCount: viewedUserData.friendCount + 1,
          tempTimestamp: deleteField(),
        });
        setFriendRequestStatus('Harmony');
      } else if (
        !currentUserData.friends.includes(viewedUserUid) &&
        !viewedUserData.friends.includes(currentUserUid) &&
        friendRequestStatus !== 'Harmony'
      ) {
        transaction.update(currentUserRef, {
          requestedFriends: arrayUnion({
            userId: viewedUserUid,
            timestamp: timestamp,
          }),
          tempTimestamp: deleteField(),
        });
        transaction.update(viewedUserRef, {
          pendingFriends: arrayUnion({
            userId: currentUserUid,
            timestamp: timestamp,
          }),
          tempTimestamp: deleteField(),
        });
        setFriendRequestStatus('Request Sent');
      } else if (friendRequestStatus === 'Harmony') {
        console.log('Already friends!');
      }
    });
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
      const isInArray = (array, userId) =>
        array.some(item => item.userId === userId);

      if (isInArray(currentUserData.friends, viewedUserUid)) {
        setFriendRequestStatus('Harmony');
        return 'Harmony';
      } else if (isInArray(currentUserData.pendingFriends, viewedUserUid)) {
        setFriendRequestStatus('Accept Request');
        return 'Accept Request';
      } else if (isInArray(currentUserData.requestedFriends, viewedUserUid)) {
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
