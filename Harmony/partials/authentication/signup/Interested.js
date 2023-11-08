import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import SignupStyles from '../../../constants/styles/SignupStyles';

const InterestedInput = ({interest, setInterest}) => {
  return (
    <View style={SignupStyles.buttonsContainer}>
      <Text style={SignupStyles.textTitle}>Who are you interested in?</Text>
      <Text style={SignupStyles.textDescription}>
        Choose your preference for connections.
      </Text>
      <TouchableOpacity
        style={
          interest === 'Woman'
            ? SignupStyles.selectedButton
            : SignupStyles.selectorButton
        }
        onPress={() => setInterest('Woman')}>
        <Text
          style={
            interest === 'Woman'
              ? SignupStyles.selectedText
              : SignupStyles.selectorText
          }>
          I am interested in Women
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={
          interest === 'Man'
            ? SignupStyles.selectedButton
            : SignupStyles.selectorButton
        }
        onPress={() => setInterest('Man')}>
        <Text
          style={
            interest === 'Man'
              ? SignupStyles.selectedText
              : SignupStyles.selectorText
          }>
          I am interested in Men
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={
          interest === 'Everyone'
            ? SignupStyles.selectedButton
            : SignupStyles.selectorButton
        }
        onPress={() => setInterest('Everyone')}>
        <Text
          style={
            interest === 'Everyone'
              ? SignupStyles.selectedText
              : SignupStyles.selectorText
          }>
          I am interested in Everyone
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default InterestedInput;
