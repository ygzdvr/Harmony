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

const fetchTopInfo = data => {
  return {
    topArtistShortTerm: {
      name: data.topArtistsShortTerm.items[0]?.name,
      genres: data.topArtistsShortTerm.items[0]?.genres,
    },
    topArtistMediumTerm: {
      name: data.topArtistsMediumTerm.items[0]?.name,
      genres: data.topArtistsMediumTerm.items[0]?.genres,
    },
    topArtistLongTerm: {
      name: data.topArtistsLongTerm.items[0]?.name,
      genres: data.topArtistsLongTerm.items[0]?.genres,
    },
    topTrackShortTerm: data.topTracksShortTerm.items[0]?.id,
    topTrackMediumTerm: data.topTracksMediumTerm.items[0]?.id,
    topTrackLongTerm: data.topTracksLongTerm.items[0]?.id,
    mostRecentlyPlayedSong: data.history.items[0]?.track?.id,
    recentlyPlayedSongs: data.history.items.map(item => item.track.id),
    top6TracksShortTerm: data.top6.items.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      album: track.album.name,
      albumImage: track.album.images[0]?.url,
      previewURL: track.preview_url,
    })),
  };
};

export const TOP = async access_token => {
  const topArtistsShortTerm = await TopArtistsShortTerm(access_token, 1);
  const topArtistsMediumTerm = await TopArtistsMediumTerm(access_token, 1);
  const topArtistsLongTerm = await TopArtistsLongTerm(access_token, 1);
  const topTracksShortTerm = await TopTracksShortTerm(access_token, 1);
  const topTracksMediumTerm = await TopTracksMediumTerm(access_token, 1);
  const topTracksLongTerm = await TopTracksLongTerm(access_token, 1);
  const history = await History(access_token, 10);
  const top6 = await TopTracksShortTerm(access_token, 6);

  const data = {
    access_token,
    topArtistsShortTerm,
    topArtistsMediumTerm,
    topArtistsLongTerm,
    topTracksShortTerm,
    topTracksMediumTerm,
    topTracksLongTerm,
    history,
    top6,
  };
  const TopInfo = fetchTopInfo(data);

  return TopInfo;
};
