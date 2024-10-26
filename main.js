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

app.use(bodyParser.json());

let commands = {};

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

app.get('/api/info', async (req, res) => {
    const { status: accessTokenStatus, botName } = await checkPageAccessToken();
    if (Object.keys(commands).length === 0) {
        commands = loadCommands();
    }

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
        commands = loadCommands();
        res.status(200).json({ message: 'Bot restarted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to restart the bot.' });
    }
});

getWebhook(app, VERIFY_TOKEN);
app.use(express.static(path.join(__dirname, 'site')));

app.listen(PORT, async () => {
    console.clear();
    commands = loadCommands();
    postWebhook(app, commands);
});
