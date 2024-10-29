const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { sendTypingIndicator } = require('../extra/sendTypingIndicator'); // Adjust path as needed

// Read PAGE_ACCESS_TOKEN from token.txt
const PAGE_ACCESS_TOKEN = fs.readFileSync(path.join(__dirname, '../token.txt'), 'utf8').trim();

module.exports.sendMessage = async (recipientId, message) => {
    const url = `https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;

    try {
        // Start typing indicator
        await sendTypingIndicator(recipientId, 'typing_on');

        // Define data structure for either text or attachment message
        const data = {
            recipient: { id: recipientId },
            message: message.attachment ? { attachment: message.attachment } : { text: message.text }
        };

        // Send the message
        await axios.post(url, data);

        console.log('Message sent successfully.');
    } catch (error) {
        console.error('Error sending message:', error.response ? error.response.data : error.message);
    } finally {
        // Stop typing indicator
        await sendTypingIndicator(recipientId, 'typing_off');
    }
};
