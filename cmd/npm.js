const api = require('../jubiar-pagebot-api/sendmessage');
const axios = require('axios'); // Ensure axios is installed in your environment

module.exports = {
    name: 'npm',
    description: 'Fetches information about an npm package from the Popcat API.',

    async execute(senderId, messageText) {
        // Extract the package name from the message text
        const packageName = messageText.split(' ')[1]; // Assumes command format: "npm {packageName}"
        
        if (!packageName) {
            await api.sendMessage(senderId, { text: 'Please specify a package name. Example: npm express' });
            return;
        }

        try {
            // Fetch data from the Popcat API
            const response = await axios.get(`https://api.popcat.xyz/npm?q=${packageName}`);
            const data = response.data;

            // Prepare the message with all required fields
            const message = `
                *Package Name:* ${data.name || 'N/A'}
                *Version:* ${data.version || 'N/A'}
                *Description:* ${data.description || 'N/A'}
                *Keywords:* ${data.keywords ? data.keywords.join(', ') : 'N/A'}
                *Author:* ${data.author || 'N/A'}
                *Author Email:* ${data.author_email || 'N/A'}
                *Last Published:* ${data.last_published || 'N/A'}
                *Maintainers:* ${data.maintainers ? data.maintainers.join(', ') : 'N/A'}
                *Repository:* ${data.repository || 'N/A'}
            `;

            await api.sendMessage(senderId, { text: message });
        } catch (error) {
            console.error(`Error fetching package data:`, error);
            await api.sendMessage(senderId, { text: 'An error occurred while retrieving package information. Please try again later.' });
        }
    }
};
