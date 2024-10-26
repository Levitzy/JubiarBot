const axios = require('axios');
const api = require('../jubiar-pagebot-api/sendmessage');
const FormData = require('form-data'); // Import FormData to send the image

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

            // Download the image as a buffer
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const imageBuffer = Buffer.from(response.data, 'binary');

            // Create a FormData object to handle image upload
            const formData = new FormData();
            formData.append('file', imageBuffer, {
                filename: 'art_image.jpg',
                contentType: 'image/jpeg',
            });

            // Send the image to the user using api.sendMessage
            await api.sendMessage(senderId, {
                attachment: {
                    type: 'image',
                    payload: {
                        is_reusable: true
                    }
                },
                filedata: formData
            });
        } catch (error) {
            console.error(`Error executing ${this.name} command:`, error);
            await api.sendMessage(senderId, { text: 'An error occurred while generating your art image.' });
        }
    },
};
