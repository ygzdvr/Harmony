import React, {useState, useEffect} from 'react';
import {Text, TouchableOpacity, Image} from 'react-native';
import COLORS from '../../constants/colors';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import HomeStyles from '../../constants/styles/HomeStyles';
import {Like} from '../../api/spotify/Like';
import {Dislike} from '../../api/spotify/Dislike';
import {CheckLiked} from '../../api/spotify/CheckLiked';
const Tile = ({
  title,
  artist,
  album,
  imageUrl,
  previewURL,
  isRectangle = false,
  currentSound,
  setCurrentSound,
  isPlaying,
  setIsPlaying,
  authCode,
  trackID,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  useEffect(() => {
    const checkIfLiked = async () => {
      const likedStatus = await CheckLiked(authCode, [trackID]);
      console.log('likedStatus', likedStatus);
      setIsLiked(likedStatus[0]);
    };

    checkIfLiked();
  }, [authCode, trackID]);

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
  const likeSong = () => {
    console.log('Like song');
    Like(authCode, trackID);
    console.log('Liked');
    setIsLiked(!isLiked);
  };
  const disLikeSong = () => {
    console.log('Dislike song');
    Dislike(authCode, trackID);
    console.log('Disliked');
    setIsLiked(!isLiked);
  };
  return (
    <TouchableOpacity
      style={[HomeStyles.tile, isRectangle ? HomeStyles.rectangleTile : null]}>
      <Image
        source={{uri: imageUrl}}
        style={HomeStyles.tileImage}
        resizeMode="cover"
      />
      <TouchableOpacity style={HomeStyles.playButton} onPress={playSound}>
        <Ionicons name="flash-outline" size={20} color={COLORS.background} />
      </TouchableOpacity>
      <TouchableOpacity
        style={HomeStyles.likeButton}
        onPress={isLiked ? disLikeSong : likeSong}>
        <Icon
          name={isLiked ? 'heart' : 'hearto'}
          size={18}
          color={COLORS.background}
        />
      </TouchableOpacity>
      <LinearGradient
        colors={['transparent', COLORS.background]}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={HomeStyles.textOverlay}>
        <Text
          style={HomeStyles.tileTitle}
          numberOfLines={1}
          ellipsizeMode="tail">
          {title}
        </Text>
        <Text
          style={HomeStyles.tileSubtitle}
          numberOfLines={1}
          ellipsizeMode="tail">
          {artist} - {album}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};
export default Tile;
