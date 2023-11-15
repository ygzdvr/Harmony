import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import SettingStyles from '../../constants/styles/SettingStyles';

const SettingView = ({onLogout}) => {
  const handleLogOut = () => {
    onLogout();
  };
  return (
    <View style={SettingStyles.container}>
      <Text style={SettingStyles.textTitle}>Settings</Text>
      <Text style={SettingStyles.textDescription}>
        View your settings here!
      </Text>
      <TouchableOpacity
        style={SettingStyles.logoutButton}
        onPress={handleLogOut}>
        <Text style={SettingStyles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingView;
