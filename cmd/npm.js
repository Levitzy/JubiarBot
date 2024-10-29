const api = require('../jubiar-pagebot-api/sendmessage');
const fetch = require('node-fetch'); // Assuming node-fetch is installed in your project

module.exports = {
    name: 'npm',
    description: 'Fetches details about an NPM package',

    async execute(senderId, messageText) {
        const packageName = messageText.split(' ').slice(1).join(' '); // Extract package name from message
        if (!packageName) {
            await api.sendMessage(senderId, { text: 'Please provide a package name. Usage: /npm <package_name>' });
            return;
        }

        try {
            const response = await fetch(`https://api.popcat.xyz/npm?q=${encodeURIComponent(packageName)}`);
            const data = await response.json();

            if (data.error) {
                await api.sendMessage(senderId, { text: `Error: ${data.error}` });
                return;
            }

            const { name, version, description, keywords, author, author_email, last_published, maintainers, repository } = data;

            // Format message
            const message = `
**Package:** ${name}
**Version:** ${version}
**Description:** ${description || 'No description available.'}
**Keywords:** ${keywords || 'No keywords available.'}
**Author:** ${author} (${author_email || 'No email provided'})
**Last Published:** ${last_published}
**Maintainers:** ${maintainers || 'No maintainers listed.'}
**Repository:** ${repository || 'No repository link available.'}
            `;

            await api.sendMessage(senderId, { text: message });
        } catch (error) {
            console.error(`Error executing npm command:`, error);
            await api.sendMessage(senderId, { text: 'An error occurred while fetching the package data.' });
        }
    }
};
