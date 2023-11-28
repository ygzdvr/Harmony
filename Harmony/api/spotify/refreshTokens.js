import {get} from '../util/get';
import {put} from '../util/put';
export const refreshTokens = async () => {
  try {
    const credsB64 =
      'MDBhNjdjYTM2OWQyNGE3ZWJiZGQwMWVhMmY0YWU0Zjg6YTgwMjAxZDVlZDcwNDk0MDk0YTkwNzU2ZjZmOGNjNTI=';
    const refreshToken = await get('@refresh_token');
    const aux = await get('@access_token');
    console.log('refreshToken', refreshToken);
    console.log('old access token', aux);
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credsB64}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    });
    const responseJson = await response.json();
    if (responseJson.error) {
      console.error(responseJson.error);
    } else {
      const {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        expires_in: expiresIn,
      } = responseJson;

      const expirationTime = new Date().getTime() + expiresIn * 1000;
      await put('@access_token', newAccessToken);
      if (newRefreshToken) {
        await put('@refresh_token', newRefreshToken);
      }
      console.log('new access token', newAccessToken);
      return newAccessToken;
    }
  } catch (err) {
    console.error(err);
  }
};
