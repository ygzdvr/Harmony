export async function playTrack(deviceID, code, trackID) {
  try {
    const trackURI = `spotify:track:${trackID}`;

    const data = {
      uris: [trackURI],
      position_ms: 0,
    };

    const response = await fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${deviceID}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${code}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('Track played successfully');
  } catch (error) {
    console.error('Error in playTrack function:', error);
  }
}
