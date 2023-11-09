import React from 'react';
import {View, Text, TextInput} from 'react-native';
import COLORS from '../../../constants/colors';
import SignupStyles from '../../../constants/styles/SignupStyles';

const PhoneNumberInput = ({
  phoneNumber,
  verificationCode,
  setVerificationCode,
  verifyCode,
}) => {
  return (
    <View style={SignupStyles.inputContainer}>
      <Text style={SignupStyles.textTitle}>Verify your number</Text>
      <Text style={SignupStyles.textDescription}>
        Enter the code we've sent by text to {phoneNumber}
      </Text>
      <TextInput
        style={
          verifyCode === ''
            ? SignupStyles.textInput
            : SignupStyles.textInputError
        }
        placeholder="Enter verification code"
        placeholderTextColor={COLORS.background}
        keyboardType="number-pad"
        value={verificationCode}
        onChangeText={setVerificationCode}
      />
      <Text style={SignupStyles.errorMessage}>{verifyCode}</Text>
    </View>
  );
};

export default PhoneNumberInput;
