export async function History(code) {
  const result = await fetch(
    'https://api.spotify.com/v1/me/player/recently-played?limit=50',
    {
      method: 'GET',
      headers: {Authorization: `Bearer ${code}`},
    },
  );
  return await result.json();
}
