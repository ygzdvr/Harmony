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
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
} from 'firebase/firestore';
const DetailView = ({navigation}) => {
  const route = useRoute();
  const {userId, profilePhoto} = route.params;
  const [userData, setUserData] = useState(null);
  const [topSong, setTopSong] = useState('');
  const [friendRequestStatus, setFriendRequestStatus] =
    useState('Send Request');

  const handleMessagePress = () => {
    console.log('Message button pressed');
  };

  const handleAddFriendPress = () => {
    console.log('Add Friend button pressed');
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
      } else if (currentUserData.pendingFriends.includes(viewedUserUid)) {
        setFriendRequestStatus('Request Pending');
      } else if (currentUserData.requestedFriends.includes(viewedUserUid)) {
        setFriendRequestStatus('Request Sent');
      } else {
        setFriendRequestStatus('Send Request');
      }
    }
  };

  useEffect(() => {
    handleFriendRequestStatus();
  }, []);

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
            <Text style={DetailStyles.buttonText}>Message</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={DetailStyles.addFriendButton}
            onPress={handleAddFriendPress}>
            <Text style={DetailStyles.buttonText}>{friendRequestStatus}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default DetailView;
