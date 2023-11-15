import {StyleSheet} from 'react-native';

import COLORS from '../colors';

const SettingStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
});

export default SettingStyles;
