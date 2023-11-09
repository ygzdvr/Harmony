import React from 'react';
import {View, Text, TextInput} from 'react-native';
import COLORS from '../../../constants/colors';
import SignupStyles from '../../../constants/styles/SignupStyles';

const PasswordInput = ({password, setPassword, verifyPassword}) => {
  return (
    <View style={SignupStyles.inputContainer}>
      <Text style={SignupStyles.textTitle}>Pick a password</Text>
      <Text style={SignupStyles.textDescription}>
        Make sure it's at least 8 characters.
      </Text>
      <TextInput
        style={
          verifyPassword === ''
            ? SignupStyles.textInput
            : SignupStyles.textInputError
        }
        placeholder="Enter a password"
        placeholderTextColor={COLORS.background}
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <Text style={SignupStyles.errorMessage}>{verifyPassword}</Text>
    </View>
  );
};

export default PasswordInput;
