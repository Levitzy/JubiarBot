const api = require('../jubiar-pagebot-api/sendmessage');

module.exports = {
    name: 'hi',
    description: 'A greeting command to say hi to the user.',
    prefixRequires: true,  // This command requires the prefix

    async execute(senderId, messageText) {
        const responseMessage = `Hello! You said: ${messageText}`;
        await api.sendMessage(senderId, responseMessage);
    }
};
