const path = require('path');
const fs = require('fs');
const api = require('../jubiar-pagebot-api/sendmessage');

async function handleSeeAllCommandsPostback(senderId, commandName) {
    try {
        if (commandName !== 'help') {
            console.warn(`SEE_ALL_COMMANDS_PAYLOAD triggered outside of 'help' command context.`);
            await api.sendMessage(senderId, {
                text: "This action is not available here."
            });
            return;
        }

        const commandsPath = path.join(__dirname, '../../cmd');
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        if (commandFiles.length === 0) {
            await api.sendMessage(senderId, { text: "No commands are available at the moment." });
            return;
        }

        let commandsList = 'Here are all available commands:\n\n';
        for (const file of commandFiles) {
            const command = require(path.join(commandsPath, file));
            if (command.name && command.description) {
                commandsList += `• ${command.name}: ${command.description}\n`;
            } else {
                console.warn(`Command in file ${file} is missing name or description.`);
            }
        }

        const MAX_LENGTH = 2000;
        const chunks = commandsList.match(new RegExp(`.{1,${MAX_LENGTH}}`, 'g'));

        for (const chunk of chunks) {
            await api.sendMessage(senderId, { text: chunk });
        }
    } catch (error) {
        console.error('Error handling SEE_ALL_COMMANDS_PAYLOAD:', error.message);
        await api.sendMessage(senderId, {
            text: "An error occurred while retrieving commands."
        });
    }
}

module.exports = handleSeeAllCommandsPostback;
