/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeView from '../../screens/mainView/HomeView';
import MessageView from '../../screens/mainView/MessageView';
import EventView from '../../screens/mainView/EventView';
import SearchView from '../../screens/mainView/SearchView';
import COLORS from '../../constants/colors';
import Icon from 'react-native-vector-icons/Feather';

const Tab = createBottomTabNavigator();

const CustomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Messages') {
            iconName = 'heart';
          } else if (route.name === 'Search') {
            iconName = 'search';
          } else if (route.name === 'Events') {
            iconName = 'map';
          }
          // ... Add more conditions for other tabs

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.text,
        tabBarStyle: {
          backgroundColor: COLORS.tabBar,
          borderTopLeftRadius: 23, // Rounded corners on the left
          borderTopRightRadius: 23, // Rounded corners on the right
          borderBottomLeftRadius: 23, // Rounded corners on the left
          borderBottomRightRadius: 23, // Rounded corners on the right
          height: 60, // Adjust the height as needed
          position: 'absolute', // Needed to show the rounded corners
          borderTopWidth: 1, // Remove default border
          borderTopColor: COLORS.primary,
          elevation: 20, // Remove shadow on Android
          shadowOpacity: 100, // Remove shadow on iOS
          shadowOffset: {
            width: 0,
            height: 0,
          },
          borderColor: COLORS.primary,
          borderWidth: 1,
          marginLeft: 10,
          marginRight: 10,
          marginBottom: 10,
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
      <Tab.Screen name="Messages" component={MessageView} />
      <Tab.Screen name="Search" component={SearchView} />
      <Tab.Screen name="Events" component={EventView} />
    </Tab.Navigator>
  );
};
export default CustomTabs;
