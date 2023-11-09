export async function fetchProfile(code) {
  const result = await fetch('https://api.spotify.com/v1/me', {
    method: 'GET',
    headers: {Authorization: `Bearer ${code}`},
  });

  return await result.json();
}
