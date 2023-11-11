export async function TopTracksShortTerm(code) {
  const result = await fetch(
    'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10&offset=0',
    {
      method: 'GET',
      headers: {Authorization: `Bearer ${code}`},
    },
  );
  return await result.json();
}

export async function TopTracksMediumTerm(code) {
  const result = await fetch(
    'https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=10&offset=0',
    {
      method: 'GET',
      headers: {Authorization: `Bearer ${code}`},
    },
  );
  return await result.json();
}

export async function TopTracksLongTerm(code) {
  const result = await fetch(
    'https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=10&offset=0',
    {
      method: 'GET',
      headers: {Authorization: `Bearer ${code}`},
    },
  );
  return await result.json();
}
