const api = require('../jubiar-pagebot-api/sendmessage');

module.exports = {
    name: 'help',
    description: 'Provides a button to list all commands with their descriptions.',

    async execute(senderId) {
        try {
            const responseMessage = {
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

            await api.sendMessage(senderId, responseMessage);
        } catch (error) {
            console.error("Error in help command execute function:", error.message);
            await api.sendMessage(senderId, { text: "An error occurred while processing your request." });
        }
    }
};
