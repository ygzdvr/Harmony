import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {useRoute} from '@react-navigation/native';
import COLORS from '../../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LoginStyles from '../../constants/styles/LoginStyles';
import {AUTH_FIREBASE} from '../../api/firebase/firebase';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {put} from '../../api/util/put';
import {DB_FIREBASE} from '../../api/firebase/firebase';
import {
  collection,
  query,
  getDocs,
  orderBy,
  limit,
  setDoc,
  doc,
} from 'firebase/firestore';

const updatePopularSongs = async () => {
  try {
    // Define the songs collection reference
    const songsRef = collection(DB_FIREBASE, 'songs');

    // Create a query to fetch top 10 popular songs
    const q = query(songsRef, orderBy('popularity', 'desc'), limit(10));

    // Fetch the songs
    const querySnapshot = await getDocs(q);
    const popularSongs = [];

    // Iterate over each song and prepare the data for popularSongs collection
    querySnapshot.forEach(doc => {
      popularSongs.push({id: doc.id, ...doc.data()});
    });

    // Add each song to the popularSongs collection
    for (const song of popularSongs) {
      await setDoc(doc(DB_FIREBASE, 'popularSongs', song.id), song);
    }

    console.log('Popular songs updated successfully');
  } catch (error) {
    console.error('Error updating popular songs:', error);
  }
};
const LoginView = ({navigation}) => {
  const route = useRoute();
  const {onSignIn} = route.params;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const auth = AUTH_FIREBASE;
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user;
        // Navigate to the HomeView or another screen as needed
        put('@user_id', user.uid);
        onSignIn();
        updatePopularSongs();
        navigation.navigate('HomeView');
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // Handle errors here, for example, show an alert
        Alert.alert('Failed to Log In', 'Please try again or Sign Up.');
      });
  };

  return (
    <View style={LoginStyles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={LoginStyles.backButton}>
        <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
      </TouchableOpacity>

      <Text style={LoginStyles.welcomeBack}>Welcome back!</Text>
      <Text style={LoginStyles.welcomeText}>
        It's great to see you again! Your next musical adventure awaits!
      </Text>
      <View style={LoginStyles.inputContainer}>
        <Text style={LoginStyles.inputLabel}>Email</Text>
        <TextInput
          style={LoginStyles.textInput}
          placeholder="Enter your email"
          placeholderTextColor={COLORS.background}
          keyboardType="email-address"
          textContentType="emailAddress"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={LoginStyles.inputLabel}>Password</Text>
        <TextInput
          style={LoginStyles.textInput}
          placeholder="Enter your password"
          placeholderTextColor={COLORS.background}
          secureTextEntry={true}
          textContentType="password"
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity style={LoginStyles.signInButton} onPress={handleLogin}>
        <Text style={LoginStyles.signInText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={LoginStyles.signUpButton}
        onPress={() => navigation.navigate('SignupView')}>
        <Text style={LoginStyles.signUpText}>
          Don't have an account? Join Now!
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginView;
