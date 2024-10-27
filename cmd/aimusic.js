const axios = require('axios');
const fs = require('fs');
const fsp = require('fs').promises;
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

            // Request to get the audio URL from data.audio
            const response = await axios.get(url);
            const audioUrl = response.data.audio;

            // Check if audio URL is available
            if (!audioUrl) {
                await api.sendMessage(senderId, { text: 'No audio was generated for this prompt.' });
                return;
            }

            // Download the audio file from the provided URL
            const audioResponse = await axios.get(audioUrl, { responseType: 'arraybuffer' });
            const audioPath = `aimusic_${Date.now()}.mp3`;

            // Save the audio file locally
            await fsp.writeFile(audioPath, audioResponse.data);

            // Send the downloaded audio file to the user
            await api.sendMessage(senderId, {
                attachment: {
                    type: 'audio',
                    payload: {}
                },
                filedata: fs.createReadStream(audioPath) // Send as a file stream
            });

            // Clean up the file after sending
            await fsp.unlink(audioPath);

        } catch (error) {
            console.error(`Error executing ${this.name} command:`, error);
            await api.sendMessage(senderId, { text: 'An error occurred while processing your music request.' });
        }
    },
};
