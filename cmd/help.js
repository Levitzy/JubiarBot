module.exports = {
    name: 'help',
    description: 'See available commands',

    async execute(senderId, messageText, messageId) {
        try {
            // Message content to list available commands
            const commandsPath = require('path').join(__dirname, '../cmd');
            const commandFiles = require('fs').readdirSync(commandsPath).filter(file => file.endsWith('.js'));

            let commandListText = "🤖 | Here are the available commands:\n\n";

            commandFiles.forEach(file => {
                const command = require(require('path').join(commandsPath, file));
                if (command.name && command.description) {
                    commandListText += `• ${command.name}: ${command.description}\n`;
                } else {
                    console.warn(`Command in file ${file} is missing a name or description.`);
                }
            });

            // Use replyMessage to respond directly to the triggering message
            await replyApi.replyMessage(senderId, { text: commandListText }, messageId);
        } catch (error) {
            console.error("Error in help command:", error.message);
            await api.sendMessage(senderId, { text: "An error occurred while retrieving the commands." });
        }
    }
};
