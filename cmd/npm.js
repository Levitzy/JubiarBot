const api = require('../jubiar-pagebot-api/sendmessage');
const axios = require('axios');

module.exports = {
    name: 'npm',
    description: 'Fetches information about an NPM package',

    async execute(senderId, messageText) {
        try {
            // Extract the package name from messageText
            const packageName = messageText.split(' ')[1];
            if (!packageName) {
                await api.sendMessage(senderId, { text: 'Please specify an NPM package name.' });
                return;
            }

            // Fetch package information from PopCat API
            const response = await axios.get(`https://api.popcat.xyz/npm?q=${packageName}`);
            const data = response.data;

            // Format the message
            const message = `
*Package Name*: ${data.name}
*Version*: ${data.version}
*Description*: ${data.description}
*Author*: ${data.author || 'N/A'}
*License*: ${data.license}
*Links*:
- [NPM](https://www.npmjs.com/package/${data.name})
- [Repository](${data.repository || 'N/A'})
- [Homepage](${data.homepage || 'N/A'})

*Downloads per Week*: ${data.downloads}
*Maintainers*: ${data.maintainers.join(', ') || 'N/A'}
            `;

            // Send the formatted message
            await api.sendMessage(senderId, { text: message });
        } catch (error) {
            console.error(`Error executing npm command:`, error);
            await api.sendMessage(senderId, { text: 'An error occurred while fetching the NPM package data.' });
        }
    }
};
