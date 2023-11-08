import React from 'react';
import {View, Text, TextInput} from 'react-native';
import COLORS from '../../../constants/colors';
import SignupStyles from '../../../constants/styles/SignupStyles';

const PhoneNumberInput = ({phoneNumber, setPhoneNumber}) => {
  return (
    <View style={SignupStyles.inputContainer}>
      <Text style={SignupStyles.textTitle}>What's your phone number?</Text>
      <Text style={SignupStyles.textDescription}>
        We protect our community by making sure everyine on Harmony is real.
      </Text>
      <TextInput
        style={SignupStyles.textInput}
        placeholder="Enter your phone number"
        placeholderTextColor={COLORS.background}
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
    </View>
  );
};

export default PhoneNumberInput;
