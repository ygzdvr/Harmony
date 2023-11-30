import {StyleSheet} from 'react-native';

import COLORS from '../colors';

const ProfileStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
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
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 10,
  },
  nameText: {
    fontSize: 20,
    color: COLORS.text,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  musicPreferences: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 15,
  },
  musicPreferenceTile: {
    backgroundColor: COLORS.text,
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
    width: '30%',
  },
  musicPreferenceLabel: {
    fontSize: 12,
    color: COLORS.background,
    marginBottom: 0,
  },
  musicPreferenceText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  socialInfo: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 10,
  },
  socialInfoColumn: {
    marginHorizontal: -50,
    alignItems: 'center',
    width: '30%',
    marginBottom: 0,
  },
  socialInfoTitle: {
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 0,
  },
  socialInfoNumber: {
    fontSize: 20,
    marginBottom: 5,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  userPhotosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    marginBottom: 100,
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  square: {
    width: 160,
    height: 160,
    borderRadius: 10,
    marginVertical: 5,
  },
  verticalRectangle: {
    width: 160,
    height: 250,
    borderRadius: 20,
    marginVertical: 5,
    borderWidth: 2,
    borderColor: COLORS.text,
  },
  additionalInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    marginHorizontal: 5,
  },
  cardContainer: {
    backgroundColor: COLORS.tabBar,
    borderRadius: 20,
    padding: 15,
    marginHorizontal: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  separator: {
    height: 10,
    backgroundColor: 'transparent',
  },
  tileTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  tileSubtitle: {
    fontSize: 12,
    color: 'white',
  },
  textOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    height: 60,
  },
});

export default ProfileStyles;
