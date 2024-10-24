const api = require('../jubiar-pagebot-api/sendmessage');

module.exports = {
    name: 'test',
    description: 'A test command to verify functionality.',
    prefixRequires: false, // This command does not require a prefix

    async execute(senderId, messageText) {
        // If prefix is not required, the user can directly call the command
        if (messageText.trim() === this.name) {
            const responseMessage = `This is a test command. You said: ${messageText}`;
            await api.sendMessage(senderId, responseMessage);
        }
    }
};
