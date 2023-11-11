export async function SavedAlbums(code) {
  const result = await fetch(
    'https://api.spotify.com/v1/me/albums?limit=10&offset=0',
    {
      method: 'GET',
      headers: {Authorization: `Bearer ${code}`},
    },
  );
  return await result.json();
}
