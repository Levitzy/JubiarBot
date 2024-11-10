const adminCommands = require('../jubiar-pagebot-api/adminCheck'); // Import the new admin API

module.exports = (app, commands) => {
    app.post('/webhook', async (req, res) => {
        const body = req.body;

        if (body.object === 'page') {
            body.entry.forEach(async function(entry) {
                const webhookEvent = entry.messaging[0];
                const senderId = webhookEvent.sender.id;

                if (webhookEvent.message && webhookEvent.message.text) {
                    const receivedText = webhookEvent.message.text.trim();
                    const [commandName, ...args] = receivedText.split(' ');

                    // Check for a matching command by name and execute if permitted
                    const command = commands[commandName.toLowerCase()];
                    if (command) {
                        await adminCommands.executeCommandIfAdmin(senderId, command, args);
                    } else {
                        await sendMessage(senderId, { text: "Unrecognized command. Type 'help' for available options." });
                    }
                }
            });
            res.status(200).send('EVENT_RECEIVED');
        } else {
            res.sendStatus(404);
        }
    });
};
