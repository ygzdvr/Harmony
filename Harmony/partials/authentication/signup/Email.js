import React from 'react';
import {View, Text, TextInput} from 'react-native';
import COLORS from '../../../constants/colors';
import SignupStyles from '../../../constants/styles/SignupStyles';

const EmailInput = ({email, setEmail}) => {
  return (
    <View style={SignupStyles.inputContainer}>
      <Text style={SignupStyles.textTitle}>What's your email?</Text>
      <Text style={SignupStyles.textDescription}>
        For password recovery and more.
      </Text>
      <TextInput
        style={SignupStyles.textInput}
        placeholder="Enter your email"
        placeholderTextColor={COLORS.text}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
    </View>
  );
};

export default EmailInput;
