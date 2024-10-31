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

let commands = {};

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

// Endpoint to add a new command dynamically
app.post('/api/addCommand', async (req, res) => {
    const { commandName, commandScript } = req.body;

    if (!commandName || !commandScript) {
        return res.status(400).json({ message: 'Command name and script are required.' });
    }

    // Define the path where the new command will be saved
    const commandPath = path.join(__dirname, 'commands', `${commandName}.js`);

    // Write the command script to a new file
    try {
        fs.writeFileSync(commandPath, commandScript);

        // Reload the commands
        commands = loadCommands();

        res.status(201).json({ message: `Command '${commandName}' added successfully.` });
    } catch (error) {
        console.error('Failed to add new command:', error);
        res.status(500).json({ message: 'Failed to add the command.' });
    }
});

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
