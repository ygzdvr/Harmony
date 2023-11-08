import React from 'react';
import {View, Text} from 'react-native';
import SignupStyles from '../../../constants/styles/SignupStyles';

const LocationServices = () => {
  return (
    <View style={SignupStyles.inputContainer}>
      <Text style={SignupStyles.textTitle}>Enable location services</Text>
      <Text style={SignupStyles.textDescription}>
        We use your location to help you discover nearby friends, music and
        events. See what people are listening to in your area.
      </Text>
    </View>
  );
};

export default LocationServices;
