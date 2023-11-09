export async function Playlists(code) {
  const result = await fetch(
    'https://api.spotify.com/v1/me/playlists?limit=50&offset=0',
    {
      method: 'GET',
      headers: {Authorization: `Bearer ${code}`},
    },
  );
  return await result.json();
}
