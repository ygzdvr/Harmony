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

const LoginView = ({navigation}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
      </TouchableOpacity>

      <Text style={styles.welcomeBack}>Welcome back!</Text>
      <Text style={styles.welcomeText}>
        It's great to see you again!Your next musical adventure awaits!
      </Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Username or Email</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter your username"
          placeholderTextColor={COLORS.text}
          keyboardType="email-address"
          textContentType="emailAddress"
        />

        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter your password"
          placeholderTextColor={COLORS.text}
          secureTextEntry={true}
          textContentType="password"
        />
      </View>

      <TouchableOpacity style={styles.signInButton} onPress={() => {}}>
        <Text style={styles.signInText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signUpButton}
        onPress={() => navigation.navigate('SignupView')}>
        <Text style={styles.signUpText}>Don't have an account? Join Now!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: 20,
  },
  backButton: {
    marginTop: 30,
    padding: 7,
    backgroundColor: COLORS.text,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  welcomeBack: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  welcomeText: {
    color: COLORS.text,
    fontSize: 15,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
  },
  inputLabel: {
    color: COLORS.text,
    marginBottom: 5,
    marginLeft: 4,
  },
  textInput: {
    height: 50,
    borderColor: COLORS.text,
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 15,
    color: COLORS.text,
    marginBottom: 20,
    width: '95%',
  },
  signInButton: {
    backgroundColor: COLORS.text,
    padding: 15,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: '95%',
    marginBottom: 20,
  },
  signInText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'medium',
  },
  signUpButton: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingRight: 20,
    width: '100%',
  },
  signUpText: {
    color: COLORS.text,
    fontSize: 15,
    alignSelf: 'center',
  },
});

export default LoginView;
