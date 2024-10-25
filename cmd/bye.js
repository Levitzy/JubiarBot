const api = require('../jubiar-pagebot-api/sendmessage');

module.exports = {
    name: 'bye',
    description: 'A farewell command to say goodbye to the user.',

    async execute(senderId, messageText) {
        if (messageText.trim() === this.name) {
            const responseMessage = { text: `Goodbye! You used the ${this.name} command.` };
            await api.sendMessage(senderId, responseMessage);
        }
    }
};
