/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import WelcomeView from './screens/authentication/WelcomeView';
import LoginView from './screens/authentication/LoginView';
import SignupView from './screens/authentication/SignupView';
import HomeView from './screens/mainView/HomeView';
import MessageView from './screens/mainView/MessageView';
import EventView from './screens/mainView/EventView';
import SearchView from './screens/mainView/SearchView';
import COLORS from './constants/colors';
import Icon from 'react-native-vector-icons/Feather';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Messages') {
            iconName = 'feather';
          } else if (route.name === 'Search') {
            iconName = 'search';
          } else if (route.name === 'Events') {
            iconName = 'map';
          }
          // ... Add more conditions for other tabs

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.text,
        tabBarStyle: {
          backgroundColor: COLORS.tabBar,
          borderTopLeftRadius: 20, // Rounded corners on the left
          borderTopRightRadius: 20, // Rounded corners on the right
          borderBottomLeftRadius: 20, // Rounded corners on the left
          borderBottomRightRadius: 20, // Rounded corners on the right
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
        tabBarShowLabel: false, // Optional: Hide labels for a cleaner look
      })}>
      <Tab.Screen name="Home" component={HomeView} />
      <Tab.Screen name="Messages" component={MessageView} />
      <Tab.Screen name="Search" component={SearchView} />
      <Tab.Screen name="Events" component={EventView} />
    </Tab.Navigator>
  );
}
function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeView">
        <Stack.Screen
          name="WelcomeView"
          component={WelcomeView}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="LoginView"
          component={LoginView}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignupView"
          component={SignupView}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HomeView"
          component={MyTabs}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;
