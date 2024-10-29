module.exports = {
    name: 'help',
    description: 'See available commands',

    async execute(senderId, messageText, messageId) {
        try {
            // Message content to list available commands
            const commandsPath = require('path').join(__dirname, '../cmd');
            const commandFiles = require('fs').readdirSync(commandsPath).filter(file => file.endsWith('.js'));

            // Build a beautifully formatted command list
            let commandListText = "✨ *Available Commands* ✨\n\n";
            commandFiles.forEach(file => {
                const command = require(require('path').join(commandsPath, file));
                if (command.name) {
                    commandListText += `➡️  *${command.name}*\n`;
                } else {
                    api.sendMessage(senderId, { text: `Command in file ${file} is missing a name.` });
                }
            });

            commandListText += "\nType any command to get started! 🚀";

            // Use replyMessage to respond directly to the triggering message
            await api.replyMessage(senderId, { text: commandListText }, messageId);
        } catch (error) {
            console.error("Error in help command:", error.message);
            await api.sendMessage(senderId, { text: "An error occurred while retrieving the commands." });
        }
    }
};
