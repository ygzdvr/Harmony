import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import COLORS from '../../constants/colors';
import SignupStyles from '../../constants/styles/SignupStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Progress from 'react-native-progress';

import {ResponseType, useAuthRequest} from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRoute} from '@react-navigation/native';

import PhoneNumberInput from '../../partials/authentication/signup/Phone';
import PhoneVerificationInput from '../../partials/authentication/signup/PhoneVerification';
import Notifications from '../../partials/authentication/signup/Notifications';
import LocationServices from '../../partials/authentication/signup/Location';
import Tracking from '../../partials/authentication/signup/Tracking';
import NameInput from '../../partials/authentication/signup/Name';
import UsernameInput from '../../partials/authentication/signup/Username';
import PasswordInput from '../../partials/authentication/signup/Password';
import EmailInput from '../../partials/authentication/signup/Email';
import ProfilePhotoInput from '../../partials/authentication/signup/ProfilePhoto';
import PhotosInput from '../../partials/authentication/signup/Photos';
import GenderInput from '../../partials/authentication/signup/Gender';
import BirthdayInput from '../../partials/authentication/signup/Birthday';
import ModeInput from '../../partials/authentication/signup/Modes';
import InterestedInput from '../../partials/authentication/signup/Interested';
import Spotify from '../../partials/authentication/signup/Spotify';

import {SPOTIFY} from '../../api/spotify/SPOTIFY';
import {SONGS} from '../../api/spotify/SONGS';
import {TOP} from '../../api/spotify/TOP';
import {put} from '../../api/util/put';
import {get} from '../../api/util/get';
import {textify} from '../../api/openai/textify';
import {vectorEmbedding} from '../../api/openai/vectorEmbedding';
import {
  APP_FIREBASE,
  AUTH_FIREBASE,
  DB_FIREBASE,
  STORAGE,
} from '../../api/firebase/firebase';
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import {
  collection,
  query,
  getDocs,
  setDoc,
  doc,
  where,
} from 'firebase/firestore';

const SignupView = ({navigation}) => {
  const route = useRoute();
  const {onSignUp} = route.params;
  const [step, setStep] = useState(1);
  // States for form data
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verifyPhone, setVerifyPhone] = useState(''); // [TODO

  const [verificationCode, setVerificationCode] = useState('');
  const [verifyCode, setVerifyCode] = useState(''); // [TODO

  const [name, setName] = useState('');
  const [verifyName, setVerifyName] = useState(''); // [TODO

  const [username, setUsername] = useState('');
  const [verifyUsername, setVerifyUsername] = useState(''); // [TODO

  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState(''); // [TODO

  const [email, setEmail] = useState('');
  const [verifyEmail, setVerifyEmail] = useState(''); // [TODO

  const [gender, setGender] = useState('');
  const [verifyGender, setVerifyGender] = useState(''); // [TODO

  const [birthMonth, setBirthMonth] = useState('');
  const [verifyMonth, setVerifyMonth] = useState('');

  const [birthDay, setBirthDay] = useState('');
  const [verifyDay, setVerifyDay] = useState('');

  const [birthYear, setBirthYear] = useState('');
  const [verifyYear, setVerifyYear] = useState('');

  const [mode, setMode] = useState('');
  const [verifyMode, setVerifyMode] = useState('');

  const [interest, setInterest] = useState('');
  const [verifyInterest, setVerifyInterest] = useState('');

  const [access_token, setAccessToken] = useState('');
  const [refresh_token, setRefreshToken] = useState('');
  const [expirationToken, setExpirationToken] = useState('');

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photos, setPhotos] = useState(Array(6).fill(null));

  const auth = AUTH_FIREBASE;
  const checkUserExists = async (field, value) => {
    const querySnapshot = await getDocs(
      query(collection(DB_FIREBASE, 'users'), where(field, '==', value)),
    );
    return !querySnapshot.empty;
  };
  const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
  };
  const uploadImage = async (imageUri, path) => {
    console.log('uploadImage');
    await fetch(imageUri).then(response => {
      console.log('response');
      console.log(response);
      response.blob().then(blob => {
        console.log('blob');
        console.log(blob);
        const storage = STORAGE;
        const storageRef = ref(storage, path);
        console.log('storageRef');
        console.log(storageRef);

        uploadBytes(storageRef, blob).then(snapshot => {
          console.log('Uploaded a blob or file!');
          getDownloadURL(storageRef).then(url => {
            console.log('url');
            console.log(url);
            return url;
          });
        });
      });
    });
  };
  const SignupHandle = async topInfo => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async userCredential => {
        const user = userCredential.user;
        console.log('Registered with: ', user.email);
        await DatabaseHandle(user.uid, topInfo);
        put('@user_id', user.uid);
        onSignUp();
      })
      .catch(error => {
        console.log('Error:', error);
      });
  };
  const DatabaseHandle = async (userID, topInfo) => {
    console.log('DatabaseHandle');
    uploadImage(profilePhoto, `profilePhotos/${userID}`).then(url => {
      console.log('url');
      console.log(url);
      Promise.all(
        photos.map((photo, index) =>
          photo
            ? uploadImage(photo, `userPhotos/${userID}/${index}`)
            : Promise.resolve(null),
        ),
      ).then(photoUrls => {
        console.log('photoUrls');
        console.log(photoUrls);
        setDoc(doc(DB_FIREBASE, 'users', userID), {
          name: name,
          username: username,
          email: email,
          password: password,
          gender: gender,
          birthMonth: birthMonth,
          birthDay: birthDay,
          birthYear: birthYear,
          mode: mode,
          interest: interest,
          campus: 'Princeton University',
          location: 'Princeton, NJ',
          featuredSongs: ['QonWn5I4gVDZmCKuTj3N', 'wMUEDAuGCurP1Hkz6Ita'],
          topArtistShortTerm: topInfo.topArtistShortTerm.name,
          topArtistShortTermGenres: topInfo.topArtistShortTerm.genres,
          topArtistMediumTerm: topInfo.topArtistMediumTerm.name,
          topArtistMediumTermGenres: topInfo.topArtistMediumTerm.genres,
          topArtistLongTerm: topInfo.topArtistLongTerm.name,
          topArtistLongTermGenres: topInfo.topArtistLongTerm.genres,
          topTrackShortTerm: topInfo.topTrackShortTerm,
          topTrackMediumTerm: topInfo.topTrackMediumTerm,
          topTrackLongTerm: topInfo.topTrackLongTerm,
          mostRecentlyPlayedSong: topInfo.mostRecentlyPlayedSong,
          recentlyPlayedSongs: topInfo.recentlyPlayedSongs,
          followers: 0,
          following: 0,
          friendCount: 0,
          friends: [],
          pendingFriends: [],
          requestedFriends: [],
          access_token: access_token,
          refresh_token: refresh_token,
          expirationToken: expirationToken,
        }).then(() => {
          console.log('Document successfully written!');
        });
      });
    });
  };

  const SongsDatabase = async extractedSongs => {
    console.log('SongsDatabase');
    console.log('extractedSongs', extractedSongs);
    //const songsRef = collection(DB_FIREBASE, 'songs');
    //extractedSongs.forEach(async song => {
    //  if (song.trackID) {
    //    await setDoc(doc(songsRef, song.trackID), song);
    //  }
    //});
  };

  const getToken = async authCode => {
    try {
      const credsB64 =
        'MDBhNjdjYTM2OWQyNGE3ZWJiZGQwMWVhMmY0YWU0Zjg6YTgwMjAxZDVlZDcwNDk0MDk0YTkwNzU2ZjZmOGNjNTI=';
      const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credsB64}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=authorization_code&code=${authCode}&redirect_uri=exp://127.0.0.1:19000/`,
      });
      if (!res.ok) {
        console.log('ERROR');
      } else {
        const resJson = await res.json();
        const {
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_in: expiresIn,
        } = resJson;
        const expTime = new Date().getTime() + expiresIn * 1000;
        await put('@access_token', accessToken);
        console.log('accessToken');
        console.log(accessToken);
        setAccessToken(accessToken);
        await put('@refresh_token', refreshToken);
        console.log('refreshToken');
        console.log(refreshToken);
        setRefreshToken(refreshToken);
        await put('@expirationToken', expTime.toString());
        console.log('expTime');
        console.log(expTime);
        setExpirationToken(expTime.toString());
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [request, response, promptAsync] = useAuthRequest(
    {
      usePKCE: false,
      clientId: '00a67ca369d24a7ebbdd01ea2f4ae4f8',
      clientSecret: 'a80201d5ed70494094a90756f6f8cc52',
      scopes: [
        'user-top-read',
        'user-library-read',
        'user-read-playback-position',
        'playlist-read-private',
        'user-read-currently-playing',
        'user-read-recently-played',
        'user-read-playback-state',
        'user-modify-playback-state',
        'streaming',
        'user-read-email',
        'user-read-private',
      ],
      redirectUri: 'exp://127.0.0.1:19000/',
    },
    discovery,
  );
  useEffect(() => {
    if (response?.type === 'success') {
      const {code} = response.params;
      console.log('code', code);
      getToken(code).then(() => {
        console.log('getToken finished');
        get('@access_token').then(data1 => {
          console.log('data', data1);
          setAccessToken(data1);
          token = data1;
          try {
            SPOTIFY(token).then(data => {
              console.log('SONGS handle');
              SONGS(token).then(data2 => {
                SongsDatabase(data2).then(() => {
                  TOP(token).then(data3 => {
                    console.log('TOP handle');
                    console.log('data3', data3);
                    console.log('SONGS handle finished');
                    console.log('signup handle');
                    SignupHandle(data3);
                    console.log('signup handle finished');
                    // textify(data).then(textResponse => {
                    //   console.log('textResponse', textResponse);
                    //   vectorEmbedding(textResponse).then(vectorResponse => {
                    //     console.log('vectorResponse', vectorResponse);
                    //   });
                    // });
                    console.log('TOP handle finished');
                  });
                });
              });
            });
          } catch (err) {
            console.log(err);
          }
        });
      });
    }
  }, [response]);

  const totalSteps = 16;
  const progress = step / totalSteps;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <PhoneNumberInput
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            verifyPhone={verifyPhone}
          />
        );
      case 2:
        return (
          <PhoneVerificationInput
            phoneNumber={phoneNumber}
            verificationCode={verificationCode}
            setVerificationCode={setVerificationCode}
            verifyCode={verifyCode}
          />
        );
      case 3:
        return <Notifications />;
      case 4:
        return <LocationServices />;
      case 5:
        return <Tracking />;
      case 6:
        return (
          <NameInput name={name} setName={setName} verifyName={verifyName} />
        );
      case 7:
        return (
          <UsernameInput
            username={username}
            setUsername={setUsername}
            verifyUsername={verifyUsername}
          />
        );
      case 8:
        return (
          <PasswordInput
            password={password}
            setPassword={setPassword}
            verifyPassword={verifyPassword}
          />
        );
      case 9:
        return (
          <EmailInput
            email={email}
            setEmail={setEmail}
            verifyEmail={verifyEmail}
          />
        );
      case 10:
        return (
          <ProfilePhotoInput
            profilePhoto={profilePhoto}
            setProfilePhoto={setProfilePhoto}
          />
        );
      case 11:
        return <PhotosInput photos={photos} setPhotos={setPhotos} />;
      case 12:
        return (
          <BirthdayInput
            birthMonth={birthMonth}
            setBirthMonth={setBirthMonth}
            birthDay={birthDay}
            setBirthDay={setBirthDay}
            birthYear={birthYear}
            setBirthYear={setBirthYear}
            verifyMonth={verifyMonth}
            verifyDay={verifyDay}
            verifyYear={verifyYear}
          />
        );
      case 13:
        return (
          <GenderInput
            gender={gender}
            setGender={setGender}
            verifyGender={verifyGender}
          />
        );

      case 14:
        return (
          <ModeInput mode={mode} setMode={setMode} verifyMode={verifyMode} />
        );

      case 15:
        return (
          <InterestedInput
            interest={interest}
            setInterest={setInterest}
            verifyInterest={verifyInterest}
          />
        );
      case 16:
        return <Spotify />;
      default:
        return null;
    }
  };
  const isValidEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = () => {
    return password.length >= 8;
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        return phoneNumber.trim() !== ''; // Validate phone number
      case 2:
        return verificationCode.trim() !== ''; // Validate verification code
      case 3:
        return true; // No validation for other steps by default
      case 4:
        return true; // No validation for other steps by default
      case 5:
        return true; // No validation for other steps by default
      case 6:
        return name.trim() !== ''; // Validate name
      case 7:
        return username.trim() !== ''; // Validate username
      case 8:
        return password.trim() !== '' && isValidPassword(); // Validate password
      case 9:
        return email.trim() !== '' && isValidEmail(); // Validate email
      case 10:
        return profilePhoto !== null;
      case 11:
        return photos.every(photo => photo !== null);
      case 12:
        return (
          birthDay.trim() !== '' &&
          birthMonth.trim() !== '' &&
          birthYear.trim() !== ''
        ); // Validate birthday
      case 13:
        return gender.trim() !== '';
      case 14:
        return mode.trim() !== '';
      case 15:
        return interest.trim() !== '';
      case 16:
        return true;

      default:
        return true; // No validation for other steps by default
    }
  };

  const handleContinue = async () => {
    if (validateStep()) {
      let exists = false;
      if (step < totalSteps) {
        switch (step) {
          case 1:
            setVerifyPhone('');
            break;
          case 2:
            setVerifyCode('');
            break;
          case 3:
            break;
          case 4:
            break;
          case 5:
            break;
          case 6:
            setVerifyName('');
            break;
          case 7:
            exists = await checkUserExists('username', username);
            if (exists) {
              setVerifyUsername('Username already exists.');
              return;
            }
            setVerifyUsername('');
            break;
          case 8:
            setVerifyPassword('');
            break;
          case 9:
            exists = await checkUserExists('email', email);
            if (exists) {
              setVerifyEmail('Email already exists.');
              return;
            }
            setVerifyEmail('');
            break;
          case 10:
            break;
          case 11:
            break;
          case 12:
            setVerifyMonth('');
            setVerifyDay('');
            setVerifyYear('');
            break;
          case 13:
            setVerifyGender('');
            break;
          case 14:
            setVerifyMode('');
            break;
          case 15:
            setVerifyInterest('');
            break;
          case 16:
            break;
          default:
            break;
        }
        setStep(prevStep => prevStep + 1);
      } else {
        promptAsync();
      }
    } else {
      // Display an error message or handle it as you prefer
      switch (step) {
        case 1:
          setVerifyPhone('Please enter a valid phone number.');
          break;
        case 2:
          setVerifyCode('Please enter a valid verification code.');
          break;
        case 3:
          break;
        case 4:
          break;
        case 5:
          break;
        case 6:
          setVerifyName('Please enter a valid name.');
          break;
        case 7:
          setVerifyUsername('Please enter a valid username.');
          break;
        case 8:
          setVerifyPassword(
            'Please enter a valid password of at least 8 characters.',
          );
          break;
        case 9:
          setVerifyEmail('Please enter a valid email.');
          break;
        case 10:
          Alert.alert(
            'Profile photo required',
            'Please select a profile photo to continue.',
          );
          break;
        case 11:
          Alert.alert(
            'Photos required',
            'Please upload all six photos to continue.',
          );
          break;
        case 12:
          setVerifyMonth('Please enter a valid month.');
          setVerifyDay('Please enter a valid day.');
          setVerifyYear('Please enter a valid year.');
          break;
        case 13:
          setVerifyGender('Please select one of the options.');
          break;
        case 14:
          setVerifyMode('Please select one of the options.');
          break;
        case 15:
          setVerifyInterest('Please select one of the options.');
          break;
        case 16:
          break;
        default:
          break;
      }
    }
  };
  return (
    <View style={SignupStyles.container}>
      <View style={SignupStyles.progressContainer}>
        <Progress.Bar
          progress={progress}
          width={null}
          borderWidth={0}
          unfilledColor={COLORS.secondary}
          color={COLORS.primary}
          borderRadius={2}
          height={7}
        />
      </View>
      {step > 1 && (
        <TouchableOpacity
          onPress={() => setStep(prevStep => prevStep - 1)}
          style={SignupStyles.backButton}>
          <Ionicons name="chevron-back" size={20} color={COLORS.background} />
        </TouchableOpacity>
      )}
      {step < 2 && (
        <TouchableOpacity
          onPress={() => navigation.navigate('WelcomeView')}
          style={SignupStyles.backButton}>
          <Ionicons name="chevron-back" size={20} color={COLORS.background} />
        </TouchableOpacity>
      )}
      {renderStep()}
      <View style={SignupStyles.inputContainer}>
        <TouchableOpacity
          style={
            step === totalSteps
              ? SignupStyles.finishButton
              : SignupStyles.continueButton
          }
          onPress={handleContinue}>
          <Text
            style={
              step === totalSteps
                ? SignupStyles.finishText
                : SignupStyles.continueText
            }>
            {step === totalSteps ? 'Connect & Finish' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignupView;
