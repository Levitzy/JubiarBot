module.exports = (app, commands) => {
    app.post('/webhook', async (req, res) => {
        const body = req.body;

        if (body.object === 'page') {
            body.entry.forEach(async function(entry) {
                const webhookEvent = entry.messaging[0];
                const senderId = webhookEvent.sender.id;

                if (webhookEvent.message && webhookEvent.message.text) {
                    const receivedText = webhookEvent.message.text.trim();
                    const [commandName] = receivedText.split(' ');

                    // Check for a matching command by name and execute it
                    const command = commands[commandName.toLowerCase()];
                    if (command) {
                        await command.execute(senderId, receivedText);
                    } else {
                        // Optional: Log unknown command or notify the user
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
