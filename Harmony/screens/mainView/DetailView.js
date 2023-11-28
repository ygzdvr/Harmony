import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import axios from 'axios';
import COLORS from '../../constants/colors';
import DetailStyles from '../../constants/styles/DetailStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ScrollView, TouchableOpacity} from 'react-native';
const DetailView = ({navigation}) => {
  return (
    <ScrollView style={DetailStyles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={DetailStyles.backButton}>
        <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DetailView;
