const axios = require('axios');

module.exports = {
    name: 'npm',
    description: 'Search for an npm package',

    async execute(senderId, messageText, messageId) {
        try {
            // Extract user input by slicing off first 4 characters (i.e., "npm ")
            const userInput = messageText.slice(4).trim();

            // Check if user provided input
            if (!userInput) {
                await api.replyMessage(senderId, { text: "Please specify an npm package to search for." }, messageId);
                return;
            }

            // Make the API request
            const response = await axios.get(`https://api.popcat.xyz/npm?q=${encodeURIComponent(userInput)}`);
            const packageInfo = response.data;

            // Check if package info is returned
            if (!packageInfo || packageInfo.error) {
                await api.replyMessage(senderId, { text: "Package not found." }, messageId);
                return;
            }

            // Build response message with package details
            const packageText = `📦 *${packageInfo.name}* (${packageInfo.version})

` +
                `📝 *Description*: ${packageInfo.description}
` +
                `👤 *Author*: ${packageInfo.author}
` +
                `⭐ *Stars*: ${packageInfo.stars}
` +
                `🔗 *Link*: ${packageInfo.url}`;

            // Send package information back to user
            await api.replyMessage(senderId, { text: packageText }, messageId);
        } catch (error) {
            console.error("Error in npm command:", error.message);
            await api.sendMessage(senderId, { text: "An error occurred while searching for the npm package." });
        }
    }
};
