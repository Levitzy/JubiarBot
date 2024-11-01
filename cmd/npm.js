const axios = require('axios');

module.exports = {
    name: 'npm',
    description: 'Fetches information about an npm package from api.popcat.xyz',

    async execute(senderId, messageText) {
        try {
            // Extract the package name from the message text
            const packageName = messageText.replace('npm ', ''); 

            if (!packageName) {
                await api.sendMessage(senderId, { text: 'Please provide a package name. Example: `npm axios`' });
                return;
            }

            const response = await axios.get(`https://api.popcat.xyz/npm?q=${packageName}`);
            const npmPackage = response.data;

            // Check if npmPackage and its properties exist before accessing them
            const message = npmPackage && npmPackage.name && npmPackage.links
                ? `
**Name:** ${npmPackage.name}
**Description:** ${npmPackage.description || 'No description available'}
**Version:** ${npmPackage.version || 'No version available'}
**Author:** ${npmPackage.author ? npmPackage.author.name : 'No author available'}
**Link:** ${npmPackage.links.npm}
                `
                : 'Package not found or invalid response from the API.';

            await api.sendMessage(senderId, { text: message });
        } catch (error) {
            console.error(`Error executing ${this.name} command:`, error);
            await api.sendMessage(senderId, { text: 'An error occurred while fetching the npm package information.' });
        }
    }
};