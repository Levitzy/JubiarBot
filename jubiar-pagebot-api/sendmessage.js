const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Read token.txt for PAGE_ACCESS_TOKEN
const PAGE_ACCESS_TOKEN = fs.readFileSync(path.join(__dirname, '../token.txt'), 'utf8').trim();

module.exports.sendMessage = async (recipientId, message) => {
    const url = `https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;
    const data = {
        recipient: { id: recipientId },
        message: { text: message }
    };

    try {
        await axios.post(url, data);
        console.log('Message sent successfully.');
    } catch (error) {
        console.error('Error sending message:', error.response ? error.response.data : error.message);
    }
};
