/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeView from '../../screens/mainView/HomeView';
import MatchView from '../../screens/mainView/MatchView';
import EventView from '../../screens/mainView/EventView';
import ProfileView from '../../screens/mainView/ProfileView';
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
          } else if (route.name === 'Matches') {
            iconName = 'heart';
          } else if (route.name === 'Events') {
            iconName = 'map';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          }
          return <Icon name={iconName} size={22} color={color} />;
        },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.text,
        tabBarStyle: {
          backgroundColor: COLORS.tabBar,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          height: 60,
          position: 'absolute',
          borderTopWidth: 0,
          borderTopColor: COLORS.text,
          elevation: 20,
          shadowOpacity: 100,
          shadowOffset: {
            width: 0,
            height: 0,
          },
          borderColor: COLORS.primary,
          borderWidth: 0,
          marginLeft: 0,
          marginRight: 0,
          marginBottom: 0,
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
      <Tab.Screen name="Matches" component={MatchView} />
      <Tab.Screen name="Events" component={EventView} />
      <Tab.Screen name="Profile" component={ProfileView} />
    </Tab.Navigator>
  );
};
export default CustomTabs;
