import {AUTH_FIREBASE} from './firebase';
import {useState} from 'react';

export default function SignupHandle(email, password, navigation) {
  const [error, setError] = useState('');
  const auth = AUTH_FIREBASE;
  auth
    .createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      const user = userCredential.user;
      console.log('Registered with: ', user.email);
      navigation.navigate('HomeView');
    })
    .catch(error => {
      setError(error.message);
    });
  return error;
}
