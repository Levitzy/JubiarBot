const api = require('../jubiar-pagebot-api/sendmessage');

module.exports = {
    name: 'bye',
    description: 'A command to say goodbye to the user.',
    prefixRequires: false,  // This command does not require the prefix

    async execute(senderId, messageText) {
        const responseMessage = `Goodbye! You said: ${messageText}`;
        await api.sendMessage(senderId, responseMessage);
    }
};
