const axios = require('axios');

module.exports = {
    name: 'npm',
    description: 'Get information about an NPM package',

    async execute(senderId, messageText, messageId) {
        try {
            // Extract the package name from the message
            const packageName = messageText.replace('npm', '').trim();
            
            if (!packageName) {
                await api.replyMessage(senderId, {
                    text: "Please provide a package name. Example: npm express"
                }, messageId);
                return;
            }

            // Make request to PopCat API
            const response = await axios.get(`https://api.popcat.xyz/npm?q=${encodeURIComponent(packageName)}`);
            const data = response.data;

            // Handle keywords - API returns it as a string
            const keywords = data.keywords || 'None';

            // Format the response
            const packageInfo = `📦 *${data.name}*\n\n` +
                `📝 *Description:* ${data.description}\n\n` +
                `👤 *Author:* ${data.author || 'Not specified'}\n` +
                `📅 *Version:* ${data.version}\n` +
                `⭐ *Keywords:* ${keywords}\n` +
                `🔗 *Homepage:* ${data.homepage || 'Not specified'}\n\n` +
                `📥 *Installation:*\n\`\`\`npm install ${data.name}\`\`\``;

            // Send the formatted response
            await api.replyMessage(senderId, {
                text: packageInfo
            }, messageId);

        } catch (error) {
            console.error("Error in npm command:", error.message);
            
            // Send user-friendly error message
            const errorMessage = error.response?.status === 404
                ? "Package not found. Please check the package name and try again."
                : "An error occurred while fetching the package information.";
                
            await api.replyMessage(senderId, {
                text: errorMessage
            }, messageId);
        }
    }
};