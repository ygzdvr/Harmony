import {View, Text, TouchableOpacity, TextInput, Image} from 'react-native';
import React from 'react';
import COLORS from '../../constants/colors';
import Ionicons from 'react-native-vector-icons/FontAwesome'; // Make sure to install react-native-vector-icons if not already done

const LoginView = ({navigation}) => {
  return (
    <View
      style={{
        backgroundColor: COLORS.background,
        flex: 1,
      }}>
      <TouchableOpacity
        onPress={() => navigation.goBack()} // Use goBack() to navigate to the previous screen
        style={{
          alignSelf: 'flex-start',
          padding: 10,
          marginLeft: 10,
          marginTop: 10,
        }}>
        <Ionicons name="star-o" size={24} color={COLORS.text} />
      </TouchableOpacity>
      <Ionicons name="star-o" size={24} color={COLORS.text} />
      <View style={{alignItems: 'center', marginTop: 20}}>
        <Text style={{color: COLORS.text, fontSize: 28, fontWeight: 'bold'}}>
          Welcome back!
        </Text>
      </View>

      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Image
          source={require('../../assets/logo/logo.png')}
          style={{width: 300, height: 300, marginBottom: 50}}
        />

        <TextInput
          style={{
            height: 50,
            width: '85%',
            borderColor: COLORS.text,
            borderWidth: 1,
            borderRadius: 15,
            paddingHorizontal: 15,
            color: COLORS.text,
            marginBottom: 20,
          }}
          placeholder="Email"
          placeholderTextColor={COLORS.text}
          keyboardType="email-address"
          textContentType="emailAddress"
        />

        <TextInput
          style={{
            height: 50,
            width: '85%',
            borderColor: COLORS.text,
            borderWidth: 1,
            borderRadius: 15,
            paddingHorizontal: 15,
            color: COLORS.text,
            marginBottom: 20,
          }}
          placeholder="Password"
          placeholderTextColor={COLORS.text}
          secureTextEntry={true}
          textContentType="password"
        />

        <TouchableOpacity
          style={{
            backgroundColor: COLORS.text,
            padding: 15,
            borderRadius: 15,
            width: '85%',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
          }}
          onPress={() => {
            /* Add your login logic here */
          }}>
          <Text
            style={{color: COLORS.primary, fontSize: 16, fontWeight: 'medium'}}>
            Sign In
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignupView')}>
          <Text style={{color: COLORS.text, fontSize: 15}}>
            Don't have an account? Join Now!
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginView;
