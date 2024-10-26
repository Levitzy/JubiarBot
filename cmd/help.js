const api = require('../jubiar-pagebot-api/sendmessage');

module.exports = {
    name: 'help',
    description: 'See available commands',

    async execute(senderId) {
        try {
            // Load all available commands from the cmd folder
            const commandsPath = require('path').join(__dirname, '../cmd');
            const commandFiles = require('fs').readdirSync(commandsPath).filter(file => file.endsWith('.js'));

            const buttons = commandFiles.map(file => {
                const command = require(require('path').join(commandsPath, file));
                return {
                    type: "postback",
                    title: `/${command.name}`, // Prefix with '/' as an example
                    payload: command.name
                };
            });

            // Split buttons into chunks of 3 (Facebook limits to 3 buttons per message)
            const buttonChunks = [];
            for (let i = 0; i < buttons.length; i += 3) {
                buttonChunks.push(buttons.slice(i, i + 3));
            }

            // Send each chunk of buttons as a separate message
            for (const chunk of buttonChunks) {
                await api.sendMessage(senderId, {
                    attachment: {
                        type: "template",
                        payload: {
                            template_type: "button",
                            text: `🤖 | Here are available commands. Click a command to execute it.`,
                            buttons: chunk
                        }
                    }
                });
            }

            // Add contact admin buttons
            await api.sendMessage(senderId, {
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
            });
        } catch (error) {
            console.error("Error in help command:", error.message);
            await api.sendMessage(senderId, { text: "An error occurred while retrieving the commands." });
        }
    }
};
