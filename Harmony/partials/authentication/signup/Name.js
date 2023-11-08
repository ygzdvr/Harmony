import React from 'react';
import {View, Text, TextInput} from 'react-native';
import COLORS from '../../../constants/colors';
import SignupStyles from '../../../constants/styles/SignupStyles';

const NameInput = ({name, setName}) => {
  return (
    <View style={SignupStyles.inputContainer}>
      <Text style={SignupStyles.textTitle}>Let's Meet</Text>
      <Text style={SignupStyles.textDescription}>
        What should we call you? This will be your display name.
      </Text>
      <TextInput
        style={SignupStyles.textInput}
        placeholder="Enter your name"
        placeholderTextColor={COLORS.background}
        value={name}
        onChangeText={setName}
      />
    </View>
  );
};

export default NameInput;
