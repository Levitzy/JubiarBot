const api = require('../jubiar-pagebot-api/sendmessage');
const sendPrefixMessage = require('../utils/prefixAuto'); // Import the prefixAuto utility

module.exports = {
    name: 'hi',
    description: 'A greeting command to say hi to the user.',
    prefixRequires: true, // This command requires a prefix

    async execute(senderId, messageText, prefix) {
        // Check if prefix is required and if the message starts with the prefix
        if (this.prefixRequires) {
            if (!messageText.startsWith(prefix)) {
                // If the wrong prefix is provided, use the prefixAuto.js utility to send the correct prefix
                await sendPrefixMessage(senderId, this, prefix);
                return;
            }
        }

        const commandWithoutPrefix = messageText.replace(prefix, '').trim();
        if (commandWithoutPrefix === this.name) {
            const responseMessage = `Hello! You used the ${this.name} command.`;
            await api.sendMessage(senderId, responseMessage);
        }
    }
};
