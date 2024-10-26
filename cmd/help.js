const api = require('../jubiar-pagebot-api/sendmessage');

module.exports = {
    name: 'help',
    description: 'See available commands',

    async execute(senderId) {
        try {
            // Create quick replies from the available commands
            const quick_replies = [];
            const commandsPath = require('path').join(__dirname, '../cmd');
            const commandFiles = require('fs').readdirSync(commandsPath).filter(file => file.endsWith('.js'));

            commandFiles.forEach(file => {
                const command = require(require('path').join(commandsPath, file));
                if (command.name) {
                    quick_replies.push({
                        content_type: "text",
                        title: `/${command.name}`, // Prefix with '/' as an example
                        payload: command.name.toUpperCase()
                    });
                }
            });

            // Prepare and send the response with quick replies and buttons
            const responseMessage = {
                quick_replies,
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "button",
                        text: `🤖 | These are the commands on Wie AI below.
🔎 | Click every command to see the usage.`,
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
            };

            await api.sendMessage(senderId, responseMessage);
        } catch (error) {
            console.error("Error in help command:", error.message);
            await api.sendMessage(senderId, { text: "An error occurred while retrieving the commands." });
        }
    }
};
