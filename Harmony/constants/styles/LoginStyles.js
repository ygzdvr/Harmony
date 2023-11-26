import {StyleSheet} from 'react-native';

import COLORS from '../colors';

const LoginStyles = StyleSheet.create({
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
    backgroundColor: COLORS.text,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    width: '95%',
  },
  signInButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: '95%',
    marginBottom: 20,
  },
  signInText: {
    color: COLORS.text,
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
export default LoginStyles;
