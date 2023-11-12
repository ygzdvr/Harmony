import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import axios from 'axios';

import HomeStyles from '../../constants/styles/HomeStyles';

const EventView = () => {
  return (
    <View style={HomeStyles.container}>
      <Text style={HomeStyles.textTitle}>Welcome to Harmony</Text>
      <Text style={HomeStyles.textDescription}>View your events here!</Text>
    </View>
  );
};

export default EventView;
