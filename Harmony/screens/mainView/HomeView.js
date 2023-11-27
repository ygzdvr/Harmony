import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import COLORS from '../../constants/colors';
import {doc, getDoc, getDocs, collection} from 'firebase/firestore';
import {DB_FIREBASE} from '../../api/firebase/firebase';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import {get} from '../../api/util/get';

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
    <TouchableOpacity
      style={[styles.tile, isRectangle ? styles.rectangleTile : null]}>
      <Image
        source={{uri: imageUrl}}
        style={styles.tileImage}
        resizeMode="cover"
      />
      <TouchableOpacity style={styles.playButton} onPress={playSound}>
        <Icon name="zap" size={20} color={COLORS.background} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.likeButton}>
        <Icon name="heart" size={18} color={COLORS.background} />
      </TouchableOpacity>
      <LinearGradient
        colors={['transparent', COLORS.background]}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={styles.textOverlay}>
        <Text style={styles.tileTitle} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
        <Text
          style={styles.tileSubtitle}
          numberOfLines={1}
          ellipsizeMode="tail">
          {artist} - {album}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const HomeView = () => {
  const exampleTiles = ['Tile 1', 'Tile 2', 'Tile 3', 'Tile 4', 'Tile 5'];
  const [songs, setSongs] = useState([]);
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [featuredSongs, setFeaturedSongs] = useState([]);

  const fetchUserFeaturedSongs = async userId => {
    const userDocRef = doc(DB_FIREBASE, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.featuredSongs || [];
    } else {
      console.log('No such document!');
      return [];
    }
  };

  const fetchSongsDetails = async songIds => {
    const songs = [];
    for (const id of songIds) {
      const songDocRef = doc(DB_FIREBASE, 'songs', id);
      const songDoc = await getDoc(songDocRef);

      if (songDoc.exists()) {
        songs.push({id: songDoc.id, ...songDoc.data()});
      }
    }
    return songs;
  };
  useEffect(() => {
    const fetchFeaturedSongs = async () => {
      const userId = await get('@user_id');
      const featuredSongIds = await fetchUserFeaturedSongs(userId);
      const featuredSongsClone = await fetchSongsDetails(featuredSongIds);
      setFeaturedSongs(featuredSongsClone);
    };

    fetchFeaturedSongs();
  }, []);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(DB_FIREBASE, 'popularSongs'),
        );
        const songsSnapshot = [];
        querySnapshot.forEach(document => {
          songsSnapshot.push({id: document.id, ...document.data()});
        });
        setSongs(songsSnapshot);
      } catch (error) {
        console.error('Error fetching songs: ', error);
      }
    };

    fetchSongs();
  }, []);

  console.log(songs);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Tracks</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {songs.map((song, index) => (
            <Tile
              key={song.id}
              title={song.name}
              artist={song.artist}
              album={song.album}
              imageUrl={song.imageurl}
              previewURL={song.previewURL}
              isRectangle={true}
              currentSound={currentSound}
              setCurrentSound={setCurrentSound}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured for You</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {featuredSongs.map((song, index) => (
            <Tile
              key={song.id}
              title={song.name}
              artist={song.artist}
              album={song.album}
              imageUrl={song.imageurl}
              previewURL={song.previewURL}
              currentSound={currentSound}
              setCurrentSound={setCurrentSound}
              isRectangle={true}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>People Nearby Listen</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {exampleTiles.map((title, index) => (
            <Tile key={index} title={title} />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  textTitle: {
    fontSize: 24,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  textDescription: {
    fontSize: 16,
    color: COLORS.text,
    marginTop: 10,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  tile: {
    width: 150,
    height: 150,
    borderRadius: 15,
    backgroundColor: COLORS.tabBar,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  rectangleTile: {
    width: 300,
  },
  tileText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  tileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    position: 'absolute',
  },
  textOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    height: 55,
  },
  tileTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  tileSubtitle: {
    fontSize: 12,
    color: 'white',
  },
  playButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: COLORS.text,
    borderRadius: 5,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  likeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: COLORS.text,
    borderRadius: 5,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeView;
