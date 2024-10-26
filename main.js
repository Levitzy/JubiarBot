// main.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const loadCommands = require('./utils/loadCommand');
const getWebhook = require('./utils/getWebhook');
const postWebhook = require('./utils/postWebhook');
const app = express();
const PORT = process.env.PORT || 3000;

const VERIFY_TOKEN = 'jubiar'; 
const PAGE_ACCESS_TOKEN = fs.readFileSync(path.join(__dirname, 'token.txt'), 'utf8').trim();
const BOT_NAME = 'JubiarBot';

app.use(bodyParser.json());

async function checkPageAccessToken() {
    try {
        const response = await axios.get(`https://graph.facebook.com/v12.0/me?access_token=${PAGE_ACCESS_TOKEN}`);
        return response.data ? 'Good' : 'Bad';
    } catch (error) {
        return 'Bad';
    }
}

let commands = {};

// API endpoint to restart the bot
app.post('/api/restartBot', (req, res) => {
    try {
        commands = loadCommands(); // Reload commands
        res.status(200).json({ message: 'Bot restarted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to restart the bot.' });
    }
});

// New API endpoint to fetch logs
app.get('/api/logBot', (req, res) => {
    fs.readFile(path.join(__dirname, 'bot.log'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to retrieve logs.' });
        }
        res.status(200).json({ logs: data.split('\n') });
    });
});

app.get('/api/info', async (req, res) => {
    const accessTokenStatus = await checkPageAccessToken();

    if (Object.keys(commands).length === 0) {
        commands = loadCommands();
    }

    const commandNames = Object.keys(commands);

    res.json({
        botName: BOT_NAME,
        accessTokenStatus: accessTokenStatus,
        totalCommands: commandNames.length,
        commands: commandNames,
    });
});

getWebhook(app, VERIFY_TOKEN);

app.use(express.static(path.join(__dirname, 'site')));

app.listen(PORT, async () => {
    console.clear();
    commands = loadCommands();
    postWebhook(app, commands);
});
