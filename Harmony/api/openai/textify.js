export async function textify(data) {
  try {
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer `
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo-instruct",
        prompt: "Imagine you have the following music preferences, analyze this data and generate a text representing your preferences " + JSON.stringify(data),
        max_tokens: 1300,
        temperature: 0.7,
      }),
    })
    const json = await response.json();  
    return(json.choices[0].text.replace(/(\r\n|\n|\r)/gm,""))
  } catch (error) {
    console.error("this is the result", error);
  }
}

