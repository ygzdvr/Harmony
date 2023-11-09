/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import WelcomeView from './screens/authentication/WelcomeView';
import LoginView from './screens/authentication/LoginView';
import SignupView from './screens/authentication/SignupView';
import HomeView from './screens/mainView/HomeView';

const Stack = createNativeStackNavigator();
function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
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
          component={HomeView}
          options={{headerShown: false, gestureEnabled: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
