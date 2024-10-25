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

            // Ensure responseMessage is correctly formatted before sending
            if (!responseMessage.attachment.payload.buttons.length) {
                throw new Error("Button configuration is missing in responseMessage.");
            }

            // Send the initial help message
            await api.sendMessage(senderId, responseMessage);
        } catch (error) {
            console.error("Error in execute function:", error.message);
            await api.sendMessage(senderId, { text: "An error occurred while processing your request." });
        }
    },

    // Handle the payload for 'See All Commands'
    async handlePostback(senderId, payload) {
        if (payload === 'SEE_ALL_COMMANDS_PAYLOAD') {
            try {
                // Read all command files from the 'cmd' directory
                const commandsPath = path.join(__dirname, 'cmd');
                const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

                // Check if there are command files to load
                if (commandFiles.length === 0) {
                    throw new Error("No command files found in cmd folder.");
                }

                // Collect command names and descriptions
                let commandsList = 'Here are all available commands:\n\n';
                for (const file of commandFiles) {
                    const command = require(path.join(commandsPath, file));
                    // Ensure command has necessary properties
                    if (command.name && command.description) {
                        commandsList += `• ${command.name}: ${command.description}\n`;
                    } else {
                        console.warn(`Command in file ${file} is missing name or description.`);
                    }
                }

                // Send the list of commands
                await api.sendMessage(senderId, { text: commandsList });
            } catch (error) {
                console.error("Error in handlePostback function:", error.message);
                await api.sendMessage(senderId, { text: "An error occurred while retrieving commands." });
            }
        }
    }
};
