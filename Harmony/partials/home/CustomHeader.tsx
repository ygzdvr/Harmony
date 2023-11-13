/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Button} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {TouchableOpacity} from 'react-native';
import COLORS from '../../constants/colors';

const CustomHeader = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.background, // Set background color
        paddingHorizontal: 15,
      }}>
      <Text
        style={{
          fontSize: 24,
          color: COLORS.text,
          fontWeight: 'bold',
          marginTop: 20,
          paddingBottom: 5,
        }}>
        Welcome Back
      </Text>
      {/* Increase text size and change color */}
      <View style={{flexDirection: 'row', marginTop: 20, paddingBottom: 5}}>
        <TouchableOpacity onPress={() => {}}>
          <Icon
            name="bell"
            size={24}
            color={COLORS.text}
            style={{marginRight: 20}}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Icon
            name="settings"
            size={24}
            color={COLORS.text}
            style={{marginRight: 20}}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Icon name="feather" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomHeader;