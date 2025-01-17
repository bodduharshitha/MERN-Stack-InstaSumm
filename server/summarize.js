const axios = require('axios');

async function summarizeText(text) {
  if (typeof text !== 'string' || !text.trim()) {
    throw new Error('Input text must be a non-empty string');
  }

  const options = {
    method: 'POST',
    url: 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
    headers: {
      Authorization: `Bearer API_KEY`, // Use your Hugging Face API key
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({ inputs: text }),
  };

  try {
    const response = await axios.request(options);
    console.log('API response:', response.data);

    if (response.data && response.data[0] && response.data[0].summary_text) {
      return response.data[0].summary_text;
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (error) {
    console.error('Error making API request:', error.response ? error.response.data : error.message);
    throw new Error('Failed to summarize text');
  }
}

module.exports = summarizeText;
