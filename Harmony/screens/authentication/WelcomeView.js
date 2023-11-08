import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import COLORS from '../../constants/colors';
const WelcomeView = () => {
  return <View style={{backgroundColor: COLORS.background, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <View>
      
    </View>
    <View style={{
      position: 'absolute',
      top: 300,
      width: '100%',
    }}>
      <Text style={{ color: COLORS.text, fontSize: 40, fontWeight: 'bold', marginTop: 20, paddingHorizontal: 10 }}>
      <Text>
        Welcome to
      </Text>
      {"\n"}
      <Text style={{ color: COLORS.primary}}>
        Harmony
      </Text>
      </Text>
      
      <Text style={{ color: COLORS.text, fontSize: 16, marginTop: 10, paddingHorizontal: 10 }}>
        Connect with people who share your taste in music. Find your perfect music match!
      </Text>
      
      <TouchableOpacity style={{ backgroundColor: COLORS.text, padding: 15, borderRadius: 15, marginTop: 30, justifyContent: 'center', alignItems: 'center', marginHorizontal: 10}}>
        <Text style={{ color: COLORS.primary, fontSize: 18}}>Join Now!</Text>
      </TouchableOpacity>
      <View style={{ padding: 15, marginTop: 10, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{ color: COLORS.text, fontSize: 15}}>Already have an account? Sign In!</Text>
      </View>
      
    </View>

  </View>;

};
export default WelcomeView;
