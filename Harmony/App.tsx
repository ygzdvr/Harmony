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
import CustomHeader from './partials/home/CustomHeader';
import CustomTabs from './partials/home/CustomTabs';

const Stack = createNativeStackNavigator();

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
          component={CustomTabs}
          options={{headerShown: true, header: () => <CustomHeader />}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;
