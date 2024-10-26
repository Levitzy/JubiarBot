const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const loadCommands = require('./utils/loadCommand');
const getWebhook = require('./utils/getWebhook');
const postWebhook = require('./utils/postWebhook');
const app = express();
const PORT = process.env.PORT || 3000;

const VERIFY_TOKEN = 'jubiar';
const tokenFilePath = path.join(__dirname, 'token.json');

app.use(bodyParser.json());

// Load tokens from token.json
function loadTokens() {
    if (!fs.existsSync(tokenFilePath)) {
        fs.writeFileSync(tokenFilePath, JSON.stringify({ tokens: [] }, null, 2));
    }
    const data = fs.readFileSync(tokenFilePath, 'utf8');
    return JSON.parse(data).tokens;
}

// Save a new token to token.json
function saveToken(newToken) {
    const tokens = loadTokens();
    tokens.push(newToken);
    fs.writeFileSync(tokenFilePath, JSON.stringify({ tokens }, null, 2));
}

// API to add a new page bot token
app.post('/api/addToken', (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ message: 'Token is required.' });
    }
    saveToken(token);
    res.status(200).json({ message: 'Token added successfully.' });
});

let commands = {};

app.get('/api/info', async (req, res) => {
    if (Object.keys(commands).length === 0) {
        commands = loadCommands();
    }

    const commandNames = Object.keys(commands);
    res.json({
        botName: "JubiarBot",
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
