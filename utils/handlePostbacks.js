const handleSeeAllCommandsPostback = require('../payload/seeAllCommandsPostback');
const api = require('../jubiar-pagebot-api/sendmessage');

module.exports.handlePostback = async (senderId, payload, commandName = '') => {
    try {
        console.log(`Handling postback with payload: ${payload}`);

        if (payload === 'SEE_ALL_COMMANDS_PAYLOAD' && commandName === 'help') {
            await handleSeeAllCommandsPostback(senderId, commandName);
            return;
        }

        await api.sendMessage(senderId, {
            text: "Sorry, I didn't recognize that option."
        });
    } catch (error) {
        console.error('Error handling postback:', error.message);
        await api.sendMessage(senderId, {
            text: "An error occurred while processing your request."
        });
    }
};
