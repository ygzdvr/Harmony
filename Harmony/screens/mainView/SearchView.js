import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import axios from 'axios';

import HomeStyles from '../../constants/styles/HomeStyles';

const SearchView = () => {
  return (
    <View style={HomeStyles.container}>
      <Text style={HomeStyles.textTitle}>Welcome to Harmony</Text>
      <Text style={HomeStyles.textDescription}>View your searches here!</Text>
    </View>
  );
};

export default SearchView;
