/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, {useEffect, useState} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WelcomeView from './screens/authentication/WelcomeView';
import LoginView from './screens/authentication/LoginView';
import SignupView from './screens/authentication/SignupView';
import SettingView from './screens/mainView/SettingView';
import CustomHeader from './partials/home/CustomHeader';
import CustomTabs from './partials/home/CustomTabs';
import {onAuthStateChanged} from 'firebase/auth';
import {AUTH_FIREBASE} from './api/firebase/firebase';
import {get} from './api/util/get';
import {put} from './api/util/put';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  const auth = AUTH_FIREBASE;
  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        setAuthenticated(true);
        put('@authenticated', 'authenticated');
      } else {
        setAuthenticated(false);
        put('@authenticated', 'not authenticated');
      }
    });
    get('@authenticated').then(res => {
      if (res === 'authenticated') {
        setAuthenticated(true);
        put('@authenticated', 'authenticated');
        console.log('changed');
      }
    });
  }, []);
  get('@authenticated').then(res => {
    if (res === 'authenticated') {
      setAuthenticated(true);
    }
  });
  console.log(authenticated);
  // !authenticated
  if (true) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="WelcomeView">
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
          <Stack.Screen
            name="SettingView"
            component={SettingView}
            options={{headerShown: true, header: () => <CustomHeader />}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeView">
        <Stack.Screen
          name="HomeView"
          component={CustomTabs}
          options={{headerShown: true, header: () => <CustomHeader />}}
        />
        <Stack.Screen
          name="SettingView"
          component={SettingView}
          options={{headerShown: true, header: () => <CustomHeader />}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;
