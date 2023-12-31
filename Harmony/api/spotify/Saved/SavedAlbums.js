export async function SavedAlbums(code, limit) {
  const result = await fetch(
    `https://api.spotify.com/v1/me/albums?limit=${limit}&offset=0`,
    {
      method: 'GET',
      headers: {Authorization: `Bearer ${code}`},
    },
  );
  return await result.json();
}
