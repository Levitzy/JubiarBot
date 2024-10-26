const axios = require('axios');
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

            // Attempt to retrieve the image URL directly
            const response = await axios.get(imageUrl, { responseType: 'json' });

            if (response.data && response.data.imageUrl) {
                // Send the image URL directly to the user
                await api.sendMessage(senderId, {
                    attachment: {
                        type: 'image',
                        payload: {
                            url: response.data.imageUrl, // Assuming API returns a direct image URL here
                            is_reusable: true
                        }
                    }
                });
            } else {
                await api.sendMessage(senderId, { text: 'No valid image was returned from the art generation service.' });
            }
        } catch (error) {
            console.error(`Error executing ${this.name} command:`, error);
            await api.sendMessage(senderId, { text: 'An error occurred while generating your art image.' });
        }
    },
};
