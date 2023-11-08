import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import COLORS from '../../constants/colors';
import SignupStyles from '../../constants/styles/SignupStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Progress from 'react-native-progress';

import PhoneNumberInput from '../../partials/authentication/signup/Phone';
import PhoneVerificationInput from '../../partials/authentication/signup/PhoneVerification';

const SignupView = ({navigation}) => {
  const [step, setStep] = useState(1);
  // States for form data
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const totalSteps = 9;
  const progress = step / totalSteps;

  // Function to render the correct form based on the step
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <PhoneNumberInput
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
          />
        );

      case 2:
        return (
          <PhoneVerificationInput
            phoneNumber={phoneNumber}
            verificationCode={verificationCode}
            setVerificationCode={setVerificationCode}
          />
        );
      case 3:
        return (
          <View style={SignupStyles.inputContainer}>
            <Text style={SignupStyles.textTitle}>
              Personalize your experience
            </Text>
            <Text style={SignupStyles.textDescription}>
              We use tracking to improve our marketing and your experience, like
              letting you connect to Instagram {phoneNumber}
            </Text>
          </View>
        );
      case 4:
        return (
          <View style={SignupStyles.inputContainer}>
            <Text style={SignupStyles.textTitle}>Let's Meet</Text>
            <Text style={SignupStyles.textDescription}>
              What should we call you? This will be your display name.
            </Text>
            <TextInput
              style={SignupStyles.textInput}
              placeholder="Enter your name"
              placeholderTextColor={COLORS.text}
              value={name}
              onChangeText={setName}
            />
          </View>
        );
      case 5:
        return (
          <View style={SignupStyles.inputContainer}>
            <Text style={SignupStyles.textTitle}>Pick a username</Text>
            <Text style={SignupStyles.textDescription}>
              This will be your unique username on Harmony.
            </Text>
            <TextInput
              style={SignupStyles.textInput}
              placeholder="Enter a username"
              placeholderTextColor={COLORS.text}
              value={username}
              onChangeText={setUsername}
            />
          </View>
        );
      case 6:
        return (
          <View style={SignupStyles.inputContainer}>
            <Text style={SignupStyles.textTitle}>Pick a password</Text>
            <Text style={SignupStyles.textDescription}>
              Make sure it's at least 8 characters.
            </Text>
            <TextInput
              style={SignupStyles.textInput}
              placeholder="Enter a password"
              placeholderTextColor={COLORS.text}
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />
            <TextInput
              style={SignupStyles.textInput}
              placeholder="Verify your password"
              placeholderTextColor={COLORS.text}
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />
          </View>
        );
      case 7:
        return (
          <View style={SignupStyles.inputContainer}>
            <Text style={SignupStyles.textTitle}>What's your email?</Text>
            <Text style={SignupStyles.textDescription}>
              For password recovery and more.
            </Text>
            <TextInput
              style={SignupStyles.textInput}
              placeholder="Enter your email"
              placeholderTextColor={COLORS.text}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={SignupStyles.container}>
      <View style={SignupStyles.progressContainer}>
        <Progress.Bar
          progress={progress}
          width={null}
          borderWidth={0}
          unfilledColor={COLORS.secondary}
          color={COLORS.primary}
          borderRadius={2}
          height={7}
        />
      </View>
      {step > 1 && (
        <TouchableOpacity
          onPress={() => setStep(prevStep => prevStep - 1)}
          style={SignupStyles.backButton}>
          <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      )}
      {step < 2 && (
        <TouchableOpacity
          onPress={() => navigation.navigate('WelcomeView')}
          style={SignupStyles.backButton}>
          <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      )}
      {renderStep()}
      <View style={SignupStyles.inputContainer}>
        <TouchableOpacity
          style={SignupStyles.signInButton}
          onPress={() => {
            if (step < totalSteps) {
              setStep(prevStep => prevStep + 1);
            } else {
              // Submit the final form
            }
          }}>
          <Text style={SignupStyles.signInText}>
            {step === totalSteps ? 'Finish' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignupView;
