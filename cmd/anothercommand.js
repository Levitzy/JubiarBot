const api = require('../jubiar-pagebot-api/sendmessage');

module.exports = {
    name: 'test',
    description: 'A test command to verify that everything is working.',

    async execute(senderId, messageText) {
        const responseMessage = `This is a test command. You said: ${messageText}`;
        await api.sendMessage(senderId, responseMessage);
    }
};
