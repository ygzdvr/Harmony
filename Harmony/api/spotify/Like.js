export async function Like(code, trackID) {
  console.log('code', code);
  console.log('trackID', trackID);
  const result = await fetch(
    `https://api.spotify.com/v1/me/tracks?ids=${trackID}`,
    {
      method: 'PUT',
      headers: {Authorization: `Bearer ${code}`},
    },
  );
  return await result.json();
}
