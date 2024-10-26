module.exports = (app, commands) => {
    app.post('/webhook', async (req, res) => {
        const body = req.body;

        if (body.object === 'page') {
            body.entry.forEach(async function(entry) {
                const webhookEvent = entry.messaging[0];
                const senderId = webhookEvent.sender.id;

                if (webhookEvent.message && webhookEvent.message.text) {
                    const receivedText = webhookEvent.message.text.trim().toLowerCase();

                    // Check for a matching command by name and execute it
                    const command = commands[receivedText];
                    if (command) {
                        await command.execute(senderId, receivedText);
                    } else {
                        // Handle unknown command if needed
                        await commands['help'].execute(senderId); // Send help command as fallback if unknown command
                    }
                }
            });
            res.status(200).send('EVENT_RECEIVED');
        } else {
            res.sendStatus(404);
        }
    });
};
