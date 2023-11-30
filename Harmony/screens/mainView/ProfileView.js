import React, {useState, useEffect} from 'react';
import {View, Text, Image, ScrollView, TouchableOpacity} from 'react-native';
import {DB_FIREBASE} from '../../api/firebase/firebase';
import {getDoc, doc} from 'firebase/firestore';
import {get} from '../../api/util/get';
import ProfileStyles from '../../constants/styles/ProfileStyles';
import {STORAGE} from '../../api/firebase/firebase';
import {ref, getDownloadURL} from 'firebase/storage';
import GradientText from '../../components/GradientText';
import {playTrack} from '../../api/spotify/playTrack';
import {getDeviceID} from '../../api/spotify/getDeviceID';
import {LinearGradient} from 'react-native-linear-gradient';
import COLORS from '../../constants/colors';
const ProfileView = () => {
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');
  const [friendCount, setFriendCount] = useState(0);
  const [genre, setGenre] = useState('');
  const [topArtist, setTopArtist] = useState('');
  const [topSong, setTopSong] = useState('');
  const [top6Tracks, setTop6Tracks] = useState([]);

  const handlePlayTrack = async trackID => {
    const authCode = await get('@access_token');
    console.log('authCode', authCode);
    try {
      const deviceID = await getDeviceID(authCode);
      if (deviceID) {
        console.log('deviceID', deviceID);
        console.log('trackID', trackID);
        playTrack(deviceID, authCode, trackID);
      } else {
        console.error('No active device found');
      }
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  const fetchProfilePhoto = async userId => {
    const photoRef = ref(STORAGE, `profilePhotos/${userId}`);

    try {
      const url = await getDownloadURL(photoRef);
      setProfilePhotoUrl(url);
    } catch (error) {
      console.error('Error fetching profile photo:', error);
    }
  };

  const fetchTop6Tracks = async userId => {
    const userRef = doc(DB_FIREBASE, 'users', userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
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

  useEffect(() => {
    const fetchUserData = async () => {
      const useruid = await get('@user_id');
      if (useruid) {
        fetchProfilePhoto(useruid);
        fetchTop6Tracks(useruid);
        console.log('useruid', useruid);
        console.log('top6Tracks', top6Tracks);
        const users = doc(DB_FIREBASE, 'users', useruid);
        const docSnap = await getDoc(users);
        if (docSnap.exists) {
          const userDataSnapshot = docSnap.data();
          setName(userDataSnapshot.name);
          setUserName(userDataSnapshot.username);
          setGenre(userDataSnapshot.topArtistMediumTermGenres[0]);
          setTopArtist(userDataSnapshot.topArtistMediumTerm);
          setFriendCount(userDataSnapshot.friendCount);
          const topMediumTimeTrackID = userDataSnapshot.topTrackMediumTerm;
          if (topMediumTimeTrackID) {
            const songDocRef = doc(DB_FIREBASE, 'songs', topMediumTimeTrackID);
            const songDocSnap = await getDoc(songDocRef);
            if (songDocSnap.exists()) {
              setTopSong(songDocSnap.data().name);
            }
          }
        }
      } else {
        console.log('No such document!');
      }
    };
    fetchUserData();
  }, []);

  const renderTop6Tracks = () => {
    return (
      <View style={ProfileStyles.userPhotosContainer}>
        <View style={ProfileStyles.column}>
          {top6Tracks.slice(0, 3).map((track, index) => (
            <TouchableOpacity
              key={`left-${index}`}
              onPress={() => handlePlayTrack(track.trackID)}>
              <Image
                source={{uri: track.uri}}
                style={
                  index === 1
                    ? ProfileStyles.verticalRectangle
                    : ProfileStyles.square
                }
              />
              <LinearGradient
                colors={['transparent', COLORS.background]}
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}
                style={ProfileStyles.textOverlay}>
                <Text
                  style={ProfileStyles.tileTitle}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {track.name}
                </Text>
                <Text
                  style={ProfileStyles.tileSubtitle}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {track.artist} - {track.album}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        <View style={ProfileStyles.column}>
          {top6Tracks.slice(3, 6).map((track, index) => (
            <TouchableOpacity
              key={`right-${index}`}
              onPress={() => handlePlayTrack(track.trackID)}>
              <Image
                source={{uri: track.uri}}
                style={
                  index === 0
                    ? ProfileStyles.verticalRectangle
                    : ProfileStyles.square
                }
              />
              <LinearGradient
                colors={['transparent', COLORS.background]}
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}
                style={ProfileStyles.textOverlay}>
                <Text
                  style={ProfileStyles.tileTitle}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {track.name}
                </Text>
                <Text
                  style={ProfileStyles.tileSubtitle}
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
  const renderAdditionalInfo = () => {
    return (
      <View style={ProfileStyles.additionalInfoContainer}>
        <GradientText style={ProfileStyles.infoText}>
          @{userName} | {friendCount} Friends
        </GradientText>
      </View>
    );
  };
  const renderTopSection = () => {
    return (
      <View style={ProfileStyles.cardContainer}>
        {profilePhotoUrl && (
          <Image
            source={{uri: profilePhotoUrl}}
            style={ProfileStyles.profilePhoto}
          />
        )}

        <Text style={ProfileStyles.nameText}>{name}</Text>

        {renderAdditionalInfo()}

        <View style={ProfileStyles.musicPreferences}>
          <View style={ProfileStyles.musicPreferenceTile}>
            <Text style={ProfileStyles.musicPreferenceLabel}>Top Genre</Text>
            <Text style={ProfileStyles.musicPreferenceText}>{genre}</Text>
          </View>

          <View style={ProfileStyles.musicPreferenceTile}>
            <Text style={ProfileStyles.musicPreferenceLabel}>Top Artist</Text>
            <Text style={ProfileStyles.musicPreferenceText}>{topArtist}</Text>
          </View>

          <View style={ProfileStyles.musicPreferenceTile}>
            <Text style={ProfileStyles.musicPreferenceLabel}>Top Song</Text>
            <Text style={ProfileStyles.musicPreferenceText}>{topSong}</Text>
          </View>
        </View>
      </View>
    );
  };
  return (
    <ScrollView style={ProfileStyles.container}>
      {renderTopSection()}
      {renderTop6Tracks()}
    </ScrollView>
  );
};

export default ProfileView;
