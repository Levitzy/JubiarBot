const api = require('../jubiar-pagebot-api/sendmessage');

module.exports = {
    name: 'help',
    description: 'See available commands',

    async execute(senderId) {
        try {
            // Load all available commands from the cmd folder
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

            // Send the message with the list of commands
            await api.sendMessage(senderId, {
                text: commandListText
            });

            // Send an additional message with contact admin options
         /* await api.sendMessage(senderId, {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "button",
                        text: "Need further assistance? Contact an admin:",
                        buttons: [
                            {
                                type: "web_url",
                                url: "https://www.facebook.com/kennethfranciscoaceberos",
                                title: "Contact Admin 1"
                            },
                            {
                                type: "web_url",
                                url: "https://www.facebook.com/wieginesalpocialechavez",
                                title: "Contact Admin 2"
                            }
                        ]
                    }
                }
            }); */
        } catch (error) {
            console.error("Error in help command:", error.message);
            await api.sendMessage(senderId, { text: "An error occurred while retrieving the commands." });
        }
    }
};
