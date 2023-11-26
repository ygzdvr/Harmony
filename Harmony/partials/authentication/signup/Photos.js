import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SignupStyles from '../../../constants/styles/SignupStyles';
import COLORS from '../../../constants/colors';

const PhotosInput = ({photos, setPhotos}) => {
  const [images, setImages] = useState(Array(6).fill(null));

  const pickImage = async index => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = [...images];
      newImages[index] = result.assets[0].uri;
      setPhotos(newImages);
      setImages(newImages);
    }
  };

  return (
    <View style={SignupStyles.inputContainer}>
      <Text style={SignupStyles.textTitle}>Add more photos</Text>
      <Text style={SignupStyles.textDescription}>
        Apart from your profile photo, you can add more photos to your profile.
        You can change these later.
      </Text>

      <View style={SignupStyles.imageGrid}>
        {images.map((img, index) => (
          <TouchableOpacity
            key={index}
            style={SignupStyles.imagePicker6}
            onPress={() => pickImage(index)}>
            {img ? (
              <Image source={{uri: img}} style={SignupStyles.profileImage} />
            ) : photos[index] ? (
              <Image
                source={{uri: photos[index]}}
                style={SignupStyles.profileImage}
              />
            ) : (
              <Ionicons name="add" size={40} color={COLORS.primary} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <Text style={SignupStyles.errorMessage}>{}</Text>
    </View>
  );
};

export default PhotosInput;
