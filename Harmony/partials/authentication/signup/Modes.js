import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import SignupStyles from '../../../constants/styles/SignupStyles';

const ModeInput = ({mode, setMode}) => {
  return (
    <View style={SignupStyles.buttonsContainer}>
      <Text style={SignupStyles.textTitle}>
        Choose a mode to get you started
      </Text>
      <Text style={SignupStyles.textDescription}>
        Harmony is for making all kinds of connections. You will be able to
        switch modes once you are all set up.
      </Text>
      <TouchableOpacity
        style={[
          SignupStyles.modeOption,
          mode === 'Date' ? SignupStyles.modeOptionSelected : {},
        ]}
        onPress={() => setMode('Date')}>
        <Text
          style={
            mode === 'Date'
              ? SignupStyles.modeTitleSelected
              : SignupStyles.modeTitle
          }>
          Date
        </Text>
        <Text
          style={
            mode === 'Date'
              ? SignupStyles.modeDescriptionSelected
              : SignupStyles.modeDescription
          }>
          Looking for someone special? Start your dating journey.
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          SignupStyles.modeOption,
          mode === 'BFF' ? SignupStyles.modeOptionSelected : {},
        ]}
        onPress={() => setMode('BFF')}>
        <Text
          style={
            mode === 'BFF'
              ? SignupStyles.modeTitleSelected
              : SignupStyles.modeTitle
          }>
          BFF
        </Text>
        <Text
          style={
            mode === 'BFF'
              ? SignupStyles.modeDescriptionSelected
              : SignupStyles.modeDescription
          }>
          Find a new best friend and explore new friendships.
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          SignupStyles.modeOption,
          mode === 'Vibes' ? SignupStyles.modeOptionSelected : {},
        ]}
        onPress={() => setMode('Vibes')}>
        <Text
          style={
            mode === 'Vibes'
              ? SignupStyles.modeTitleSelected
              : SignupStyles.modeTitle
          }>
          Vibes
        </Text>
        <Text
          style={
            mode === 'Vibes'
              ? SignupStyles.modeDescriptionSelected
              : SignupStyles.modeDescription
          }>
          Connect with people who share your vibe and interests.
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ModeInput;
