const axios = require('axios');
const sendMessage = require('../jubiar-pagebot-api/sendmessage'); // Adjust the path if necessary

module.exports = async function (senderId, args) {
    const query = args.join(" ");  // Get the user input
    const apiUrl = `https://api.popcat.xyz/npm?q=${encodeURIComponent(query)}`;

    try {
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (data.error) {
            await sendMessage(senderId, `Error: ${data.error}`);
            return;
        }

        // Format the message with the data received
        const message = `
**Package Name:** ${data.name}
**Version:** ${data.version}
**Description:** ${data.description}
**Author:** ${data.author}
**Maintainers:** ${data.maintainers.join(', ')}
**Repository:** ${data.repository}
**Homepage:** ${data.homepage}
**Downloads (last month):** ${data.downloads}
**License:** ${data.license}

**Keywords:** ${data.keywords.join(', ') || 'None'}
        `;

        // Send the formatted message
        await sendMessage(senderId, message);
    } catch (error) {
        console.error("Error fetching NPM package data:", error);
        await sendMessage(senderId, "Sorry, there was an error fetching the package data. Please try again later.");
    }
};
