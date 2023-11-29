import React from 'react';
import {Text, TouchableOpacity, Image} from 'react-native';
import COLORS from '../../constants/colors';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import HomeStyles from '../../constants/styles/HomeStyles';

const Bar = ({
  title,
  artist,
  album,
  imageUrl,
  previewURL,
  currentSound,
  setCurrentSound,
  isPlaying,
  setIsPlaying,
  username,
  name,
}) => {
  const playSound = () => {
    if (currentSound && isPlaying) {
      // If a sound is playing, stop it
      currentSound.stop(() => {
        currentSound.release();
        setCurrentSound(null);
        setIsPlaying(false);
      });
    } else {
      // No sound is playing, start a new one
      const sound = new Sound(previewURL, null, error => {
        if (error) {
          console.log('Failed to load the sound', error);
          return;
        }
        sound.play(() => {
          sound.release();
          setIsPlaying(false);
        });
        setCurrentSound(sound);
        setIsPlaying(true);
      });
    }
  };
  return (
    <TouchableOpacity style={[HomeStyles.bar]} onPress={playSound}>
      <Image
        source={{uri: imageUrl}}
        style={HomeStyles.barImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', COLORS.background]}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={HomeStyles.textOverlay}>
        <Text
          style={HomeStyles.barTitle}
          numberOfLines={1}
          ellipsizeMode="tail">
          {name}
        </Text>
        <Text
          style={HomeStyles.barSubtitle}
          numberOfLines={1}
          ellipsizeMode="tail">
          {title} - {artist}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};
export default Bar;
