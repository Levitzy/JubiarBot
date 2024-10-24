const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const loadCommands = require('./utils/loadCommand'); // Import loadCommand.js
const getWebhook = require('./utils/getWebhook');    // Import getWebhook.js
const postWebhook = require('./utils/postWebhook');  // Import postWebhook.js
const app = express();
const PORT = process.env.PORT || 3000;

// PageBot Name
const PageBotName = 'Jubiar PageBot';

// Read token.txt for PAGE_ACCESS_TOKEN
let pageAccessTokenStatus = 'Bad';
let PAGE_ACCESS_TOKEN = '';

try {
    PAGE_ACCESS_TOKEN = fs.readFileSync(path.join(__dirname, 'token.txt'), 'utf8').trim();
    pageAccessTokenStatus = 'Good';
} catch (error) {
    console.error('Error reading PAGE_ACCESS_TOKEN:', error.message);
    pageAccessTokenStatus = 'Bad';
}

// Read the verification token
const VERIFY_TOKEN = 'jubiar'; // Replace with your own verification token

app.use(bodyParser.json());

// Use the separated routes for GET and POST webhooks
getWebhook(app, VERIFY_TOKEN);

// Serve index.html and pass in the total number of commands
app.get('/', (req, res) => {
    const { commands } = loadCommands(PORT); // Load the commands to count them
    const totalCommands = Object.keys(commands).length;

    // Inject the total commands into the HTML
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${PageBotName}</title>
    </head>
    <body>
        <h1>Welcome to ${PageBotName}</h1>
        <p>This bot is connected to Facebook Messenger and is ready to serve commands.</p>
        <p>Total Commands: ${totalCommands}</p>
    </body>
    </html>
    `);
});

// Serve total commands as JSON for the static index.html
app.get('/api/totalCommands', (req, res) => {
    const { commands } = loadCommands(PORT);
    res.json({ totalCommands: Object.keys(commands).length });
});


// Start the server and load commands when the server starts
app.listen(PORT, () => {
    const { commands } = loadCommands(PORT); // Load the commands
    postWebhook(app, commands); // Set up postWebhook after loading commands

    console.clear(); // Clear the console for a clean start
    console.log(`===========================`);
    console.log(`   ${PageBotName} is Online   `);
    console.log(`===========================`);
    console.log(`Server is listening on port ${PORT}`);
    console.log(`PageBot Name: ${PageBotName}`);
    console.log(`Page Access Token Status: ${pageAccessTokenStatus}`);
    console.log(`===========================`);
});
