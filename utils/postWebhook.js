// postWebhook.js

const bot = require('../jubiar-pagebot-api/bot'); // Import bot.js for postback handling

module.exports = (app, commands) => {
    app.post('/webhook', async (req, res) => {
        let body = req.body;

        if (body.object === 'page') {
            body.entry.forEach(async function(entry) {
                let webhookEvent = entry.messaging[0];
                const senderId = webhookEvent.sender.id;
                console.log(webhookEvent);

                // Check if the message contains text and if any command matches
                if (webhookEvent.message && webhookEvent.message.text) {
                    const receivedText = webhookEvent.message.text;

                    // Iterate over all loaded commands and execute them
                    for (const commandName in commands) {
                        const command = commands[commandName];
                        await command.execute(senderId, receivedText);
                    }
                } else if (webhookEvent.postback) {
                    // Handle postback events
                    const payload = webhookEvent.postback.payload;
                    await bot.handlePostback(senderId, payload); // Call handlePostback in bot.js
                }
            });
            res.status(200).send('EVENT_RECEIVED');
        } else {
            res.sendStatus(404);
        }
    });
};
