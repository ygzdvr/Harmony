export async function TopArtistsShortTerm(code) {
  const result = await fetch(
    'https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=10&offset=0',
    {
      method: 'GET',
      headers: {Authorization: `Bearer ${code}`},
    },
  );
  return await result.json();
}

export async function TopArtistsMediumTerm(code) {
  const result = await fetch(
    'https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=10&offset=0',
    {
      method: 'GET',
      headers: {Authorization: `Bearer ${code}`},
    },
  );
  return await result.json();
}

export async function TopArtistsLongTerm(code) {
  const result = await fetch(
    'https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=10&offset=0',
    {
      method: 'GET',
      headers: {Authorization: `Bearer ${code}`},
    },
  );
  return await result.json();
}
