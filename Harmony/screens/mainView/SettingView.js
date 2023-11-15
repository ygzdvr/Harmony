import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import SettingStyles from '../../constants/styles/SettingStyles';
import {signOut} from 'firebase/auth';
import {AUTH_FIREBASE} from '../../api/firebase/firebase';
import {put} from '../../api/util/put';

const SettingView = ({navigation}) => {
  const handleLogOut = () => {
    const auth = AUTH_FIREBASE;
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log('Sign-out successful.');
        put('@authenticated', 'not authenticated');
        navigation.reset({
          index: 0,
          routes: [{name: 'WelcomeView'}],
        });
      })
      .catch(error => {
        // An error happened.
        console.log('An error happened.');
      });
  };
  return (
    <View style={SettingStyles.container}>
      <Text style={SettingStyles.textTitle}>Settings</Text>
      <Text style={SettingStyles.textDescription}>
        View your settings here!
      </Text>
      <TouchableOpacity
        style={SettingStyles.deleteButton}
        onPress={handleLogOut}>
        <Text style={SettingStyles.deleteText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingView;
