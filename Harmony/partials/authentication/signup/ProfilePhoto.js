import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SignupStyles from '../../../constants/styles/SignupStyles';
import COLORS from '../../../constants/colors';

const ProfilePhotoInput = ({profilePhoto, setProfilePhoto}) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setProfilePhoto(result.assets[0].uri);
    }
  };

  return (
    <View style={SignupStyles.inputContainer}>
      <Text style={SignupStyles.textTitle}>Add your first photo</Text>
      <Text style={SignupStyles.textDescription}>
        This is your profile photo. It's the first thing people will see.
        Obviously, you can change this later.
      </Text>

      <TouchableOpacity style={SignupStyles.imagePicker} onPress={pickImage}>
        {selectedImage ? (
          <Image
            source={{uri: selectedImage}}
            style={SignupStyles.profileImage}
          />
        ) : profilePhoto ? (
          <Image
            source={{uri: profilePhoto}}
            style={SignupStyles.profileImage}
          />
        ) : (
          <Ionicons name="add" size={40} color={COLORS.primary} />
        )}
      </TouchableOpacity>

      <Text style={SignupStyles.errorMessage}>{}</Text>
    </View>
  );
};

export default ProfilePhotoInput;
