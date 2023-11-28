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
import {SavedShows} from './Saved/SavedShows';
import {SavedEpisodes} from './Saved/SavedEpisodes';
import {TopTracksArtist} from './TopTracksArtist';
import {TrackAudioFeatures} from './Audio/TrackAudioFeatures';

const extractSongInfo = async data => {
  console.log('extractSongInfo');
  const extractTrackInfo = async track => {
    console.log('extractTrackInfo');
    const audioFeatures = await TrackAudioFeatures(data.access_token, track.id);
    console.log('audioFeatures', audioFeatures);
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
      acousticness: audioFeatures.acousticness,
      danceability: audioFeatures.danceability,
      energy: audioFeatures.energy,
      instrumentalness: audioFeatures.instrumentalness,
      liveness: audioFeatures.liveness,
      loudness: audioFeatures.loudness,
      speechiness: audioFeatures.speechiness,
      tempo: audioFeatures.tempo,
      valence: audioFeatures.valence,
    };
  };

  const combinedTracksPromises = [
    ...data.topTracksShortTerm.items.map(extractTrackInfo),
    ...data.topTracksMediumTerm.items.map(extractTrackInfo),
    ...data.topTracksLongTerm.items.map(extractTrackInfo),
    ...data.history.items.map(item => extractTrackInfo(item.track)),
    ...data.savedTracks.items.map(item => extractTrackInfo(item.track)),
  ];

  const combinedTracks = await Promise.all(combinedTracksPromises);

  const trackSet = new Set();
  const uniqueTracks = combinedTracks.filter(track => {
    const duplicate = trackSet.has(track.trackID);
    trackSet.add(track.trackID);
    return !duplicate;
  });

  return uniqueTracks;
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
  const savedShows = await SavedShows(access_token);
  const savedEpisodes = await SavedEpisodes(access_token);

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
    savedShows,
    savedEpisodes,
  };
  const extractedInfo = extractSongInfo(data);
  return extractedInfo;
};
