import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import COLORS from '../../constants/colors';
import SignupStyles from '../../constants/styles/SignupStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Progress from 'react-native-progress';

import PhoneNumberInput from '../../partials/authentication/signup/Phone';
import PhoneVerificationInput from '../../partials/authentication/signup/PhoneVerification';
import Notifications from '../../partials/authentication/signup/Notifications';
import LocationServices from '../../partials/authentication/signup/Location';
import Tracking from '../../partials/authentication/signup/Tracking';
import NameInput from '../../partials/authentication/signup/Name';
import UsernameInput from '../../partials/authentication/signup/Username';
import PasswordInput from '../../partials/authentication/signup/Password';
import EmailInput from '../../partials/authentication/signup/Email';
import GenderInput from '../../partials/authentication/signup/Gender';
import BirthdayInput from '../../partials/authentication/signup/Birthday';
import ModeInput from '../../partials/authentication/signup/Modes';
import InterestedInput from '../../partials/authentication/signup/Interested';
import Spotify from '../../partials/authentication/signup/Spotify';

const SignupView = ({navigation}) => {
  const [step, setStep] = useState(1);
  // States for form data
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [mode, setMode] = useState('');
  const [interest, setInterest] = useState('');

  const totalSteps = 14;
  const progress = step / totalSteps;

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
        return <Notifications />;
      case 4:
        return <LocationServices />;
      case 5:
        return <Tracking />;
      case 6:
        return <NameInput name={name} setName={setName} />;
      case 7:
        return <UsernameInput username={username} setUsername={setUsername} />;
      case 8:
        return <PasswordInput password={password} setPassword={setPassword} />;
      case 9:
        return <EmailInput email={email} setEmail={setEmail} />;
      case 10:
        return (
          <BirthdayInput
            birthMonth={birthMonth}
            setBirthMonth={setBirthMonth}
            birthDay={birthDay}
            setBirthDay={setBirthDay}
            birthYear={birthYear}
            setBirthYear={setBirthYear}
          />
        );
      case 11:
        return <GenderInput gender={gender} setGender={setGender} />;

      case 12:
        return <ModeInput mode={mode} setMode={setMode} />;

      case 13:
        return (
          <InterestedInput interest={interest} setInterest={setInterest} />
        );
      case 14:
        return <Spotify />;
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
          <Ionicons name="chevron-back" size={20} color={COLORS.background} />
        </TouchableOpacity>
      )}
      {step < 2 && (
        <TouchableOpacity
          onPress={() => navigation.navigate('WelcomeView')}
          style={SignupStyles.backButton}>
          <Ionicons name="chevron-back" size={20} color={COLORS.background} />
        </TouchableOpacity>
      )}
      {renderStep()}
      <View style={SignupStyles.inputContainer}>
        <TouchableOpacity
          style={
            step === totalSteps
              ? SignupStyles.finishButton
              : SignupStyles.continueButton
          }
          onPress={() => {
            if (step < totalSteps) {
              setStep(prevStep => prevStep + 1);
            } else {
              navigation.navigate('HomeView');
            }
          }}>
          <Text
            style={
              step === totalSteps
                ? SignupStyles.finishText
                : SignupStyles.continueText
            }>
            {step === totalSteps ? 'Connect & Finish' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignupView;
