import AsyncStorage from '@react-native-async-storage/async-storage';

export const put = async (storeageName, data) => {
  try {
    return await AsyncStorage.setItem(storeageName, data);
  } catch (error) {
    return error;
  }
};
