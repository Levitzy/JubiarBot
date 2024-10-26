const axios = require('axios');
const fs = require('fs');
const api = require('../jubiar-pagebot-api/sendmessage');

module.exports = {
    name: 'art',
    description: 'Fetches an AI-generated image based on the prompt in the format "art {prompt}".',

    async execute(senderId, messageText) {
        try {
            if (!messageText.startsWith('art ')) {
                await api.sendMessage(senderId, { text: 'Invalid format. Use: art {your prompt}' });
                return;
            }

            const userInput = messageText.slice(4).trim();
            await api.sendMessage(senderId, { text: 'Creating your art piece, please wait...' });

            // API URL for the art generation
            const url = `https://joshweb.click/api/art?prompt=${encodeURIComponent(userInput)}`;

            // Download the image
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            const imageBuffer = Buffer.from(response.data, 'binary');

            // Send the image directly to the user
            await api.sendMessage(senderId, {
                attachment: {
                    type: 'image',
                    payload: {
                        is_reusable: true
                    }
                },
                filedata: imageBuffer // Directly send image buffer
            });

        } catch (error) {
            console.error(`Error executing ${this.name} command:`, error);
            await api.sendMessage(senderId, { text: 'An error occurred while processing your art request.' });
        }
    },
};
