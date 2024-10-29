const axios = require('axios');
const api = require('../jubiar-pagebot-api/sendmessage');

module.exports = {
    name: 'npm',
    description: 'Fetches npm package details based on user input.',

    async execute(senderId, messageText) {
        try {
            // Extract the search query by removing the command keyword
            const args = messageText.split(' ').slice(1);
            if (args.length === 0) {
                await api.sendMessage(senderId, { text: 'Please specify an npm package name after the command.' });
                return;
            }

            // Fetch package data from the API
            const { data } = await axios.get(`https://api.popcat.xyz/npm?q=${encodeURIComponent(args.join(' '))}`);

            // Format the response data into a readable message
            const responseMessage = `
                Name: ${data.name || 'N/A'}
                Version: ${data.version || 'N/A'}
                Description: ${data.description || 'N/A'}
                Keywords: ${data.keywords ? data.keywords.join(', ') : 'N/A'}
                Author: ${data.author || 'N/A'}
                Author Email: ${data.author_email || 'N/A'}
                Last Published: ${data.last_published || 'N/A'}
                Maintainers: ${data.maintainers ? data.maintainers.join(', ') : 'N/A'}
                Repository: ${data.repository || 'N/A'}
            `;

            // Send the formatted message
            await api.sendMessage(senderId, { text: responseMessage.trim() });

        } catch (error) {
            console.error(`Error executing npm command:`, error);
            await api.sendMessage(senderId, { text: 'An error occurred while processing your npm package request.' });
        }
    }
};
