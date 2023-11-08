/* eslint-disable react-native/no-inline-styles */
import {View, Text, TouchableOpacity, Image, Pressable} from 'react-native';
import React from 'react';
import COLORS from '../../constants/colors';

import GradientText from '../../components/GradientText';
const WelcomeView = ({navigation}) => {
  return (
    <View
      style={{
        backgroundColor: COLORS.background,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          marginBottom: 275,
        }}>
        <Image
          source={require('../../assets/logo/logo.png')}
          style={{width: 300, height: 300}}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          top: 350,
          width: '100%',
        }}>
        <Text
          style={{
            color: COLORS.text,
            fontSize: 45,
            fontWeight: 'bold',
            marginTop: 20,
            paddingHorizontal: 10,
          }}>
          Welcome to
        </Text>

        <GradientText
          style={{
            fontSize: 45,
            fontWeight: 'bold',
            marginTop: 0,
            paddingHorizontal: 10,
          }}>
          Harmony
        </GradientText>
        <Text
          style={{
            color: COLORS.text,
            fontSize: 16,
            marginTop: 20,
            paddingHorizontal: 10,
          }}>
          Connect with people who share your taste in music. Find your perfect
          music match!
        </Text>

        <TouchableOpacity
          style={{
            backgroundColor: COLORS.text,
            padding: 15,
            borderRadius: 15,
            marginTop: 30,
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 10,
          }}
          onPress={() => navigation.navigate('SignupView')}>
          <Text
            style={{color: COLORS.primary, fontSize: 16, fontWeight: 'medium'}}>
            Join Now!
          </Text>
        </TouchableOpacity>
        <View
          style={{
            padding: 15,
            marginTop: 5,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Pressable onPress={() => navigation.navigate('LoginView')}>
            <Text style={{color: COLORS.text, fontSize: 15}}>
              Already have an account? Sign In!
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
export default WelcomeView;
