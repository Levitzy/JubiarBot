const api = require('../jubiar-pagebot-api/sendmessage');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'help',
    description: 'Provides a button to list all commands with their descriptions.',

    async execute(senderId) {
        try {
            // Define the button message
            let responseMessage = {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'button',
                        text: 'Need assistance? Choose an option:',
                        buttons: [
                            {
                                type: 'postback',
                                title: 'See All Commands',
                                payload: 'SEE_ALL_COMMANDS_PAYLOAD'
                            }
                        ]
                    }
                }
            };

            // Send the initial help message
            await api.sendMessage(senderId, responseMessage);
        } catch (error) {
            console.error("Error in execute function:", error.message);
            await api.sendMessage(senderId, { text: "An error occurred while processing your request." });
        }
    },

    // Function to handle the 'See All Commands' button postback
    async handlePostback(senderId, payload) {
        try {
            if (payload === 'SEE_ALL_COMMANDS_PAYLOAD') {
                console.log("Handling postback for SEE_ALL_COMMANDS_PAYLOAD");

                // Read all command files from the 'cmd' directory
                const commandsPath = path.join(__dirname, 'cmd');
                const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

                // Check if there are command files to load
                if (commandFiles.length === 0) {
                    await api.sendMessage(senderId, { text: "No commands are available at the moment." });
                    return;
                }

                // Collect command names and descriptions
                let commandsList = 'Here are all available commands:\n\n';
                for (const file of commandFiles) {
                    const command = require(path.join(commandsPath, file));
                    if (command.name && command.description) {
                        commandsList += `• ${command.name}: ${command.description}\n`;
                    } else {
                        console.warn(`Command in file ${file} is missing name or description.`);
                    }
                }

                // Send the list in chunks if it exceeds the character limit
                const MAX_LENGTH = 2000;
                const chunks = commandsList.match(new RegExp(`.{1,${MAX_LENGTH}}`, 'g'));

                for (const chunk of chunks) {
                    await api.sendMessage(senderId, { text: chunk });
                }
            }
        } catch (error) {
            console.error("Error in handlePostback function:", error.message);
            await api.sendMessage(senderId, { text: "An error occurred while retrieving commands." });
        }
    }
};
