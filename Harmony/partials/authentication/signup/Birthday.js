import React from 'react';
import {View, Text, TextInput} from 'react-native';
import COLORS from '../../../constants/colors';
import SignupStyles from '../../../constants/styles/SignupStyles';

const BirthdayInput = ({
  birthMonth,
  setBirthMonth,
  birthDay,
  setBirthDay,
  birthYear,
  setBirthYear,
}) => {
  return (
    <View style={SignupStyles.inputContainer}>
      <Text style={SignupStyles.textTitle}>When's your Birthday?</Text>
      <Text style={SignupStyles.textDescription}>
        Your birthday won't be shown publicly.
      </Text>
      <View style={SignupStyles.birthdayContainer}>
        <TextInput
          style={[SignupStyles.birthdayInput, SignupStyles.monthInput]}
          placeholder="MM"
          placeholderTextColor={COLORS.text}
          keyboardType="number-pad"
          maxLength={2}
          value={birthMonth}
          onChangeText={setBirthMonth}
        />
        <TextInput
          style={[SignupStyles.birthdayInput, SignupStyles.dayInput]}
          placeholder="DD"
          placeholderTextColor={COLORS.text}
          keyboardType="number-pad"
          maxLength={2}
          value={birthDay}
          onChangeText={setBirthDay}
        />
        <TextInput
          style={[SignupStyles.birthdayInput, SignupStyles.yearInput]}
          placeholder="YYYY"
          placeholderTextColor={COLORS.text}
          keyboardType="number-pad"
          maxLength={4}
          value={birthYear}
          onChangeText={setBirthYear}
        />
      </View>
    </View>
  );
};

export default BirthdayInput;
