import {StyleSheet} from 'react-native';

import COLORS from '../colors';

const WelcomeStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
    alignItems: 'flex-start',
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: '15%',
  },
  logo: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  contentContainer: {
    position: 'absolute',
    top: '50%',
    width: '100%',
  },
  title: {
    color: COLORS.text,
    fontSize: 45,
    fontWeight: 'bold',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  gradientTitle: {
    fontSize: 45,
    fontWeight: 'bold',
    marginTop: 0,
    paddingHorizontal: 10,
  },
  subtitle: {
    color: COLORS.text,
    fontSize: 16,
    marginTop: 20,
    paddingHorizontal: 10,
  },
  joinNowButton: {
    backgroundColor: COLORS.text,
    padding: 15,
    borderRadius: 15,
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  joinNowButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'medium',
  },
  signInContainer: {
    padding: 15,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    color: COLORS.text,
    fontSize: 15,
  },
});

export default WelcomeStyles;
