import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import React from 'react';
import COLORS from '../../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LoginStyles from '../../constants/styles/LoginStyles';

const LoginView = ({navigation}) => {
  return (
    <View style={LoginStyles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={LoginStyles.backButton}>
        <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
      </TouchableOpacity>

      <Text style={LoginStyles.welcomeBack}>Welcome back!</Text>
      <Text style={LoginStyles.welcomeText}>
        It's great to see you again!Your next musical adventure awaits!
      </Text>
      <View style={LoginStyles.inputContainer}>
        <Text style={LoginStyles.inputLabel}>Username or Email</Text>
        <TextInput
          style={LoginStyles.textInput}
          placeholder="Enter your username"
          placeholderTextColor={COLORS.background}
          keyboardType="email-address"
          textContentType="emailAddress"
        />

        <Text style={LoginStyles.inputLabel}>Password</Text>
        <TextInput
          style={LoginStyles.textInput}
          placeholder="Enter your password"
          placeholderTextColor={COLORS.background}
          secureTextEntry={true}
          textContentType="password"
        />
      </View>

      <TouchableOpacity
        style={LoginStyles.signInButton}
        onPress={() => navigation.navigate('HomeView')}>
        <Text style={LoginStyles.signInText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={LoginStyles.signUpButton}
        onPress={() => navigation.navigate('SignupView')}>
        <Text style={LoginStyles.signUpText}>
          Don't have an account? Join Now!
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginView;
