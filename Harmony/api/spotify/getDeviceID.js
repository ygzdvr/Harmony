export async function getDeviceID(code) {
  try {
    const response = await fetch(
      'https://api.spotify.com/v1/me/player/devices',
      {
        method: 'GET',
        headers: {Authorization: `Bearer ${code}`},
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('result', result);

    const smartphone = result.devices.find(
      device => device.type === 'Smartphone',
    );
    return smartphone ? smartphone.id : null;
  } catch (error) {
    console.error('Error in getDeviceID function:', error);
    return null;
  }
}
