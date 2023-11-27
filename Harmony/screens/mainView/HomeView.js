import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
} from 'react-native';
import COLORS from '../../constants/colors';
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
} from 'firebase/firestore';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [songs, setSongs] = useState([]);
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [featuredSongs, setFeaturedSongs] = useState([]);
  const [campus, setCampus] = useState('');
  const [nearbySongs, setNearbySongs] = useState([]);

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      const performSearch = async () => {
        const usersRef = collection(DB_FIREBASE, 'users');
        const q = query(
          usersRef,
          where('username', '>=', searchQuery),
          where('username', '<=', searchQuery + '\uf8ff'),
        );
        try {
          const querySnapshot = await getDocs(q);
          const results = [];
          querySnapshot.forEach(document => {
            results.push({id: document.id, ...document.data()});
          });
          setSearchResults(results);

          console.log('Search results:', results); // Log the results
        } catch (error) {
          console.error('Error during search:', error);
        }
      };

      performSearch();
    }
  }, [searchQuery]);
  const renderSearchResults = () => {
    if (searchResults.length > 0) {
      return (
        <View style={styles.searchResultsOverlay}>
          {searchResults.map((user, index) => (
            <TouchableOpacity key={index} style={styles.searchResultItem}>
              <Text style={styles.searchResultText}>{user.username}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }
    return null;
  };

  const fetchUserFeaturedSongs = async userId => {
    const userDocRef = doc(DB_FIREBASE, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      setCampus(userData.campus);
      const campus = userData.campus;
      await fetchNearbySongs(campus);
      return userData.featuredSongs || [];
    } else {
      console.log('No such document!');
      return [];
    }
  };

  const fetchNearbySongs = async campus => {
    const usersRef = collection(DB_FIREBASE, 'users');
    const q = query(usersRef, where('campus', '==', campus));
    const querySnapshot = await getDocs(q);
    const songIds = [];

    querySnapshot.forEach(document => {
      if (document.data().mostRecentlyPlayedSong) {
        songIds.push(document.data().mostRecentlyPlayedSong);
      }
    });

    const uniqueSongIds = [...new Set(songIds)];
    const songs = await fetchSongsDetails(uniqueSongIds);
    setNearbySongs(songs);
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
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search profiles..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      {renderSearchResults()}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Tracks</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {songs.map((song, index) => (
            <Tile
              key={song.id}
              title={song.name}
              artist={song.artist}
              album={song.albumName}
              imageUrl={song.albumImage}
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
              album={song.albumName}
              imageUrl={song.albumImage}
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
        <Text style={styles.sectionTitle}>Vibes at {campus}</Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            paddingHorizontal: 8,
          }}>
          {nearbySongs.map((song, index) => (
            <Tile
              key={song.id}
              title={song.name}
              artist={song.artist}
              album={song.albumName}
              imageUrl={song.albumImage}
              previewURL={song.previewURL}
              currentSound={currentSound}
              setCurrentSound={setCurrentSound}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />
          ))}
        </View>
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
    marginTop: 10,
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
    marginBottom: 10,
  },
  rectangleTile: {
    width: 300,
    marginVertical: 0,
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
  searchContainer: {
    paddingHorizontal: 15,
  },
  searchInput: {
    backgroundColor: COLORS.text,
    borderRadius: 10,
    padding: 12,
    fontSize: 12,
    color: COLORS.background,
  },
  searchResultsContainer: {
    padding: 10,
  },
  searchResultText: {
    color: COLORS.text,
    fontSize: 12,
  },
  searchResultsOverlay: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 10,
    zIndex: 1,
  },
  searchResultItem: {
    backgroundColor: 'transparent',
    padding: 10,
    marginBottom: 5,
  },
});

export default HomeView;
