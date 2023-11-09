import AsyncStorage from '@react-native-async-storage/async-storage';

export const get = async storeageName => {
  try {
    return await AsyncStorage.getItem(storeageName);
  } catch (error) {
    return error;
  }
};
