const axios = require('axios');
const api = require('../jubiar-pagebot-api/sendmessage');

module.exports = {
    name: 'aimusic',
    description: 'Fetches AI-generated music based on the prompt in the format "aimusic {prompt}".',

    async execute(senderId, messageText) {
        try {
            if (!messageText.startsWith('aimusic ')) {
                await api.sendMessage(senderId, { text: 'Invalid format. Use: aimusic {your prompt}' });
                return;
            }

            const userInput = messageText.slice(8).trim();
            await api.sendMessage(senderId, { text: 'Creating your music, please wait...' });

            // API URL for music generation
            const url = `https://joshweb.click/api/aimusic?prompt=${encodeURIComponent(userInput)}`;

            // Fetch the audio URL from the API response
            const response = await axios.get(url);
            const audioUrl = response.data.audio;

            // Check if audio URL is available
            if (!audioUrl) {
                await api.sendMessage(senderId, { text: 'No audio was generated for this prompt.' });
                return;
            }

            // Send the audio file directly as an attachment
            await api.sendMessage(senderId, {
                attachment: {
                    type: "audio",
                    payload: {
                        url: audioUrl,
                        is_reusable: true
                    }
                }
            });

        } catch (error) {
            console.error(`Error executing ${this.name} command:`, error);
            await api.sendMessage(senderId, { text: 'An error occurred while processing your music request.' });
        }
    },
};
