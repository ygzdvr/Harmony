import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import COLORS from '../../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Progress from 'react-native-progress';

const SignupView = ({navigation}) => {
  const [step, setStep] = useState(1);
  // States for form data
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const totalSteps = 5;
  const progress = step / totalSteps;

  // Function to render the correct form based on the step
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.textTitle}>What's your phone number?</Text>
            <Text style={styles.textDescription}>
              We protect our community by making sure everyine on Harmony is
              real.
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your phone number"
              placeholderTextColor={COLORS.text}
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>
        );
      case 2:
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.textTitle}>Verify your number</Text>
            <Text style={styles.textDescription}>
              Enter the code we've sent by text to {phoneNumber}
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter verification code"
              placeholderTextColor={COLORS.text}
              keyboardType="number-pad"
              value={verificationCode}
              onChangeText={setVerificationCode}
            />
          </View>
        );
      case 3:
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.textTitle}>Personalize your experience</Text>
            <Text style={styles.textDescription}>
              We use tracking to improve our marketing and your experience, like
              letting you connect to Instagram {phoneNumber}
            </Text>
          </View>
        );
      case 4:
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>What is your name?</Text>

            <TextInput
              style={styles.textInput}
              placeholder="Enter your name"
              placeholderTextColor={COLORS.text}
              value={name}
              onChangeText={setName}
            />
            <Text style={styles.inputLabel}>Choose a username</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter a username"
              placeholderTextColor={COLORS.text}
              value={username}
              onChangeText={setUsername}
            />
            <Text style={styles.inputLabel}>What is your email address?</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your email address"
              placeholderTextColor={COLORS.text}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        );
      case 5:
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Set up a password</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter a password"
              placeholderTextColor={COLORS.text}
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
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
          style={styles.backButton}>
          <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      )}
      {step < 2 && (
        <TouchableOpacity
          onPress={() => navigation.navigate('WelcomeView')}
          style={styles.backButton}>
          <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      )}
      {renderStep()}
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => {
            if (step < totalSteps) {
              setStep(prevStep => prevStep + 1);
            } else {
              // Submit the final form
            }
          }}>
          <Text style={styles.signInText}>
            {step === totalSteps ? 'Finish' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
    alignItems: 'flex-start',
  },
  progressContainer: {
    width: '100%', // Ensure the container takes the full width
    padding: 20, // Add padding if needed
    justifyContent: 'center',
    marginTop: 30,
  },
  backButton: {
    padding: 7,
    backgroundColor: COLORS.text,
    borderRadius: 8,
    marginBottom: 20,
    marginLeft: 20,
  },
  textTitle: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  textDescription: {
    color: COLORS.text,
    fontSize: 15,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  textInput: {
    height: 50,
    borderColor: COLORS.text,
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 15,
    color: COLORS.text,
    marginBottom: 20,
    width: '100%',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  signInButton: {
    backgroundColor: COLORS.text,
    padding: 15,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  signInText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'medium',
  },
  // ... (other styles remain unchanged)
});

export default SignupView;
