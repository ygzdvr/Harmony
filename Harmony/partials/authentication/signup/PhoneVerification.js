import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import COLORS from '../../../constants/colors';
import SignupStyles from '../../../constants/styles/SignupStyles';

const PhoneNumberInput = ({
  phoneNumber,
  verificationCode,
  setVerificationCode,
}) => {
  return (
    <View style={SignupStyles.inputContainer}>
      <Text style={SignupStyles.textTitle}>Verify your number</Text>
      <Text style={SignupStyles.textDescription}>
        Enter the code we've sent by text to {phoneNumber}
      </Text>
      <TextInput
        style={SignupStyles.textInput}
        placeholder="Enter verification code"
        placeholderTextColor={COLORS.text}
        keyboardType="number-pad"
        value={verificationCode}
        onChangeText={setVerificationCode}
      />
    </View>
  );
};

export default PhoneNumberInput;
