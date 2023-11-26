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
    borderColor: COLORS.text,
    borderWidth: 1,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 5,
    width: '100%',
  },
  textInputError: {
    backgroundColor: COLORS.text,
    borderColor: COLORS.titlePink,
    borderWidth: 1,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 5,
    width: '100%',
  },
  errorMessage: {
    color: COLORS.titlePink,
    fontSize: 12,
    fontWeight: 'medium',
    marginBottom: 5,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  finishButton: {
    backgroundColor: COLORS.text,
    padding: 15,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
  },
  continueText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  finishText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'medium',
  },
  selectorButton: {
    backgroundColor: COLORS.background,
    padding: 15,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  selectedButton: {
    backgroundColor: COLORS.text,
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
  selectedText: {
    color: COLORS.background,
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
    backgroundColor: COLORS.text,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 5,
    textAlign: 'center',
    fontSize: 16,
  },
  monthInput: {
    flex: 1,
    marginRight: 10,
    color: COLORS.background,
  },
  dayInput: {
    flex: 1,
    marginHorizontal: 5,
    color: COLORS.background,
  },
  yearInput: {
    flex: 1.5,
    marginLeft: 10,
    color: COLORS.background,
  },
  modeOption: {
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  modeOptionSelected: {
    backgroundColor: COLORS.text,
    borderColor: 'transparent',
  },
  modeTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
    color: COLORS.text,
  },
  modeDescription: {
    fontSize: 12,
    color: COLORS.text,
  },
  modeTitleSelected: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
    color: COLORS.background,
  },
  modeDescriptionSelected: {
    fontSize: 12,
    color: COLORS.background,
  },
  imagePicker: {
    height: 150, // Set the height
    width: 150, // Set the width
    borderRadius: 20, // Rounded corners
    backgroundColor: COLORS.text, // White background
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    alignSelf: 'center', // Center the container
    marginTop: 20, // Add some margin at the top
    overflow: 'hidden', // Ensures the image does not bleed outside the border radius
  },

  profileImage: {
    height: '100%', // Full height of the container
    width: '100%', // Full width of the container
  },
});

export default SignupStyles;
