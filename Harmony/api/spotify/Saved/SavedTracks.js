export async function SavedTracks(code, limit) {
  const result = await fetch(
    `https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=0`,
    {
      method: 'GET',
      headers: {Authorization: `Bearer ${code}`},
    },
  );
  console.log(await result.json());
}
