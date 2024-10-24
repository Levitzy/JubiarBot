const api = require('../jubiar-pagebot-api/sendmessage');

module.exports = {
    name: 'hi',
    description: 'A greeting command to say hi to the user.',
    prefixRequires: true, // This command requires a prefix

    async execute(senderId, messageText, prefix) {
        // Check if prefix is required and if the message starts with the prefix
        if (this.prefixRequires && !messageText.startsWith(prefix)) {
            return; // If prefix is required and not present, do nothing
        }

        const commandWithoutPrefix = messageText.replace(prefix, '').trim();
        if (commandWithoutPrefix === this.name) {
            const responseMessage = `Hello! You used the ${this.name} command.`;
            await api.sendMessage(senderId, responseMessage);
        }
    }
};
