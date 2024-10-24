const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const loadCommands = require('./utils/loadCommand'); // Import the loadCommand.js file
const app = express();
const PORT = process.env.PORT || 3000;

// Read token.txt for PAGE_ACCESS_TOKEN
const PAGE_ACCESS_TOKEN = fs.readFileSync(path.join(__dirname, 'token.txt'), 'utf8').trim();

// Verification Token
const VERIFY_TOKEN = 'jubiar'; // Replace with your own verification token

app.use(bodyParser.json());

// Webhook verification
app.get('/webhook', (req, res) => {
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);      
        }
    }
});

// Handle incoming webhook events
app.post('/webhook', async (req, res) => {
    let body = req.body;

    if (body.object === 'page') {
        const commands = loadCommands();  // Load all commands

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

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
