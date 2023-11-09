import React from 'react';
import {View, Text, TextInput} from 'react-native';
import COLORS from '../../../constants/colors';
import SignupStyles from '../../../constants/styles/SignupStyles';

const PhoneNumberInput = ({phoneNumber, setPhoneNumber, verifyPhone}) => {
  return (
    <View style={SignupStyles.inputContainer}>
      <Text style={SignupStyles.textTitle}>What's your phone number?</Text>
      <Text style={SignupStyles.textDescription}>
        We protect our community by making sure everyine on Harmony is real.
      </Text>
      <TextInput
        style={
          verifyPhone === ''
            ? SignupStyles.textInput
            : SignupStyles.textInputError
        }
        placeholder="Enter your phone number"
        placeholderTextColor={COLORS.background}
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <Text style={SignupStyles.errorMessage}>{verifyPhone}</Text>
    </View>
  );
};

export default PhoneNumberInput;
