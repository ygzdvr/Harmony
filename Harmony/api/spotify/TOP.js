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

const extractInfo = data => {
  const extractedInfo = {
    profileInfo: {
      displayName: data.profile.display_name,
      followers: data.profile.followers.total,
    },

    TopArtistsShortTerm: data.topArtistsShortTerm.items.map(artist => ({
      name: artist.name,
      genre: artist.genres,
      popularity: artist.popularity,
    })),

    TopArtistsMediumTerm: data.topArtistsMediumTerm.items.map(artist => ({
      name: artist.name,
      genre: artist.genres,
      popularity: artist.popularity,
    })),

    TopArtistsLongTerm: data.topArtistsLongTerm.items.map(artist => ({
      name: artist.name,
      genre: artist.genres,
      popularity: artist.popularity,
    })),

    TopTracksShortTerm: data.topTracksShortTerm.items.map(track => ({
      name: track.name,
      popularity: track.popularity,
      artist: track.artists.map(artist => artist.name),
      albumName: track.album.name,
    })),

    TopTracksMediumTerm: data.topTracksMediumTerm.items.map(track => ({
      name: track.name,
      popularity: track.popularity,
      artist: track.artists.map(artist => artist.name),
      albumName: track.album.name,
    })),

    TopTracksLongTerm: data.topTracksLongTerm.items.map(track => ({
      name: track.name,
      popularity: track.popularity,
      artist: track.artists.map(artist => artist.name),
      albumName: track.album.name,
    })),
    RecentlyPlayed: data.history.items.map(track => ({
      name: track.track.name,
      popularity: track.track.popularity,
      artist: track.track.artists.map(artist => artist.name),
      albumName: track.track.album.name,
    })),
    SavedAlbums: data.savedAlbums.items.map(album => ({
      name: album.album.name,
      artist: album.album.artists.map(artist => artist.name),
    })),
    SavedTracks: data.savedTracks.items.map(track => ({
      name: track.track.name,
      popularity: track.track.popularity,
      artist: track.track.artists.map(artist => artist.name),
      albumName: track.track.album.name,
    })),
  };
  return extractedInfo;
};

export const SPOTIFY = async access_token => {
  console.log('access_token', access_token);
  const topArtistsShortTerm = await TopArtistsShortTerm(access_token, 1);
  const topArtistsMediumTerm = await TopArtistsMediumTerm(access_token, 1);
  const topArtistsLongTerm = await TopArtistsLongTerm(access_token, 1);
  const topTracksShortTerm = await TopTracksShortTerm(access_token, 1);
  const topTracksMediumTerm = await TopTracksMediumTerm(access_token, 1);
  const topTracksLongTerm = await TopTracksLongTerm(access_token, 1);
  const history = await History(access_token, 1);

  const data = {
    access_token,
    topArtistsShortTerm,
    topArtistsMediumTerm,
    topArtistsLongTerm,
    topTracksShortTerm,
    topTracksMediumTerm,
    topTracksLongTerm,
    history,
  };
  const fetchTopInfo = extractInfo(data);

  return extractedInfo;
};
