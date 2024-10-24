// postWebhook.js

module.exports = (app, commands) => {
    app.post('/webhook', async (req, res) => {
        let body = req.body;

        if (body.object === 'page') {
            body.entry.forEach(async function(entry) {
                let webhookEvent = entry.messaging[0];
                console.log(webhookEvent);

                // Check if the message contains text and if any command matches
                if (webhookEvent.message && webhookEvent.message.text) {
                    const senderId = webhookEvent.sender.id;
                    const receivedText = webhookEvent.message.text;

                    // Iterate over all loaded commands and execute them
                    for (const commandName in commands) {
                        const command = commands[commandName];
                        await command.execute(senderId, receivedText);
                    }
                }
            });
            res.status(200).send('EVENT_RECEIVED');
        } else {
            res.sendStatus(404);
        }
    });
};
