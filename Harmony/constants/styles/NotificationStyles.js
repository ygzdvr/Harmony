import {StyleSheet} from 'react-native';

import COLORS from '../colors';

const NotificationStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -0,
    marginTop: -40,
    width: 20,
  },

  headerTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  backButton: {
    marginTop: 30,
    padding: 10,
    backgroundColor: COLORS.text,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.text,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  profilePhoto: {
    width: 32,
    height: 32,
    borderRadius: 20,
    marginRight: 10,
  },
  requestText: {
    fontSize: 13,
    color: COLORS.background,
    fontWeight: 'bold',
    marginBottom: 1,
  },
  requestInfo: {
    flex: 1,
  },
  requestUsername: {
    fontSize: 12,
    color: COLORS.background,
  },
  requestTime: {
    fontSize: 12,
    color: COLORS.background,
    alignSelf: 'center',
    marginRight: 10,
  },
});

export default NotificationStyles;
