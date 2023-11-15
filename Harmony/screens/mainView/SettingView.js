import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {AUTH_FIREBASE, DB_FIREBASE} from '../../api/firebase/firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SettingStyles from '../../constants/styles/SettingStyles';
import {getDoc, doc} from 'firebase/firestore';
import {get} from '../../api/util/get';
import COLORS from '../../constants/colors';

const SettingView = ({navigation}) => {
  const route = useRoute();
  const {onLogout} = route.params;
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      const useruid = await get('@user_id');
      if (useruid) {
        const users = doc(DB_FIREBASE, 'users', useruid);
        const docSnap = await getDoc(users);
        if (docSnap.exists) {
          setUserData(docSnap.data());
          console.log('Document data:', docSnap.data());
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
    <View style={SettingStyles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={SettingStyles.backButton}>
        <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
      </TouchableOpacity>
      <Text style={SettingStyles.textTitle}>Settings</Text>
      {userData && (
        <View style={SettingStyles.infoView}>
          <Text style={SettingStyles.textDescription}>
            Name: {userData.name}
          </Text>
          <Text style={SettingStyles.textDescription}>
            Username: {userData.username}
          </Text>
          <Text style={SettingStyles.textDescription}>
            Email: {userData.email}
          </Text>
          <Text style={SettingStyles.textDescription}>
            Gender: {userData.gender}
          </Text>
          <Text style={SettingStyles.textDescription}>
            Birthday: {userData.birthMonth}/{userData.birthDay}/
            {userData.birthYear}
          </Text>
          <Text style={SettingStyles.textDescription}>
            Mode: {userData.mode}
          </Text>
          <Text style={SettingStyles.textDescription}>
            Interest: {userData.interest}
          </Text>
        </View>
      )}
      <TouchableOpacity
        style={SettingStyles.logoutButton}
        onPress={handleLogOut}>
        <Text style={SettingStyles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingView;
