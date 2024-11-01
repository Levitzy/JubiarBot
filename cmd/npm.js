const axios = require('axios');
const { replyMessage } = require('../replyMessage');

module.exports = {
    name: 'npm',
    description: 'Get information about an npm package',

    async execute(senderId, messageText, messageId) {
        try {
            // Extract package name from message text
            const packageName = messageText.split(' ')[1];
            if (!packageName) {
                await replyMessage(senderId, { text: 'Please provide a package name. Usage: npm <package-name>' }, messageId);
                return;
            }

            // Fetch package information from the API
            const apiUrl = `https://api.popcat.xyz/npm?q=${encodeURIComponent(packageName)}`;
            const response = await axios.get(apiUrl);
            const packageInfo = response.data;

            // Check if the package exists
            if (!packageInfo || packageInfo.error) {
                await replyMessage(senderId, { text: `Package not found: ${packageName}` }, messageId);
                return;
            }

            // Build the response message
            const message = `✨ *${packageInfo.name}* ✨\n\n` +
                `*Version*: ${packageInfo.version}\n` +
                `*Description*: ${packageInfo.description}\n` +
                `*Author*: ${packageInfo.author}\n` +
                `*Repository*: ${packageInfo.repo || 'Not available'}\n` +
                `*Downloads*: ${packageInfo.downloads}\n` +
                `*Maintainers*: ${packageInfo.maintainers.join(', ')}\n\n` +
                `Learn more: ${packageInfo.links.npm}`;

            // Reply with the package information
            await replyMessage(senderId, { text: message }, messageId);
        } catch (error) {
            console.error('Error fetching npm package information:', error.message);
            await replyMessage(senderId, { text: 'An error occurred while fetching package information. Please try again later.' }, messageId);
        }
    }
};
