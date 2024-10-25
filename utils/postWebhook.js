const bot = require('../jubiar-pagebot-api/bot');

module.exports = (app, commands) => {
    app.post('/webhook', async (req, res) => {
        const body = req.body;

        if (body.object === 'page') {
            body.entry.forEach(async function(entry) {
                const webhookEvent = entry.messaging[0];
                const senderId = webhookEvent.sender.id;
                console.log(webhookEvent);

                if (webhookEvent.message && webhookEvent.message.text) {
                    const receivedText = webhookEvent.message.text;

                    for (const commandName in commands) {
                        const command = commands[commandName];
                        await command.execute(senderId, receivedText);
                    }
                } else if (webhookEvent.postback) {
                    const payload = webhookEvent.postback.payload;

                    await bot.handlePostback(senderId, payload, 'help');
                }
            });
            res.status(200).send('EVENT_RECEIVED');
        } else {
            res.sendStatus(404);
        }
    });
};
