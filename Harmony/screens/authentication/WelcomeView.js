import {View, Text, TouchableOpacity, Image, Pressable} from 'react-native';
import React from 'react';
import WelcomeStyles from '../../constants/styles/WelcomeStyles';

import GradientText from '../../components/GradientText';
const WelcomeView = ({navigation}) => {
  return (
    <View style={WelcomeStyles.container}>
      <View style={WelcomeStyles.logoContainer}>
        <Image
          source={require('../../assets/logo/logo.png')}
          style={WelcomeStyles.logo}
        />
      </View>
      <View style={WelcomeStyles.contentContainer}>
        <Text style={WelcomeStyles.title}>Welcome to</Text>
        <GradientText style={WelcomeStyles.gradientTitle}>Harmony</GradientText>
        <Text style={WelcomeStyles.subtitle}>
          Connect with people who share your taste in music. Find your perfect
          music match!
        </Text>
        <TouchableOpacity
          style={WelcomeStyles.joinNowButton}
          onPress={() => navigation.navigate('SignupView')}>
          <Text style={WelcomeStyles.joinNowButtonText}>Join Now!</Text>
        </TouchableOpacity>
        <View style={WelcomeStyles.signInContainer}>
          <Pressable onPress={() => navigation.navigate('LoginView')}>
            <Text style={WelcomeStyles.signInText}>
              Already have an account? Sign In!
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
export default WelcomeView;
