import React, {useState} from 'react';
import {View, Text} from 'react-native';

import SettingStyles from '../../constants/styles/SettingStyles';

const SettingView = () => {
  return (
    <View style={SettingStyles.container}>
      <Text style={SettingStyles.textTitle}>Settings</Text>
      <Text style={SettingStyles.textDescription}>
        View your settings here!
      </Text>
    </View>
  );
};

export default SettingView;
