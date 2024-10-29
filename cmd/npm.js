const axios = require('axios');
const api = require('../jubiar-pagebot-api/sendmessage');

module.exports = {
    name: 'npm',
    description: 'Fetches information about an npm package',

    async execute(senderId, messageText) {
        try {
            // Extract package name from messageText
            const packageName = messageText.split(' ')[1];
            if (!packageName) {
                await api.sendMessage(senderId, { text: 'Please specify an npm package name.' });
                return;
            }

            // Call the Popcat API
            const response = await axios.get(`https://api.popcat.xyz/npm?q=${encodeURIComponent(packageName)}`);
            const data = response.data;

            // Check if the API returned data for the package
            if (!data || !data.name) {
                await api.sendMessage(senderId, { text: `Package "${packageName}" not found.` });
                return;
            }

            // Format and send the response message
            const message = `
*Package:* ${data.name}
*Version:* ${data.version}
*Description:* ${data.description}
*Keywords:* ${data.keywords.join(', ')}
*Author:* ${data.author} (${data.author_email || 'No email provided'})
*Last Published:* ${data.last_published}
*Maintainers:* ${data.maintainers.join(', ')}
*Repository:* ${data.repository || 'No repository link available'}
            `;
            await api.sendMessage(senderId, { text: message });
        } catch (error) {
            console.error(`Error executing npm command:`, error);
            await api.sendMessage(senderId, { text: 'An error occurred while fetching package information.' });
        }
    }
};
