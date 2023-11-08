import React from 'react';
import {View, Text} from 'react-native';
import SignupStyles from '../../../constants/styles/SignupStyles';

const Tracking = ({spotifyConnected, setSpotifyConnected}) => {
  return (
    <View style={SignupStyles.inputContainer}>
      <Text style={SignupStyles.textTitle}>Connect your Spotify account</Text>
      <Text style={SignupStyles.textDescription}>
        Enjoy a personalized music experience. Connect your Spotify account now.
      </Text>
    </View>
  );
};

export default Tracking;
