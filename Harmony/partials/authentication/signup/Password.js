import React from 'react';
import {View, Text, TextInput} from 'react-native';
import COLORS from '../../../constants/colors';
import SignupStyles from '../../../constants/styles/SignupStyles';

const PasswordInput = ({password, setPassword}) => {
  return (
    <View style={SignupStyles.inputContainer}>
      <Text style={SignupStyles.textTitle}>Pick a password</Text>
      <Text style={SignupStyles.textDescription}>
        Make sure it's at least 8 characters.
      </Text>
      <TextInput
        style={SignupStyles.textInput}
        placeholder="Enter a password"
        placeholderTextColor={COLORS.background}
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={SignupStyles.textInput}
        placeholder="Verify your password"
        placeholderTextColor={COLORS.background}
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
    </View>
  );
};

export default PasswordInput;
