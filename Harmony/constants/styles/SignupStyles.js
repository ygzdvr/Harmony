import {StyleSheet} from 'react-native';

import COLORS from '../colors';

const SignupStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
    alignItems: 'flex-start',
  },
  progressContainer: {
    width: '100%',
    padding: 20,
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
  buttonsContainer: {
    width: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  textInput: {
    backgroundColor: COLORS.text,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    width: '100%',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  signInButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  signInText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'medium',
  },
  selectorButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 15,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  selectedButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.text,
    padding: 15,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  selectorText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'medium',
  },
  birthdayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  birthdayInput: {
    height: 50,
    borderColor: COLORS.text,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  monthInput: {
    flex: 1,
    marginRight: 10,
    color: COLORS.text,
  },
  dayInput: {
    flex: 1,
    marginHorizontal: 5,
    color: COLORS.text,
  },
  yearInput: {
    flex: 1.5,
    marginLeft: 10,
    color: COLORS.text,
  },
});

export default SignupStyles;
