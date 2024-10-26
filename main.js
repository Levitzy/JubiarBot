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
const PAGE_ACCESS_TOKEN = fs.readFileSync(path.join(__dirname, 'token.txt'), 'utf8').trim();

app.use(bodyParser.json());

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
