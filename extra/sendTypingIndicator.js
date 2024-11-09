const axios = require('axios');
const fs = require('fs');
const path = require('path');
const config = require('../config.json');
const PAGE_ACCESS_TOKEN = config.PAGE_ACCESS_TOKEN;

const url = `https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;

async function sendTypingIndicator(recipientId, action) {
    try {
        await axios.post(url, {
            recipient: { id: recipientId },
            sender_action: action
        });
     //   console.log(`Typing indicator '${action}' sent successfully.`);
    } catch (error) {
        console.error('Error sending typing indicator:', error.response ? error.response.data : error.message);
    }
}

module.exports = { sendTypingIndicator };
