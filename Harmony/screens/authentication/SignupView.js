import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import COLORS from '../../constants/colors';
import SignupStyles from '../../constants/styles/SignupStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Progress from 'react-native-progress';

import PhoneNumberInput from '../../partials/authentication/signup/Phone';
import PhoneVerificationInput from '../../partials/authentication/signup/PhoneVerification';
import Tracking from '../../partials/authentication/signup/Tracking';
import NameInput from '../../partials/authentication/signup/Name';
import UsernameInput from '../../partials/authentication/signup/Username';
import PasswordInput from '../../partials/authentication/signup/Password';
import EmailInput from '../../partials/authentication/signup/Email';
import GenderInput from '../../partials/authentication/signup/Gender';

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
        return <Tracking />;
      case 4:
        return <NameInput name={name} setName={setName} />;
      case 5:
        return <UsernameInput username={username} setUsername={setUsername} />;
      case 6:
        return <PasswordInput password={password} setPassword={setPassword} />;
      case 7:
        return <EmailInput email={email} setEmail={setEmail} />;

      case 9:
        return <GenderInput gender={gender} setGender={setGender} />;

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
