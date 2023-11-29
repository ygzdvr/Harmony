export async function CheckLiked(code, trackIDs) {
  try {
    const trackIDsParam = trackIDs.join(',');
    const response = await fetch(
      `https://api.spotify.com/v1/me/tracks/contains?ids=${encodeURIComponent(
        trackIDsParam,
      )}`,
      {
        method: 'GET',
        headers: {Authorization: `Bearer ${code}`},
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error in CheckLiked function:', error);
    return [];
  }
}
