const api = require('../jubiar-pagebot-api/sendmessage');

// Utility to send a message informing the user about the correct prefix
module.exports = async function sendPrefixMessage(senderId, command, prefix) {
    const message = `The "${command.name}" command requires the prefix "${prefix}". Please try again with "${prefix}${command.name}".`;
    await api.sendMessage(senderId, message);
};
