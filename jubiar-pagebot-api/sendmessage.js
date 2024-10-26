const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const tokenFilePath = path.join(__dirname, '../token.json');

// Load tokens from token.json
function loadTokens() {
    const data = fs.readFileSync(tokenFilePath, 'utf8');
    return JSON.parse(data).tokens;
}

// Get a random token from token.json
function getRandomToken() {
    const tokens = loadTokens();
    if (tokens.length === 0) {
        throw new Error("No tokens available in token.json.");
    }
    return tokens[Math.floor(Math.random() * tokens.length)];
}

module.exports.sendMessage = async (recipientId, message) => {
    const PAGE_ACCESS_TOKEN = getRandomToken();
    const url = `https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;

    try {
        if (message.filedata) {
            // If there's a file, use FormData to send it as a file attachment
            const formData = new FormData();
            formData.append('recipient', JSON.stringify({ id: recipientId }));
            formData.append('message', JSON.stringify({ attachment: message.attachment }));
            formData.append('filedata', message.filedata);

            // Send the request with FormData headers
            await axios.post(url, formData, {
                headers: formData.getHeaders()
            });
        } else {
            // Otherwise, send text or other attachments without filedata
            const data = {
                recipient: { id: recipientId },
                message: message.attachment ? { attachment: message.attachment } : { text: message.text }
            };
            await axios.post(url, data);
        }

        console.log('Message sent successfully.');
    } catch (error) {
        console.error('Error sending message:', error.response ? error.response.data : error.message);
    }
};
