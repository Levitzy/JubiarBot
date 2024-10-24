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
        const response = await axios.get(`https://graph.facebook.com/v21.0/me?access_token=${PAGE_ACCESS_TOKEN}`);
        return response.data ? 'Good' : 'Bad';
    } catch (error) {
        return 'Bad';
    }
}

// Use the separated routes for GET and POST webhooks
getWebhook(app, VERIFY_TOKEN);

// Serve dynamically injected index.html
app.get('/', async (req, res) => {
    const accessTokenStatus = await checkPageAccessToken();
    const { commands } = loadCommands(PORT);
    const commandNames = Object.keys(commands);
    
    // Read and inject data into index.html
    fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading the file.');
        }

        // Replace placeholders with dynamic content
        let html = data
            .replace('{Namebot}', BOT_NAME)
            .replace('{Good or bad}', accessTokenStatus)
            .replace('{command.length}', commandNames.length);

        res.send(html);  // Send the injected HTML
    });
});

// Start the server and load commands when the server starts
app.listen(PORT, async () => {
    console.clear(); // Clear the console for a clean start
    const { commands } = loadCommands(PORT);
    postWebhook(app, commands);
});
