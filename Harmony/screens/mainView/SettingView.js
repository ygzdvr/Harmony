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

  const renderGenderTile = gender => {
    const isSelected = userData.gender === gender;
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
    const isSelected = userData.mode === mode;
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
    const isSelected = userData.interest === interest;
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
      <Text style={SettingStyles.textDescription}>Full Name</Text>
      <View style={SettingStyles.dataContainer}>
        <Text style={SettingStyles.dataText}>{userData.name}</Text>
      </View>

      <Text style={SettingStyles.textDescription}>Displayed Username</Text>
      <View style={SettingStyles.dataContainer}>
        <Text style={SettingStyles.dataText}>{userData.username}</Text>
      </View>

      <Text style={SettingStyles.textDescription}>Email Used</Text>
      <View style={SettingStyles.dataContainer}>
        <Text style={SettingStyles.dataText}>{userData.email}</Text>
      </View>

      <Text style={SettingStyles.textDescription}>Birthday</Text>
      <View style={SettingStyles.dataContainer}>
        <Text style={SettingStyles.dataText}>
          {userData.birthMonth}/{userData.birthDay}/{userData.birthYear}
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
        {renderGenderTile('Vibes')}
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
    </View>
  );
};

export default SettingView;
