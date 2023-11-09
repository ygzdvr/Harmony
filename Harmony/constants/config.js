const SPOTIFY_CONFIG = {
  CLIENT_ID: '00a67ca369d24a7ebbdd01ea2f4ae4f8',
  CLIENT_SECRET: 'a80201d5ed70494094a90756f6f8cc52',
  SCOPE: [
    'user-top-read',
    'user-library-read',
    'user-read-playback-position',
    'playlist-read-private',
    'user-read-recently-played',
  ],
  TOKEN_URL: 'https://accounts.spotify.com/api/token',
  AUTH_URL: 'https://accounts.spotify.com/authorize',
  REDIRECT_URI: 'exp://127.0.0.1:19000/',
};

export default SPOTIFY_CONFIG;
