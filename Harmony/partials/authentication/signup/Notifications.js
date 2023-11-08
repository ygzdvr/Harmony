import React from 'react';
import {View, Text} from 'react-native';
import SignupStyles from '../../../constants/styles/SignupStyles';

const Notifications = () => {
  return (
    <View style={SignupStyles.inputContainer}>
      <Text style={SignupStyles.textTitle}>Allow Notifications</Text>
      <Text style={SignupStyles.textDescription}>
        We will let you know when you have new messages, friend requests,
        messages or new song recommendations.
      </Text>
    </View>
  );
};

export default Notifications;
