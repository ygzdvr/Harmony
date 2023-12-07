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
import {playTrack} from '../../api/spotify/playTrack';
import {getDeviceID} from '../../api/spotify/getDeviceID';
import {LinearGradient} from 'react-native-linear-gradient';
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
  const {userId, profilePhoto, authCode} = route.params;
  const [userData, setUserData] = useState(null);
  const [topSong, setTopSong] = useState('');
  const [top6Tracks, setTop6Tracks] = useState([]);
  const [friendRequestStatus, setFriendRequestStatus] =
    useState('Send Request');

  const fetchTop6Tracks = async () => {
    const userRef = doc(DB_FIREBASE, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const trackIds = userData.top6TracksShortTerm || [];
      setTop6Tracks(
        trackIds.map(trackId => ({
          uri: trackId.albumImage,
          trackID: trackId.id,
          name: trackId.name,
          artist: trackId.artist,
          album: trackId.album,
        })),
      );
    }
  };
  const handlePlayTrack = async trackID => {
    try {
      const deviceID = await getDeviceID(authCode);
      if (deviceID) {
        playTrack(deviceID, authCode, trackID);
      } else {
        console.error('No active device found');
      }
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  const renderTop6Tracks = () => {
    console.log('Rendering top 6 tracks');
    return (
      <View style={DetailStyles.userPhotosContainer}>
        <View style={DetailStyles.column}>
          {top6Tracks.slice(0, 3).map((track, index) => (
            <TouchableOpacity
              key={`left-${index}`}
              onPress={() => handlePlayTrack(track.trackID)}>
              <Image
                source={{uri: track.uri}}
                style={
                  index === 1
                    ? DetailStyles.verticalRectangle
                    : DetailStyles.square
                }
              />
              <LinearGradient
                colors={['transparent', COLORS.background]}
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}
                style={DetailStyles.textOverlay}>
                <Text
                  style={DetailStyles.tileTitle}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {track.name}
                </Text>
                <Text
                  style={DetailStyles.tileSubtitle}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {track.artist} - {track.album}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        <View style={DetailStyles.column}>
          {top6Tracks.slice(3, 6).map((track, index) => (
            <TouchableOpacity
              key={`right-${index}`}
              onPress={() => handlePlayTrack(track.trackID)}>
              <Image
                source={{uri: track.uri}}
                style={
                  index === 0
                    ? DetailStyles.verticalRectangle
                    : DetailStyles.square
                }
              />
              <LinearGradient
                colors={['transparent', COLORS.background]}
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}
                style={DetailStyles.textOverlay}>
                <Text
                  style={DetailStyles.tileTitle}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {track.name}
                </Text>
                <Text
                  style={DetailStyles.tileSubtitle}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {track.artist} - {track.album}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const handleMessagePress = async () => {
    const currentUserUid = await get('@user_id');
    const viewedUserUid = route.params.userId;
    if (friendRequestStatus !== 'Message') {
      Alert.alert(
        "Can't run Harmony!",
        'You need to be friends with this user to check your harmony.',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    } else {
      console.log('Navigate to messaging screen or handle message sending');
      navigation.navigate('BlendView', {
        userId1: currentUserUid,
        userId2: viewedUserUid,
        authCode: authCode,
      });
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
        setFriendRequestStatus('Message');
      } else if (
        !currentUserData.friends.includes(viewedUserUid) &&
        !viewedUserData.friends.includes(currentUserUid) &&
        friendRequestStatus !== 'Message'
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
      } else if (friendRequestStatus === 'Message') {
        console.log('Message!');
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
        setFriendRequestStatus('Message');
        return 'Message';
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
      if (status === 'Message') {
        fetchTop6Tracks();
      }
    });
  }, [userId]);

  useEffect(() => {
    const fetchUserData = async () => {
      const userRef = doc(DB_FIREBASE, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserData(userSnap.data());
        fetchTop6Tracks();
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
            <Text style={DetailStyles.buttonTextWhite}>Harmony</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={DetailStyles.addFriendButton}
            onPress={handleAddFriendPress}>
            <Text style={DetailStyles.buttonText}>{friendRequestStatus}</Text>
          </TouchableOpacity>
        </View>
      </View>
      {friendRequestStatus === 'Message' && renderTop6Tracks()}
    </ScrollView>
  );
};

export default DetailView;
