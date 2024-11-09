const api = require('../jubiar-pagebot-api/sendmessage');

module.exports = {
    name: 'uid', // Command keyword
    description: 'Returns the user\'s unique ID (senderId)',

    async execute(senderId) {
        try {
            // Send back the senderId
            await api.sendMessage(senderId, { text: `Your unique ID is: ${senderId}` });
        } catch (error) {
            console.error(`Error executing ${this.name} command:`, error);
            await api.sendMessage(senderId, { text: 'An error occurred while processing your request.' });
        }
    }
};
