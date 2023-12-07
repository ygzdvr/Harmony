import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WelcomeView from './screens/authentication/WelcomeView';
import LoginView from './screens/authentication/LoginView';
import SignupView from './screens/authentication/SignupView';
import SettingView from './screens/mainView/SettingView';
import DetailView from './screens/mainView/DetailView';
import BlendView from './screens/mainView/BlendView';
import ProfileView from './screens/mainView/ProfileView';
import NotificationView from './screens/mainView/NotificationView';
import CustomHeader from './partials/home/CustomHeader';
import CustomTabs from './partials/home/CustomTabs';
import {onAuthStateChanged, signOut} from 'firebase/auth';
import {AUTH_FIREBASE} from './api/firebase/firebase';
import {get} from './api/util/get';
import {put} from './api/util/put';
import {LogBox} from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(AUTH_FIREBASE);
      put('@authenticated', 'not authenticated');
      put('@user_id', '');
      setAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSign = async () => {
    try {
      console.log('Sign in success');
      put('@authenticated', 'authenticated');
      setAuthenticated(true);
    } catch (error) {
      console.error('Signup Error:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(AUTH_FIREBASE, user => {
      if (user) {
        setAuthenticated(true);
        put('@authenticated', 'authenticated');
      } else {
        setAuthenticated(false);
        put('@authenticated', 'not authenticated');
      }
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  useEffect(() => {
    get('@authenticated').then(res => {
      setAuthenticated(res === 'authenticated');
    });
  }, []);

  if (!authenticated) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="WelcomeView">
          <Stack.Screen
            name="WelcomeView"
            component={WelcomeView}
            options={{headerShown: false, gestureEnabled: false}}
          />
          <Stack.Screen
            name="LoginView"
            component={LoginView}
            initialParams={{onSignIn: handleSign}}
            options={{headerShown: false, gestureEnabled: false}}
          />
          <Stack.Screen
            name="SignupView"
            component={SignupView}
            initialParams={{onSignUp: handleSign}}
            options={{headerShown: false, gestureEnabled: false}}
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
          options={{
            headerShown: true,
            header: ({navigation}) => <CustomHeader navigation={navigation} />,
          }}
        />
        <Stack.Screen
          name="SettingView"
          component={SettingView}
          initialParams={{onLogout: handleLogout}}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="NotificationView"
          component={NotificationView}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DetailView"
          component={DetailView}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="BlendView"
          component={BlendView}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
