const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const loadCommands = require('./utils/loadCommand'); // Import loadCommand.js
const getWebhook = require('./utils/getWebhook');    // Import getWebhook.js
const postWebhook = require('./utils/postWebhook');  // Import postWebhook.js
const app = express();
const PORT = process.env.PORT || 3000;

// Bot settings
const VERIFY_TOKEN = 'jubiar'; // Replace with your own verification token
const PAGE_ACCESS_TOKEN = fs.readFileSync(path.join(__dirname, 'token.txt'), 'utf8').trim();
const BOT_NAME = 'JubiarBot';  // Bot name

app.use(bodyParser.json());

// Check the Page Access Token status
async function checkPageAccessToken() {
    try {
        const response = await axios.get(`https://graph.facebook.com/v10.0/me?access_token=${PAGE_ACCESS_TOKEN}`);
        return response.data ? 'Good' : 'Bad';
    } catch (error) {
        return 'Bad';
    }
}

// Initialize a variable to store loaded commands
let commands = {};

// New API endpoint to fetch bot information
app.get('/api/info', async (req, res) => {
    const accessTokenStatus = await checkPageAccessToken();

    // Ensure commands are loaded before responding
    if (Object.keys(commands).length === 0) {
        commands = loadCommands();  // Ensure commands are only loaded once
    }

    const commandNames = Object.keys(commands);

    res.json({
        botName: BOT_NAME,
        accessTokenStatus: accessTokenStatus,
        totalCommands: commandNames.length,
    });
});

// Use the separated routes for GET and POST webhooks
getWebhook(app, VERIFY_TOKEN);

// Serve static files from the 'site' folder
app.use(express.static(path.join(__dirname, 'site')));

// Start the server and load commands when the server starts
app.listen(PORT, async () => {
    console.clear(); // Clear the console for a clean start
    commands = loadCommands(); // Load commands only once at server start
    postWebhook(app, commands); // Use the loaded commands in the POST webhook
});
