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

import {TrackAudioFeatures} from './Audio/TrackAudioFeatures';

const extractInfo = data => {
  const extractedInfo = {
    profileInfo: {
      displayName: data.profile.display_name,
      followers: data.profile.followers.total,
      type: data.profile.type,
      id: data.profile.id,
    },

    TopArtistsShortTerm: data.topArtistsShortTerm.items.map(artist => ({
      name: artist.name,
      genre: artist.genres,
      popularity: artist.popularity,
      type: artist.type,
      id: artist.id,
    })),

    TopArtistsMediumTerm: data.topArtistsMediumTerm.items.map(artist => ({
      name: artist.name,
      genre: artist.genres,
      popularity: artist.popularity,
      type: artist.type,
      id: artist.id,
    })),

    TopArtistsLongTerm: data.topArtistsLongTerm.items.map(artist => ({
      name: artist.name,
      genre: artist.genres,
      popularity: artist.popularity,
      type: artist.type,
      id: artist.id,
    })),

    TopTracksShortTerm: data.topTracksShortTerm.items.map(track => ({
      name: track.name,
      popularity: track.popularity,
      artist: track.artists.map(artist => artist.name),
      albumName: track.album.name,
      duration: track.duration_ms,
      type: track.type,
      id: track.id,
    })),

    TopTracksMediumTerm: data.topTracksMediumTerm.items.map(track => ({
      name: track.name,
      popularity: track.popularity,
      artist: track.artists.map(artist => artist.name),
      albumName: track.album.name,
      duration: track.duration_ms,
      type: track.type,
      id: track.id,
    })),

    TopTracksLongTerm: data.topTracksLongTerm.items.map(track => ({
      name: track.name,
      popularity: track.popularity,
      artist: track.artists.map(artist => artist.name),
      albumName: track.album.name,
      duration: track.duration_ms,
      type: track.type,
      id: track.id,
    })),
    RecentlyPlayed: data.history.items.map(track => ({
      name: track.track.name,
      popularity: track.track.popularity,
      artist: track.track.artists.map(artist => artist.name),
      albumName: track.track.album.name,
      duration: track.track.duration_ms,
      type: track.track.type,
      id: track.track.id,
    })),
    SavedAlbums: data.savedAlbums.items.map(album => ({
      name: album.album.name,
      artist: album.album.artists.map(artist => artist.name),
      releaseDate: album.album.release_date,
      type: album.album.type,
      id: album.album.id,
    })),
    SavedTracks: data.savedTracks.items.map(track => ({
      name: track.track.name,
      popularity: track.track.popularity,
      artist: track.track.artists.map(artist => artist.name),
      albumName: track.track.album.name,
      duration: track.track.duration_ms,
      type: track.track.type,
      id: track.track.id,
    })),
    SavedEpisodes: data.savedEpisodes.items.map(episode => ({
      name: episode.episode.name,
      releaseDate: episode.episode.release_date,
      duration: episode.episode.duration_ms,
      type: episode.episode.type,
      id: episode.episode.id,
    })),
  };
  return extractedInfo;
};

export const SPOTIFY = async access_token => {
  const profile = await fetchProfile(access_token);
  const playlists = await Playlists(access_token);
  const topArtistsShortTerm = await TopArtistsShortTerm(access_token);
  const topArtistsMediumTerm = await TopArtistsMediumTerm(access_token);
  const topArtistsLongTerm = await TopArtistsLongTerm(access_token);
  const topTracksShortTerm = await TopTracksShortTerm(access_token);
  const topTracksMediumTerm = await TopTracksMediumTerm(access_token);
  const topTracksLongTerm = await TopTracksLongTerm(access_token);
  const history = await History(access_token);
  const savedAlbums = await SavedAlbums(access_token);
  const savedTracks = await SavedTracks(access_token);
  const savedShows = await SavedShows(access_token);
  const savedEpisodes = await SavedEpisodes(access_token);

  const data = {
    access_token,
    profile,
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
  const extractedInfo = extractInfo(data);

  return extractedInfo;
};
