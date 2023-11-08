import React from 'react';
import {View, Text, TextInput} from 'react-native';
import COLORS from '../../../constants/colors';
import SignupStyles from '../../../constants/styles/SignupStyles';

const UsernameInput = ({username, setUsername}) => {
  return (
    <View style={SignupStyles.inputContainer}>
      <Text style={SignupStyles.textTitle}>Pick a username</Text>
      <Text style={SignupStyles.textDescription}>
        This will be your unique username on Harmony.
      </Text>
      <TextInput
        style={SignupStyles.textInput}
        placeholder="Enter a username"
        placeholderTextColor={COLORS.background}
        value={username}
        onChangeText={setUsername}
      />
    </View>
  );
};

export default UsernameInput;
