export async function TrackAudioAnalysis(code, trackID) {
  const result = await fetch(
    'https://api.spotify.com/v1/audio-analysis/${trackID}',
    {
      method: 'GET',
      headers: {Authorization: `Bearer ${code}`},
    },
  );
  return await result.json();
}
