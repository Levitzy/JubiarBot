const { sendMessage } = require('./sendmessage');
const config = require('../config.json'); // Load config with admin IDs

module.exports = {
    // Execute only if adminBot is true and user ID is in adminIds
    async executeCommandIfAdmin(senderId, command, args) {
        if (command.adminBot) {
            // Check if senderId is in the list of adminIds
            if (!config.adminIds.includes(senderId)) {
                await sendMessage(senderId, { text: "❌ You do not have permission to use this command." });
                return;
            }
        }

        // Execute the command if user is an admin or if adminBot is false
        await command.execute(senderId, args);
    }
};
