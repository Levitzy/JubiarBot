const api = require('../jubiar-pagebot-api/sendmessage');

module.exports = {
    name: 'hi',
    description: 'A greeting command to say hi to the user.',

    async execute(senderId, messageText) {
        if (messageText.trim() === this.name) {
            const responseMessage = { text: `Hello! You used the ${this.name} command.` };
            await api.sendMessage(senderId, responseMessage);
        }
    }
};
