import React from 'react';
import {View, Text} from 'react-native';
import SignupStyles from '../../../constants/styles/SignupStyles';

const Tracking = () => {
  return (
    <View style={SignupStyles.inputContainer}>
      <Text style={SignupStyles.textTitle}>Personalize your experience</Text>
      <Text style={SignupStyles.textDescription}>
        We use tracking to improve our marketing and your experience, like
        letting you connect to Instagram.
      </Text>
    </View>
  );
};

export default Tracking;
