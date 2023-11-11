import { OpenAI } from 'openai';

// Load your API key from an environment variable or secret management service
const openai = new OpenAI({
  apiKey: "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",
});

// Function to read and analyze a JSON file
export async function analyzeJSONFile(data) {
  try {
    // Read the JSON file

    // Process and analyze the data using OpenAI
    const response = await openai.completions.create({
      model: "text-davinci-003", // or another model of your choice
      temperature: 0.7,
      prompt: "Imagine you have the following music preferences, analyze this data and generate a text representing your preferences " + JSON.stringify(data),
      max_tokens: 1300
    });

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      console.log(response.data.choices[0].text);
    } else {
      console.log('Unexpected response structure:', response.choices[0].text);
    }
  } catch (error) {
    console.error('Error in API request:', error);
  }
}
const example_JSON = {
  "squadName": "Super hero squad",
  "homeTown": "Metro City",
  "formed": 2016,
  "secretBase": "Super tower",
  "active": true,
  "members": [
    {
      "name": "Molecule Man",
      "age": 29,
      "secretIdentity": "Dan Jukes",
      "powers": ["Radiation resistance", "Turning tiny", "Radiation blast"]
    },
    {
      "name": "Madame Uppercut",
      "age": 39,
      "secretIdentity": "Jane Wilson",
      "powers": [
        "Million tonne punch",
        "Damage resistance",
        "Superhuman reflexes"
      ]
    },
    {
      "name": "Eternal Flame",
      "age": 1000000,
      "secretIdentity": "Unknown",
      "powers": [
        "Immortality",
        "Heat Immunity",
        "Inferno",
        "Teleportation",
        "Interdimensional travel"
      ]
    }
  ]
}

analyzeJSONFile(example_JSON)
