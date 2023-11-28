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
import {ref, getDownloadURL} from 'firebase/storage';
import {DB_FIREBASE, STORAGE} from '../../api/firebase/firebase';
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

const HomeView = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [songs, setSongs] = useState([]);
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [featuredSongs, setFeaturedSongs] = useState([]);
  const [campus, setCampus] = useState('');
  const [nearbySongs, setNearbySongs] = useState([]);

  useEffect(() => {
    if (searchQuery.trim().length > 3) {
      const performSearch = async () => {
        const usersRef = collection(DB_FIREBASE, 'users');
        const q = query(
          usersRef,
          where('username', '>=', searchQuery),
          where('username', '<=', searchQuery + '\uf8ff'),
        );
        try {
          const querySnapshot = await getDocs(q);
          const resultsPromises = querySnapshot.docs.map(async document => {
            const userData = document.data();
            const profilePhotoUrl = await fetchProfilePhotoUrl(document.id);
            return {id: document.id, profilePhotoUrl, ...userData};
          });

          const results = await Promise.all(resultsPromises);
          setSearchResults(results);
          console.log('Search results:', results); // Log the results
        } catch (error) {
          console.error('Error during search:', error);
        }
      };

      performSearch();
    }
  }, [searchQuery]);
  const handleSelectUser = user => {
    navigation.navigate('DetailView', {
      userId: user.id,
      profilePhoto: user.profilePhotoUrl,
    });
  };
  const renderSearchResults = () => {
    if (searchResults.length > 0) {
      return (
        <View style={styles.searchResultsOverlay}>
          {searchResults.map((user, index) => (
            <TouchableOpacity
              key={index}
              style={styles.searchResultItem}
              onPress={() => handleSelectUser(user)}>
              {user.profilePhotoUrl && (
                <Image
                  source={{uri: user.profilePhotoUrl}}
                  style={styles.searchProfileImage}
                  resizeMode="cover"
                />
              )}
              <View style={styles.searchResultTextContainer}>
                <Text style={styles.searchResultText}>{user.username}</Text>
                <Text style={styles.searchResultSubtext}>{user.name}</Text>
              </View>
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
      if (document.data().topTrackShortTerm) {
        songIds.push(document.data().topTrackShortTerm);
      }
      if (document.data().topTrackLongTerm) {
        songIds.push(document.data().topTrackLongTerm);
      }
      if (document.data().topTrackMediumTerm) {
        songIds.push(document.data().topTrackMediumTerm);
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
  const fetchProfilePhotoUrl = async userId => {
    const photoRef = ref(STORAGE, `profilePhotos/${userId}`);
    try {
      const url = await getDownloadURL(photoRef);
      return url;
    } catch (error) {
      console.error('Error fetching profile photo:', error);
      return '';
    }
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
      console.log('Fetching songs...');
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon
            name="search"
            size={20}
            color={COLORS.background}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for profiles..."
            placeholderTextColor={COLORS.background}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
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
    backgroundColor: 'rgba(228, 215, 244, 1)',
    borderRadius: 5,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  likeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(228, 215, 244, 1)',
    borderRadius: 5,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 15,
  },
  searchResultsContainer: {
    padding: 10,
  },
  searchResultsOverlay: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(7, 3, 12, 0.9)',
    padding: 10,
    marginHorizontal: 15,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    zIndex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.text,
    borderRadius: 10,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 12,
    color: COLORS.background,
  },
  searchIcon: {
    marginLeft: 10,
  },
  searchProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.text,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 10,
    marginBottom: 5,
  },
  searchResultTextContainer: {
    flexDirection: 'column',
  },
  searchResultText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchResultSubtext: {
    color: COLORS.text,
    fontSize: 12,
  },
});

export default HomeView;
