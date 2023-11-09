import React from 'react';
import {View, Text, TextInput} from 'react-native';
import COLORS from '../../../constants/colors';
import SignupStyles from '../../../constants/styles/SignupStyles';

const EmailInput = ({email, setEmail, verifyEmail}) => {
  return (
    <View style={SignupStyles.inputContainer}>
      <Text style={SignupStyles.textTitle}>What's your email?</Text>
      <Text style={SignupStyles.textDescription}>
        For password recovery and more.
      </Text>
      <TextInput
        style={
          verifyEmail === ''
            ? SignupStyles.textInput
            : SignupStyles.textInputError
        }
        placeholder="Enter your email"
        placeholderTextColor={COLORS.background}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <Text style={SignupStyles.errorMessage}>{verifyEmail}</Text>
    </View>
  );
};

export default EmailInput;
