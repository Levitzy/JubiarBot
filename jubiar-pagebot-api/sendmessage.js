const axios = require('axios');
const fs = require('fs');
const path = require('path');

const tokenFilePath = path.join(__dirname, '../token.json');

// Load tokens from token.json
function loadTokens() {
    const data = fs.readFileSync(tokenFilePath, 'utf8');
    return JSON.parse(data).tokens;
}

// Function to randomly select a token
function getRandomToken() {
    const tokens = loadTokens();
    if (tokens.length === 0) {
        throw new Error("No tokens available in token.json.");
    }
    return tokens[Math.floor(Math.random() * tokens.length)];
}

// Function to send a message using a random token
async function sendMessage(recipientId, message) {
    try {
        const token = getRandomToken();
        const response = await axios.post(`https://graph.facebook.com/v11.0/me/messages?access_token=${token}`, {
            recipient: { id: recipientId },
            message: message
        });
        return response.data;
    } catch (error) {
        console.error("Error sending message:", error.message);
        throw new Error("Failed to send message");
    }
}

module.exports = {
    sendMessage
};
