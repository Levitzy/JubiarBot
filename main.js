const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const loadCommands = require('./utils/loadCommand');
const getWebhook = require('./utils/getWebhook');
const postWebhook = require('./utils/postWebhook');
const { sendMessage } = require('./jubiar-pagebot-api/sendmessage');
const { replyMessage } = require('./jubiar-pagebot-api/replyMessage');

const app = express();
const PORT = process.env.PORT || 3000;

const VERIFY_TOKEN = 'jubiar';
const PAGE_ACCESS_TOKEN = fs.readFileSync(path.join(__dirname, 'token.txt'), 'utf8').trim();

app.use(bodyParser.json());

let commands = loadCommands(); // Load initial commands from files

// Define api object with sendMessage and replyMessage
api = {
    sendMessage,
    replyMessage
};

async function checkPageAccessToken() {
    try {
        const response = await axios.get(`https://graph.facebook.com/v21.0/me?access_token=${PAGE_ACCESS_TOKEN}`);
        const botName = response.data.name || 'Unknown Bot';
        return { status: 'Good', botName };
    } catch (error) {
        console.error('Error fetching bot information:', error.message);
        return { status: 'Bad', botName: 'Unknown Bot' };
    }
}

// Temporary in-memory addition of commands
app.post('/api/addCommand', (req, res) => {
    const { commandName, commandScript } = req.body;

    if (!commandName || !commandScript) {
        return res.status(400).json({ message: 'Command name and script are required.' });
    }

    // Add the command directly to the in-memory commands object
    commands[commandName] = {
        name: commandName,
        description: `Dynamically added command ${commandName}`,
        execute: new Function('api', 'message', commandScript)
    };

    res.status(201).json({ message: `Command '${commandName}' added temporarily.` });
});

app.get('/api/info', async (req, res) => {
    const { status: accessTokenStatus, botName } = await checkPageAccessToken();
    const commandNames = Object.keys(commands);
    
    res.json({
        botName,
        accessTokenStatus,
        totalCommands: commandNames.length,
        commands: commandNames,
    });
});

app.post('/api/restartBot', (req, res) => {
    try {
        commands = loadCommands(); // Reload commands from files only
        res.status(200).json({ message: 'Bot restarted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to restart the bot.' });
    }
});

getWebhook(app, VERIFY_TOKEN);
app.use(express.static(path.join(__dirname, 'site')));

app.listen(PORT, async () => {
    console.clear();
    postWebhook(app, commands);
});
