export async function TopArtistsShortTerm(code) {
  const result = await fetch(
    'https://api.spotify.com/v1/me/tracks?limit=50&offset=0',
    {
      method: 'GET',
      headers: {Authorization: `Bearer ${code}`},
    },
  );
  return await result.json();
}
