const axios = require('axios');

module.exports = {
    name: 'npm',
    description: 'Fetches information about an NPM package',

    async execute(senderId, messageText) {
        try {
            // Extract the package name from messageText
            const packageName = messageText.split(' ')[1];
            if (!packageName) {
                await api.sendMessage(senderId, { text: 'Please specify an NPM package name. Usage: /npm <package-name>' });
                return;
            }

            // Fetch package information from PopCat API
            const response = await axios.get(`https://api.popcat.xyz/npm?q=${packageName}`);
            const data = response.data;

            // Check if the response contains valid data
            if (!data.name) {
                await api.sendMessage(senderId, { text: `The package "${packageName}" could not be found on NPM.` });
                return;
            }

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
            console.error(`Error executing npm command for package "${messageText.split(' ')[1] || 'unknown'}":`, error);
            const errorMessage = error.response && error.response.status === 404 
                ? 'The requested NPM package could not be found. Please ensure the package name is correct.' 
                : 'There was a problem connecting to the NPM data service. Please try again later.';
                
            await api.sendMessage(senderId, { text: errorMessage });
        }
    }
};
