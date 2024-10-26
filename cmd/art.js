const axios = require('axios');
const fs = require('fs');
const path = require('path');
const api = require('../jubiar-pagebot-api/sendmessage');

module.exports = {
    name: 'art',
    description: 'Generates and sends an art image based on the user prompt in the format "art {your prompt}".',

    async execute(senderId, messageText) {
        try {
            if (!messageText.startsWith('art ')) {
                await api.sendMessage(senderId, { text: 'Invalid format. Use: art {your prompt}' });
                return;
            }

            const userInput = messageText.slice(4).trim();
            await api.sendMessage(senderId, { text: 'Creating your art, please wait...' });

            // API URL for image generation
            const imageUrl = `https://joshweb.click/api/art?prompt=${encodeURIComponent(userInput)}`;

            // Download the image from the API
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const imageBuffer = Buffer.from(response.data, 'binary');

            // Define a temporary file path
            const filePath = path.join(__dirname, `${senderId}_art_image.jpg`);
            fs.writeFileSync(filePath, imageBuffer);

            // Send the image as an attachment
            await api.sendMessage(senderId, {
                attachment: {
                    type: 'image',
                    payload: {
                        url: `data:image/jpeg;base64,${imageBuffer.toString('base64')}`,
                        is_reusable: true
                    }
                }
            });

            // Clean up the temporary file after sending
            fs.unlinkSync(filePath);
        } catch (error) {
            console.error(`Error executing ${this.name} command:`, error);
            await api.sendMessage(senderId, { text: 'An error occurred while generating your art image.' });
        }
    },
};
