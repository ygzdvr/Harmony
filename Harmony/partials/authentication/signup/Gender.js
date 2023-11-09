import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import SignupStyles from '../../../constants/styles/SignupStyles';

const GenderInput = ({gender, setGender, verifyGender}) => {
  return (
    <View style={SignupStyles.buttonsContainer}>
      <Text style={SignupStyles.textTitle}>How do you identify?</Text>
      <Text style={SignupStyles.textDescription}>
        Everyone's welcomed on Harmony. Pick which best describes you.
      </Text>
      <Text style={SignupStyles.errorMessage}>{verifyGender}</Text>
      <TouchableOpacity
        style={
          gender === 'Woman'
            ? SignupStyles.selectedButton
            : SignupStyles.selectorButton
        }
        onPress={() => setGender('Woman')}>
        <Text
          style={
            gender === 'Woman'
              ? SignupStyles.selectedText
              : SignupStyles.selectorText
          }>
          Woman
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={
          gender === 'Man'
            ? SignupStyles.selectedButton
            : SignupStyles.selectorButton
        }
        onPress={() => setGender('Man')}>
        <Text
          style={
            gender === 'Man'
              ? SignupStyles.selectedText
              : SignupStyles.selectorText
          }>
          Man
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={
          gender === 'Nonbinary'
            ? SignupStyles.selectedButton
            : SignupStyles.selectorButton
        }
        onPress={() => setGender('Nonbinary')}>
        <Text
          style={
            gender === 'Nonbinary'
              ? SignupStyles.selectedText
              : SignupStyles.selectorText
          }>
          Nonbinary
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default GenderInput;
