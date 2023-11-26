import React from 'react';
import {View, Text, TextInput} from 'react-native';
import COLORS from '../../../constants/colors';
import SignupStyles from '../../../constants/styles/SignupStyles';

const PhotosInput = ({name, setName, verifyName}) => {
  return (
    <View style={SignupStyles.inputContainer}>
      <Text style={SignupStyles.textTitle}>Let's Meet</Text>
      <Text style={SignupStyles.textDescription}>
        What should we call you? This will be your display name.
      </Text>
      <TextInput
        style={
          verifyName === ''
            ? SignupStyles.textInput
            : SignupStyles.textInputError
        }
        placeholder="Enter your name"
        placeholderTextColor={COLORS.background}
        value={name}
        onChangeText={setName}
      />
      <Text style={SignupStyles.errorMessage}>{verifyName}</Text>
    </View>
  );
};

export default PhotosInput;
