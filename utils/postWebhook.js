const { setOnlineIndicator } = require('../jubiar-pagebot-api/bot');

module.exports = (app, commands) => {
    app.post('/webhook', async (req, res) => {
        const body = req.body;

        if (body.object === 'page') {
            body.entry.forEach(async function(entry) {
                const webhookEvent = entry.messaging[0];
                const senderId = webhookEvent.sender.id;

                // Trigger the online indicator when a message is received
                await setOnlineIndicator(senderId);

                if (webhookEvent.message && webhookEvent.message.text) {
                    const receivedText = webhookEvent.message.text.trim();
                    const [commandName] = receivedText.split(' ');

                    const command = commands[commandName.toLowerCase()];
                    if (command) {
                        await command.execute(senderId, receivedText);
                    } else {
                        await api.sendMessage(senderId, { text: "Unrecognized command. Type 'help' for available options." });
                    }
                }
            });
            res.status(200).send('EVENT_RECEIVED');
        } else {
            res.sendStatus(404);
        }
    });
};
