export async function SavedShows(code) {
  const result = await fetch(
    'https://api.spotify.com/v1/me/shows?limit=50&offset=0',
    {
      method: 'GET',
      headers: {Authorization: `Bearer ${code}`},
    },
  );
  return await result.json();
}
