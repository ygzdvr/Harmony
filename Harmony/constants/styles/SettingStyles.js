import {StyleSheet} from 'react-native';

import COLORS from '../colors';

const SettingStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  backButton: {
    marginTop: 30,
    padding: 7,
    backgroundColor: COLORS.text,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  textTitle: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 10,
  },
  textDescription: {
    color: COLORS.text,
    fontSize: 15,
    alignSelf: 'center',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: COLORS.logOutButton,
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  logoutText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoView: {
    backgroundColor: COLORS.background,
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  infoContainer: {
    backgroundColor: COLORS.text,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
});

export default SettingStyles;
