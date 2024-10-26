const axios = require('axios');
const fs = require('fs');
const fsp = require('fs').promises;
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
            const imagePath = `art_${Date.now()}.jpg`;

            // Write the image to a temporary file
            await fsp.writeFile(imagePath, response.data);

            // Send the downloaded image to the user
            await api.sendMessage(senderId, {
                attachment: {
                    type: 'image',
                    payload: {}
                },
                filedata: fs.createReadStream(imagePath) // Corrected to use fs.createReadStream
            });

            // Clean up the file after sending
            await fsp.unlink(imagePath);

        } catch (error) {
            console.error(`Error executing ${this.name} command:`, error);
            await api.sendMessage(senderId, { text: 'An error occurred while processing your art request.' });
        }
    },
};
