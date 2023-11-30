import {fetchProfile} from './Profile';
import {Playlists} from './Playlists';
import {
  TopArtistsShortTerm,
  TopArtistsMediumTerm,
  TopArtistsLongTerm,
} from './TopArtists';
import {
  TopTracksShortTerm,
  TopTracksMediumTerm,
  TopTracksLongTerm,
} from './TopTracks';
import {History} from './History';
import {SavedAlbums} from './Saved/SavedAlbums';
import {SavedTracks} from './Saved/SavedTracks';

const fetchAudioFeatures = async (accessToken, trackIDs) => {
  const url = `https://api.spotify.com/v1/audio-features?ids=${trackIDs}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {Authorization: `Bearer ${accessToken}`},
  });
  const data = await response.json();
  return data.audio_features || []; // Array of audio features objects
};
const extractSongInfo = async data => {
  const allTracks = [
    ...data.topTracksShortTerm.items,
    ...data.topTracksMediumTerm.items,
    ...data.topTracksLongTerm.items,
    ...data.history.items.map(item => item.track),
    ...data.savedTracks.items.map(item => item.track),
  ];

  // Remove duplicate tracks
  const uniqueTracks = Array.from(
    new Set(allTracks.map(track => track.id)),
  ).map(id => allTracks.find(track => track.id === id));

  // Split unique track IDs into batches of 100
  const trackIDBatches = [];
  for (let i = 0; i < uniqueTracks.length; i += 100) {
    trackIDBatches.push(uniqueTracks.slice(i, i + 100).map(track => track.id));
  }

  // Fetch audio features for each batch and flatten the results
  const audioFeatures = (
    await Promise.all(
      trackIDBatches.map(ids =>
        fetchAudioFeatures(data.access_token, ids.join(',')),
      ),
    )
  ).flat();

  // Map audio features to track IDs
  const audioFeaturesMap = audioFeatures.reduce((acc, feature) => {
    acc[feature.id] = feature;
    return acc;
  }, {});

  const extractTrackInfo = track => {
    const features = audioFeaturesMap[track.id];
    return {
      name: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      artistID: track.artists.map(artist => artist.id).join(', '),
      albumName: track.album.name,
      albumImage: track.album.images[0]?.url,
      popularity: track.popularity,
      previewURL: track.preview_url,
      trackID: track.id,
      // Add the audio features
      acousticness: features?.acousticness,
      danceability: features?.danceability,
      energy: features?.energy,
      instrumentalness: features?.instrumentalness,
      liveness: features?.liveness,
      loudness: features?.loudness,
      speechiness: features?.speechiness,
      tempo: features?.tempo,
      valence: features?.valence,
    };
  };

  return uniqueTracks.map(extractTrackInfo);
};

export const SONGS = async access_token => {
  const playlists = await Playlists(access_token);
  const topTracksShortTerm = await TopTracksShortTerm(access_token, 50);
  const topTracksMediumTerm = await TopTracksMediumTerm(access_token, 50);
  const topTracksLongTerm = await TopTracksLongTerm(access_token, 50);
  const topArtistsShortTerm = await TopArtistsShortTerm(access_token, 50);
  const topArtistsMediumTerm = await TopArtistsMediumTerm(access_token, 50);
  const topArtistsLongTerm = await TopArtistsLongTerm(access_token, 50);
  const history = await History(access_token, 50);
  const savedAlbums = await SavedAlbums(access_token, 50);
  const savedTracks = await SavedTracks(access_token, 50);

  const data = {
    access_token,
    playlists,
    topArtistsShortTerm,
    topArtistsMediumTerm,
    topArtistsLongTerm,
    topTracksShortTerm,
    topTracksMediumTerm,
    topTracksLongTerm,
    history,
    savedAlbums,
    savedTracks,
  };
  const extractedInfo = extractSongInfo(data);
  return extractedInfo;
};
