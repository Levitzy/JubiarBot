const axios = require('axios');
const { sendTypingIndicator } = require('../extra/sendTypingIndicator');
const fs = require('fs');
const path = require('path');

// Read PAGE_ACCESS_TOKEN from token.txt
const PAGE_ACCESS_TOKEN = fs.readFileSync(path.join(__dirname, '../token.txt'), 'utf8').trim();
const url = `https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;

// Function to send messages
module.exports.sendMessage = async (recipientId, message) => {
    try {
        // Turn on typing indicator
        await sendTypingIndicator(recipientId, 'typing_on');

        const data = {
            recipient: { id: recipientId },
            message: {}
        };

        if (message.filedata) {
            // Assuming `filedata` is a URL or an object with type and URL for attachment
            data.message.attachment = {
                type: message.filedata.type, // e.g., 'image', 'video', etc.
                payload: { url: message.filedata.url, is_reusable: true }
            };
        } else if (message.attachment) {
            // For other attachment types without `filedata`
            data.message.attachment = message.attachment;
        } else {
            // For plain text messages
            data.message.text = message.text;
        }

        // Send the request with axios
        await axios.post(url, data);
        console.log('Message sent successfully.');
    } catch (error) {
        console.error('Error sending message:', error.response ? error.response.data : error.message);
    } finally {
        // Turn off typing indicator
        await sendTypingIndicator(recipientId, 'typing_off');
    }
};
