import {StyleSheet} from 'react-native';

import COLORS from '../colors';

const SettingStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
    paddingHorizontal: 20,
  },
  dataContainer: {
    backgroundColor: COLORS.text,
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'left',
    width: '100%',
    marginBottom: 15,
  },
  dataText: {
    color: COLORS.background,
    fontSize: 15,
  },
  backButton: {
    marginTop: 30,
    padding: 7,
    backgroundColor: COLORS.text,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  textDescription: {
    color: COLORS.text,
    fontSize: 15,
    alignSelf: 'left',
    marginBottom: 5,
  },
  logoutButton: {
    backgroundColor: COLORS.logOutButton,
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    marginTop: 20,
  },
  logoutText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: 'bold',
  },
  Tile: {
    flex: 1,
    padding: 15,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: COLORS.background,
  },
  TileSelected: {
    backgroundColor: COLORS.text,
  },
  TileText: {
    color: COLORS.text,
  },
  TileTextSelected: {
    color: COLORS.background,
  },
  TileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  profilePhotoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  profilePhoto: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
});

export default SettingStyles;
