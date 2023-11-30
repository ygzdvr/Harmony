export async function textify(data) {
  try {
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization:
          'Bearer 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',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo-instruct',
        prompt:
          'Imagine you have the following music preferences, analyze this data and generate a text representing your preferences ' +
          JSON.stringify(data),
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });
    const json = await response.json();
    return json.choices[0].text.replace(/(\r\n|\n|\r)/gm, '');
  } catch (error) {
    console.error('this is the result', error);
  }
}

export async function textifySongs(data) {
  try {
    const prompt = `Analyze this song data and generate a text representing the features and details about the song:

    Song Name: ${data.name}
    Artist: ${data.artist}
    Album: ${data.albumName}
    Popularity: ${data.popularity}
    Preview URL: ${data.previewURL}

    Acousticness (${data.acousticness}): This represents the likelihood of the song being acoustic. A higher value suggests a more acoustic and less electronic instrumentation.

    Danceability (${data.danceability}): This score indicates how suitable the song is for dancing, considering aspects like tempo, rhythm stability, and beat strength.

    Energy (${data.energy}): This measures the intensity and activity level of the song. Higher energy indicates a faster, louder, and more upbeat track.

    Instrumentalness (${data.instrumentalness}): This predicts the absence of vocals in the track. Higher values indicate instrumental music, while lower values suggest vocal presence.

    Liveness (${data.liveness}): This indicates the presence of an audience in the recording, with higher values suggesting a live performance.

    Loudness (${data.loudness} dB): This is the overall loudness of the track in decibels, a higher value indicates a louder track.

    Speechiness (${data.speechiness}): This measures the presence of spoken words in the song. Higher values indicate more speech-like characteristics.

    Tempo (${data.tempo} BPM): This is the speed or pace of the track, measured in beats per minute.

    Valence (${data.valence}): This measures the musical positiveness conveyed by the track. Higher valence indicates a more positive, cheerful sound.

    Please generate a descriptive text analyzing these features to provide an insight into the song's character and mood.`;

    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization:
          'Bearer ',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo-instruct',
        prompt: prompt,
        max_tokens: 1000,
        temperature: 0.5,
      }),
    });
    const json = await response.json();
    return json.choices[0].text.replace(/(\r\n|\n|\r)/gm, '');
  } catch (error) {
    console.error('this is the result for the song', error);
  }
}
