/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {TouchableOpacity} from 'react-native';
import COLORS from '../../constants/colors';

const CustomHeader = ({navigation}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.background, // Set background color
        paddingHorizontal: 15,
        paddingVertical: 10,
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
        <TouchableOpacity
          onPress={() => navigation.navigate('NotificationView')}>
          <Icon
            name="bell"
            size={24}
            color={COLORS.text}
            style={{marginRight: 20}}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SettingView')}>
          <Icon
            name="settings"
            size={24}
            color={COLORS.text}
            style={{marginRight: 20}}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Icon name="send" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomHeader;
