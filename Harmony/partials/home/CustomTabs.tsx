/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeView from '../../screens/mainView/HomeView';
import MatchView from '../../screens/mainView/MatchView';
import EventView from '../../screens/mainView/EventView';
import ProfileView from '../../screens/mainView/ProfileView';
import SearchView from '../../screens/mainView/SearchView';
import COLORS from '../../constants/colors';
import Icon from 'react-native-vector-icons/Feather';

const Tab = createBottomTabNavigator();

const CustomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Messages') {
            iconName = 'heart';
          } else if (route.name === 'Events') {
            iconName = 'map';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.text,
        tabBarStyle: {
          backgroundColor: COLORS.tabBar,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          height: 60,
          position: 'absolute',
          borderTopWidth: 1,
          borderTopColor: COLORS.background,
          elevation: 20,
          shadowOpacity: 100,
          shadowOffset: {
            width: 0,
            height: 0,
          },
          borderColor: COLORS.background,
          borderWidth: 1,
          marginLeft: 10,
          marginRight: 10,
          marginBottom: 5,
        },
        tabBarShowLabel: false,
        headerStyle: {
          backgroundColor: COLORS.tabBar,
          borderBottomWidth: 0,
          borderWidth: 0,
        },
        headerShown: false,
      })}>
      <Tab.Screen name="Home" component={HomeView} />
      <Tab.Screen name="Messages" component={MatchView} />
      <Tab.Screen name="Events" component={EventView} />
      <Tab.Screen name="Profile" component={ProfileView} />
    </Tab.Navigator>
  );
};
export default CustomTabs;
