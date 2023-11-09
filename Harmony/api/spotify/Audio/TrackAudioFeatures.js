export async function TrackAudioFeatures(code, trackID) {
  const result = await fetch(
    'https://api.spotify.com/v1/audio-features/${trackID}',
    {
      method: 'GET',
      headers: {Authorization: `Bearer ${code}`},
    },
  );
  return await result.json();
}
