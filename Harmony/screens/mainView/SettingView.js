import React, {useState, useEffect} from 'react';
import {View, ScrollView, Text, TouchableOpacity, Image} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {DB_FIREBASE, STORAGE} from '../../api/firebase/firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SettingStyles from '../../constants/styles/SettingStyles';
import {getDoc, doc} from 'firebase/firestore';
import {get} from '../../api/util/get';
import COLORS from '../../constants/colors';
import {ref, getDownloadURL} from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import {uploadBytes} from 'firebase/storage';

const SettingView = ({navigation}) => {
  const route = useRoute();
  const {onLogout} = route.params;
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [genderSnap, setGender] = useState('');
  const [modeSnap, setMode] = useState('');
  const [interestSnap, setInterest] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [userName, setUserName] = useState('');
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');

  const uploadImage = async (imageUri, path) => {
    return new Promise((resolve, reject) => {
      fetch(imageUri)
        .then(response => {
          response
            .blob()
            .then(blob => {
              const storageRef = ref(STORAGE, path);
              uploadBytes(storageRef, blob)
                .then(snapshot => {
                  getDownloadURL(storageRef)
                    .then(url => {
                      resolve(url);
                    })
                    .catch(error => {
                      reject(error);
                    });
                })
                .catch(error => {
                  reject(error);
                });
            })
            .catch(error => {
              reject(error);
            });
        })
        .catch(error => {
          reject(error);
        });
    });
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
  const uploadProfilePhoto = uri => {
    get('@user_id').then(userId => {
      const path = `profilePhotos/${userId}`;
      uploadImage(uri, path)
        .then(url => {
          setProfilePhotoUrl(url);
        })
        .catch(error => {
          console.error('Error uploading profile photo:', error);
        });
    });
  };

  const handleProfilePhotoChange = () => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    }).then(result => {
      if (!result.canceled) {
        uploadProfilePhoto(result.assets[0].uri).then(() => {
          console.log('Profile photo updated!');
        });
      }
    });
  };

  const renderGenderTile = gender => {
    const isSelected = genderSnap === gender;
    return (
      <View
        style={[SettingStyles.Tile, isSelected && SettingStyles.TileSelected]}>
        <Text
          style={[
            SettingStyles.TileText,
            isSelected && SettingStyles.TileTextSelected,
          ]}>
          {gender}
        </Text>
      </View>
    );
  };
  const renderModeTile = mode => {
    const isSelected = modeSnap === mode;
    return (
      <View
        style={[SettingStyles.Tile, isSelected && SettingStyles.TileSelected]}>
        <Text
          style={[
            SettingStyles.TileText,
            isSelected && SettingStyles.TileTextSelected,
          ]}>
          {mode}
        </Text>
      </View>
    );
  };
  const renderInterestTile = interest => {
    const isSelected = interestSnap === interest;
    return (
      <View
        style={[SettingStyles.Tile, isSelected && SettingStyles.TileSelected]}>
        <Text
          style={[
            SettingStyles.TileText,
            isSelected && SettingStyles.TileTextSelected,
          ]}>
          {interest}
        </Text>
      </View>
    );
  };
  useEffect(() => {
    const fetchUserData = async () => {
      const useruid = await get('@user_id');
      if (useruid) {
        fetchProfilePhoto(useruid);
        const users = doc(DB_FIREBASE, 'users', useruid);
        const docSnap = await getDoc(users);
        if (docSnap.exists) {
          setUserData(docSnap.data());
          const userDataSnapshot = docSnap.data();
          setName(userDataSnapshot.name);
          setEmail(userDataSnapshot.email);
          setGender(userDataSnapshot.gender);
          setMode(userDataSnapshot.mode);
          setInterest(userDataSnapshot.interest);
          setBirthMonth(userDataSnapshot.birthMonth);
          setBirthDay(userDataSnapshot.birthDay);
          setBirthYear(userDataSnapshot.birthYear);
          setUserName(userDataSnapshot.username);
        }
      } else {
        console.log('No such document!');
      }
    };
    fetchUserData();
  }, []);

  const handleLogOut = () => {
    onLogout();
  };
  return (
    <ScrollView style={SettingStyles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={SettingStyles.backButton}>
        <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
      </TouchableOpacity>
      {profilePhotoUrl && (
        <TouchableOpacity>
          <View style={SettingStyles.profilePhotoContainer}>
            <Image
              source={{uri: profilePhotoUrl}}
              style={SettingStyles.profilePhoto}
            />
          </View>
        </TouchableOpacity>
      )}

      <Text style={SettingStyles.textDescription}>Full Name</Text>

      <View style={SettingStyles.dataContainer}>
        <Text style={SettingStyles.dataText}>{name}</Text>
      </View>
      <Text style={SettingStyles.textDescription}>Displayed Username</Text>
      <View style={SettingStyles.dataContainer}>
        <Text style={SettingStyles.dataText}>{userName}</Text>
      </View>
      <Text style={SettingStyles.textDescription}>Email Used</Text>
      <View style={SettingStyles.dataContainer}>
        <Text style={SettingStyles.dataText}>{email}</Text>
      </View>
      <Text style={SettingStyles.textDescription}>Birthday</Text>
      <View style={SettingStyles.dataContainer}>
        <Text style={SettingStyles.dataText}>
          {birthMonth}/{birthDay}/{birthYear}
        </Text>
      </View>
      <Text style={SettingStyles.textDescription}>Gender</Text>
      <View style={SettingStyles.TileContainer}>
        {renderGenderTile('Man')}
        {renderGenderTile('Woman')}
        {renderGenderTile('Nonbinary')}
      </View>
      <Text style={SettingStyles.textDescription}>Selected Mode</Text>
      <View style={SettingStyles.TileContainer}>
        {renderModeTile('Date')}
        {renderModeTile('BFF')}
        {renderModeTile('Vibes')}
      </View>
      <Text style={SettingStyles.textDescription}>Selected Interest</Text>
      <View style={SettingStyles.TileContainer}>
        {renderInterestTile('Man')}
        {renderInterestTile('Woman')}
        {renderInterestTile('Everyone')}
      </View>
      <TouchableOpacity
        style={SettingStyles.logoutButton}
        onPress={handleLogOut}>
        <Text style={SettingStyles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SettingView;
