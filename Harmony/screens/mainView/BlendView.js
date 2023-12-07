import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Image, Alert} from 'react-native';
import axios from 'axios';
import COLORS from '../../constants/colors';
import BlendStyles from '../../constants/styles/BlendStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ScrollView, TouchableOpacity} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {DB_FIREBASE, STORAGE} from '../../api/firebase/firebase';
import GradientText from '../../components/GradientText';
import {get} from '../../api/util/get';
import {ref, getDownloadURL} from 'firebase/storage';
import {playTrack} from '../../api/spotify/playTrack';
import {getDeviceID} from '../../api/spotify/getDeviceID';
import {LinearGradient} from 'react-native-linear-gradient';
import Tile from '../../partials/home/Tile';
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  deleteField,
  arrayUnion,
  arrayRemove,
  updateDoc,
  serverTimestamp,
  runTransaction,
} from 'firebase/firestore';
import {Pinecone} from '@pinecone-database/pinecone';
const pinecone = new Pinecone({
  environment: 'us-west1-gcp',
  apiKey: '1eb47e0b-06bb-4b48-b1a1-152c4bedd031',
});
const BlendView = ({navigation}) => {
  const route = useRoute();
  const {userId1, userId2, authCode} = route.params;
  const [user1Data, setUser1Data] = useState(null);
  const [user2Data, setUser2Data] = useState(null);
  const [harmonyScore, setHarmonyScore] = useState(null);
  const [topSongs, setTopSongs] = useState([]);
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  function averageVectors(vector1, vector2) {
    console.log('averageVectors started now');
    const length = vector1.length;
    const avgVector = new Array(length).fill(0);
    for (let i = 0; i < length; i++) {
      avgVector[i] = (vector1[i] + vector2[i]) / 2;
    }
    console.log('averageVectors finished');
    return avgVector;
  }

  const fetchSongsFromFirebase = async songIds => {
    console.log('fetchSongsFromFirebase', songIds);
    const songsRef = collection(DB_FIREBASE, 'songs');
    const songs = [];
    for (const id of songIds) {
      const songDocRef = doc(songsRef, id);
      const songDoc = await getDoc(songDocRef);
      if (songDoc.exists()) {
        songs.push({id: songDoc.id, ...songDoc.data()});
      }
    }
    console.log('songs', songs);
    console.log('fetchSongsFromFirebase finished');
    return songs;
  };

  useEffect(() => {
    const fetchUserData = async (userId, setUser) => {
      const userRef = doc(DB_FIREBASE, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const profilePictureUrl = await getDownloadURL(
          ref(STORAGE, `profilePhotos/${userId}`),
        );
        setUser({...userSnap.data(), photoUrl: profilePictureUrl});
      }
    };
    async function fetchUserVector2(userId, pineconeIndex) {
      console.log('fetchUserVector2', userId);
      try {
        const fetchResult = await pineconeIndex.fetch([userId]);
        return fetchResult.records[userId]?.values;
      } catch (error) {
        console.error('Error fetching user vector:', error);
        return null;
      }
    }
    const fetchHarmonyScore = async () => {
      console.log('fetchHarmonyScore');

      const pineconeIndex = pinecone.index('harmony-users');
      const userVector1 = await fetchUserVector2(userId1, pineconeIndex);
      if (userVector1) {
        console.log('userVector1 fetched');
        const queryResult = await pineconeIndex.query({
          vector: userVector1,
          topK: 10,
          includeMetadata: true,
        });

        // Find the matching score with userId2
        const matchScore = queryResult.matches.find(
          match => match.id === userId2,
        )?.score;
        if (matchScore !== undefined) {
          console.log('matchScore', matchScore);
          setHarmonyScore(matchScore);
        }
      }
    };

    const fetchTopSongsForBlend = async () => {
      console.log('fetchTopSongsForBlend started');
      const pineconeIndex = pinecone.index('harmony-users');
      const pineconeSongIndex = pinecone.index('harmony-songs');
      const userVector1 = await fetchUserVector2(userId1, pineconeIndex);
      const userVector2 = await fetchUserVector2(userId2, pineconeIndex);
      if (userVector1 && userVector2) {
        console.log('userVector1 and userVector2 fetched');
        const averageVector = averageVectors(userVector1, userVector2);
        const queryResult = await pineconeSongIndex.query({
          vector: averageVector,
          topK: 10,
        });

        const songIds = queryResult.matches.map(match => match.id);
        const songs = await fetchSongsFromFirebase(songIds);
        setTopSongs(songs);
        console.log('fetchTopSongsForBlend finished');
      }
    };

    fetchUserData(userId1, setUser1Data);
    fetchUserData(userId2, setUser2Data);
    fetchHarmonyScore();
    fetchTopSongsForBlend();
  }, [userId1, userId2]);

  const renderTopSongs = () => {
    console.log('authCode', authCode);
    console.log('render topSongs', topSongs);
    return topSongs.map((song, index) => (
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
        authCode={authCode}
        trackID={song.id}
      />
    ));
  };

  return (
    <ScrollView style={BlendStyles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={BlendStyles.backButton}>
        <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
      </TouchableOpacity>
      <View style={BlendStyles.cardContainer}>
        <Text style={BlendStyles.titleText}>Generate Harmony</Text>
        <View style={styles.userContainer}>
          <View style={styles.userColumn}>
            {user1Data && (
              <>
                <Image
                  source={{uri: user1Data.photoUrl}}
                  style={styles.profilePhoto}
                />
                <Text style={BlendStyles.nameText}>{user1Data.name}</Text>
                <GradientText style={BlendStyles.infoText}>
                  @{user1Data.username}
                </GradientText>
              </>
            )}
          </View>
          <View style={styles.userColumn}>
            {user2Data && (
              <>
                <Image
                  source={{uri: user2Data.photoUrl}}
                  style={styles.profilePhoto}
                />
                <Text style={BlendStyles.nameText}>{user2Data.name}</Text>
                <GradientText style={BlendStyles.infoText}>
                  @{user2Data.username}
                </GradientText>
              </>
            )}
          </View>
        </View>
      </View>
      <View style={styles.harmonyScoreContainer}>
        <Text style={styles.scoreTitle}>Your Harmony Similarity Result</Text>
        {harmonyScore !== null && (
          <GradientText style={styles.score}>
            {harmonyScore.toFixed(3) * 100}%
          </GradientText>
        )}
      </View>
      <View style={styles.topSongsContainer}>
        <Text style={styles.topSongsTitle}>Top Songs For Your Blend</Text>
        {renderTopSongs()}
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
  },
  userColumn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  harmonyScoreContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -20,
  },
  harmonyScoreText: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  scoreTitle: {
    fontSize: 18,
    color: COLORS.text,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  score: {
    fontSize: 30,
    color: COLORS.text,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  topSongsContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topSongsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.text,
    paddingBottom: 10,
  },
  songContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  songTitle: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  songArtist: {
    fontSize: 14,
  },
});
export default BlendView;
