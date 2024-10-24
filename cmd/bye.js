const api = require('../jubiar-pagebot-api/sendmessage');

module.exports = {
    name: 'test',
    description: 'A test command to verify functionality.',

    async execute(senderId, messageText) {
        if (messageText.trim() === this.name) {
            const responseMessage = `This is a test command. You said: ${messageText}`;
            await api.sendMessage(senderId, responseMessage);
        }
    }
};
