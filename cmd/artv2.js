const axios = require('axios');
const fs = require('fs');
const fsp = require('fs').promises;
const api = require('../jubiar-pagebot-api/sendmessage');

module.exports = {
    name: 'artv2',
    description: 'Fetches an AI-generated image based on the prompt in the format "artv2 {prompt}".',

    async execute(senderId, messageText) {
        try {
            if (!messageText.startsWith('artv2 ')) {
                await api.sendMessage(senderId, { text: 'Invalid format. Use: artv2 {your prompt}' });
                return;
            }

            const userInput = messageText.slice(6).trim();
            await api.sendMessage(senderId, { text: 'Creating your art piece, please wait...' });

            // API URL for the art generation with model=4
            const url = `https://joshweb.click/api/flux?prompt=${encodeURIComponent(userInput)}&model=4`;

            // Download the image
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            const imagePath = `artv2_${Date.now()}.jpg`;

            // Write the image to a temporary file
            await fsp.writeFile(imagePath, response.data);

            // Send the downloaded image to the user
            await api.sendMessage(senderId, {
                attachment: {
                    type: 'image',
                    payload: {
                        is_reusable: true
                    }
                },
                filedata: fs.createReadStream(imagePath) // Send as a file stream
            });

            // Clean up the file after sending
            await fsp.unlink(imagePath);

        } catch (error) {
            console.error(`Error executing ${this.name} command:`, error);
            await api.sendMessage(senderId, { text: 'An error occurred while processing your art request.' });
        }
    },
};
