import React, {useState, useEffect} from 'react';
import {View, Text, Image, ScrollView} from 'react-native';
import {DB_FIREBASE} from '../../api/firebase/firebase';
import {getDoc, doc} from 'firebase/firestore';
import {get} from '../../api/util/get';
import ProfileStyles from '../../constants/styles/ProfileStyles';
import {STORAGE} from '../../api/firebase/firebase';
import {ref, getDownloadURL} from 'firebase/storage';
import GradientText from '../../components/GradientText';

const ProfileView = () => {
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [friendCount, setFriendCount] = useState(0);
  const [genre, setGenre] = useState('');
  const [topArtist, setTopArtist] = useState('');
  const [topSong, setTopSong] = useState('');
  const [userPhotos, setUserPhotos] = useState([]);

  const fetchProfilePhoto = async userId => {
    const photoRef = ref(STORAGE, `profilePhotos/${userId}`);

    try {
      const url = await getDownloadURL(photoRef);
      setProfilePhotoUrl(url);
    } catch (error) {
      console.error('Error fetching profile photo:', error);
    }
  };

  const fetchUserPhotos = async userId => {
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
  useEffect(() => {
    const fetchUserData = async () => {
      const useruid = await get('@user_id');
      if (useruid) {
        fetchProfilePhoto(useruid);
        fetchUserPhotos(useruid);
        const users = doc(DB_FIREBASE, 'users', useruid);
        const docSnap = await getDoc(users);
        if (docSnap.exists) {
          const userDataSnapshot = docSnap.data();
          setName(userDataSnapshot.name);
          setUserName(userDataSnapshot.username);
          setFollowers(userDataSnapshot.followers);
          setFollowing(userDataSnapshot.following);
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
  const renderUserPhotos = () => {
    return (
      <View style={ProfileStyles.userPhotosContainer}>
        <View style={ProfileStyles.column}>
          {userPhotos.slice(0, 3).map((url, index) => (
            <Image
              key={`left-${index}`}
              source={{uri: url}}
              style={
                index === 1
                  ? ProfileStyles.verticalRectangle
                  : ProfileStyles.square
              }
            />
          ))}
        </View>

        <View style={ProfileStyles.column}>
          <Image
            source={{uri: userPhotos[3]}}
            style={ProfileStyles.verticalRectangle}
          />
          {userPhotos.slice(4, 6).map((url, index) => (
            <Image
              key={`right-${index}`}
              source={{uri: url}}
              style={ProfileStyles.square}
            />
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
      {renderUserPhotos()}
    </ScrollView>
  );
};

export default ProfileView;
