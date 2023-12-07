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
  updateDoc,
  setDoc,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';
import {ref, getDownloadURL} from 'firebase/storage';
import {DB_FIREBASE, STORAGE} from '../../api/firebase/firebase';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import {get} from '../../api/util/get';
import {put} from '../../api/util/put';
import {refreshTokens} from '../../api/spotify/refreshTokens';
import {TOP} from '../../api/spotify/TOP';
import {SONGS} from '../../api/spotify/SONGS';
import {SPOTIFY} from '../../api/spotify/SPOTIFY';
import Tile from '../../partials/home/Tile';
import Bar from '../../partials/home/Bar';
import styles from '../../constants/styles/HomeStyles';
import {Pinecone} from '@pinecone-database/pinecone';

const HomeView = ({navigation}) => {
  const pinecone = new Pinecone({
    environment: 'us-west1-gcp',
    apiKey: '1eb47e0b-06bb-4b48-b1a1-152c4bedd031',
  });
  put('@authenticated', 'authenticated');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [songs, setSongs] = useState([]);
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [featuredSongs, setFeaturedSongs] = useState([]);
  const [recentlyPlayedSongs, setRecentlyPlayedSongs] = useState([]);
  const [campus, setCampus] = useState('');
  const [nearbySongs, setNearbySongs] = useState([]);
  const [friendsRecentPlays, setFriendsRecentPlays] = useState([]);
  const [token, setToken] = useState('');

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
      authCode: token,
    });
  };
  const renderSearchResults = () => {
    if (searchResults.length > 0 && searchQuery.trim().length > 3) {
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

  const fetchUserRecentlyPlayedSongs = async userId => {
    const userDocRef = doc(DB_FIREBASE, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      setCampus(userData.campus);
      const campus = userData.campus;
      await fetchNearbySongs(campus);
      return userData.recentlyPlayedSongs;
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
  const fetchFriendsData = async () => {
    const userId = await get('@user_id');
    const userRef = doc(DB_FIREBASE, 'users', userId);

    // Set up the real-time listener
    const unsubscribe = onSnapshot(userRef, async userSnap => {
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const friends = userData.friends || [];
        const friendDataPromises = friends.map(async friend => {
          const friendRef = doc(DB_FIREBASE, 'users', friend.userId);
          const friendSnap = await getDoc(friendRef);

          if (friendSnap.exists()) {
            const friendData = friendSnap.data();
            const songDocRef = doc(
              DB_FIREBASE,
              'songs',
              friendData.mostRecentlyPlayedSong,
            );
            const songSnap = await getDoc(songDocRef);
            const songData = songSnap.exists() ? songSnap.data() : null;
            console.log('songData', songData);
            return {
              username: friendData.username,
              name: friendData.name,
              mostRecentlyPlayedSong: songData,
            };
          }
        });

        const friendsData = await Promise.all(friendDataPromises);
        console.log('friendsData2', friendsData);
        setFriendsRecentPlays(friendsData); // Update state
      }
    });

    // Return unsubscribe function to clean up the listener on component unmount
    return unsubscribe;
  };

  useEffect(() => {
    const initializeData = async () => {
      const newAccessToken = await refreshAccessToken();
      setToken(newAccessToken);
      if (newAccessToken) {
        try {
          SONGS(newAccessToken).then(songsFetched => {
            SongsDatabase(songsFetched).then(() => {
              TOP(newAccessToken).then(topSongs => {
                refreshRecentlyPlayed(topSongs).then(() => {
                  fetchRecentSongs();
                });
              });
            });
          });
        } catch (err) {
          console.log(err);
        }
      }
    };
    const fetchFeaturedSongs = async userId => {
      // Real-time listener setup
      const userDocRef = doc(DB_FIREBASE, 'users', userId);
      const unsubscribe = onSnapshot(userDocRef, async doc => {
        if (doc.exists()) {
          const userData = doc.data();
          const featuredSongIds = userData.featuredSongs || [];
          const featuredSongsData = await fetchSongsDetails(featuredSongIds);
          setFeaturedSongs(featuredSongsData); // Update state
        }
      });

      // Return unsubscribe function to clean up the listener
      return unsubscribe;
    };
    const fetchRecentSongs = async () => {
      const userId = await get('@user_id');
      const recentlyPlayedIDs = await fetchUserRecentlyPlayedSongs(userId);
      console.log('recentlyPlayedIDs', recentlyPlayedIDs);
      const recentlyPlayed = await fetchSongsDetails(recentlyPlayedIDs);
      setRecentlyPlayedSongs(recentlyPlayed);
    };
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
    const updatePopularSongs = async () => {
      try {
        const songsRef = collection(DB_FIREBASE, 'songs');
        const q = query(songsRef, orderBy('popularity', 'desc'), limit(10));
        const querySnapshot = await getDocs(q);
        const popularSongs = [];
        querySnapshot.forEach(doc => {
          popularSongs.push({id: doc.id, ...doc.data()});
        });
        for (const song of popularSongs) {
          //await setDoc(doc(DB_FIREBASE, 'popularSongs', song.id), song);
        }

        console.log('Popular songs updated successfully');
      } catch (error) {
        console.error('Error updating popular songs:', error);
      }
    };

    const userId = get('@user_id'); // Fetch user ID
    userId.then(uid => {
      if (uid) {
        initializeData().then(() => {
          // Additional data fetching calls
          updatePopularSongs();
          fetchSongs();
          fetchRecentSongs();
          fetchUserRecentlyPlayedSongs(uid).then(recentlyPlayedIDs => {
            fetchSongsDetails(recentlyPlayedIDs).then(setRecentlyPlayedSongs);
          });
          const unsubscribeFriendsData = fetchFriendsData();
          const unsubscribeFeaturedSongs = fetchFeaturedSongs(uid);
          return unsubscribeFeaturedSongs; // Cleanup on component unmount
        });
      }
    });
  }, []);

  const refreshAccessToken = async () => {
    try {
      const newAccessToken = await refreshTokens();
      if (newAccessToken) {
        const userId = await get('@user_id');
        const userRef = doc(DB_FIREBASE, 'users', userId);
        await updateDoc(userRef, {access_token: newAccessToken});
        console.log('Access token refreshed successfully');
        console.log('new access token:', newAccessToken);
        await put('@access_token', newAccessToken);
        return newAccessToken;
      }
    } catch (error) {
      console.error('Error refreshing access token:', error);
    }
  };
  const refreshRecentlyPlayed = async topInfo => {
    try {
      const userId = await get('@user_id');
      const userRef = doc(DB_FIREBASE, 'users', userId);
      console.log('Updating user recently played songs');
      console.log('topInfo', topInfo);
      console.log('userRef', userRef);
      console.log(
        'topInfo.mostRecentlyPlayedSong',
        topInfo.mostRecentlyPlayedSong,
      );
      console.log('topInfo.recentlyPlayedSongs', topInfo.recentlyPlayedSongs);
      await updateDoc(userRef, {
        mostRecentlyPlayedSong: topInfo.mostRecentlyPlayedSong,
        recentlyPlayedSongs: topInfo.recentlyPlayedSongs,
        top6TracksShortTerm: topInfo.top6TracksShortTerm,
      });
      console.log('Updated successfully');
    } catch (error) {
      console.error('Error refreshing access token:', error);
    }
  };
  const SongsDatabase = async extractedSongs => {
    console.log('SongsDatabase Update');
    const songsRef = collection(DB_FIREBASE, 'songs');
    extractedSongs.forEach(async song => {
      if (song.trackID) {
        //await setDoc(doc(songsRef, song.trackID), song);
      }
    });
  };
  const renderVibeWithFriends = () => {
    if (friendsRecentPlays.length === 0) {
      return (
        <View
          style={{
            padding: 20,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.tabBar,
            borderRadius: 15,
          }}>
          <Text
            style={{
              fontSize: 14,
              color: COLORS.text,
              textAlign: 'center',
            }}>
            You don't have any friends yet. Add some friends to see what they're
            listening to!
          </Text>
        </View>
      );
    }
    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          paddingHorizontal: 8,
        }}>
        {friendsRecentPlays.map((song, index) => (
          <Bar
            key={song.username}
            title={song.mostRecentlyPlayedSong.name}
            artist={song.mostRecentlyPlayedSong.artist}
            album={song.mostRecentlyPlayedSong.albumName}
            imageUrl={song.mostRecentlyPlayedSong.albumImage}
            previewURL={song.mostRecentlyPlayedSong.previewURL}
            currentSound={currentSound}
            setCurrentSound={setCurrentSound}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            username={song.username}
            name={song.name}
            trackID={song.mostRecentlyPlayedSong.trackID}
            authCode={token}
          />
        ))}
      </View>
    );
  };
  const uniqueRecentlyPlayedSongs = recentlyPlayedSongs
    .map(song => song.id)
    .filter((id, index, array) => array.indexOf(id) === index)
    .map(id => recentlyPlayedSongs.find(song => song.id === id));
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
              authCode={token}
              trackID={song.id}
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
              authCode={token}
              trackID={song.id}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Continue Listening</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {uniqueRecentlyPlayedSongs.map((song, index) => (
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
              authCode={token}
              trackID={song.id}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your friends are listening</Text>
        {renderVibeWithFriends()}
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
              authCode={token}
              trackID={song.id}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeView;
