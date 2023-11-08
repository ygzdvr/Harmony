import {StyleSheet} from 'react-native';

import COLORS from '../colors';

const SignupStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
    alignItems: 'flex-start',
  },
  progressContainer: {
    width: '100%', // Ensure the container takes the full width
    padding: 20, // Add padding if needed
    justifyContent: 'center',
    marginTop: 30,
  },
  backButton: {
    padding: 7,
    backgroundColor: COLORS.text,
    borderRadius: 8,
    marginBottom: 20,
    marginLeft: 20,
  },
  textTitle: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  textDescription: {
    color: COLORS.text,
    fontSize: 15,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  textInput: {
    height: 50,
    borderColor: COLORS.text,
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 15,
    color: COLORS.text,
    marginBottom: 20,
    width: '100%',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  signInButton: {
    backgroundColor: COLORS.text,
    padding: 15,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  signInText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'medium',
  },
});

export default SignupStyles;
