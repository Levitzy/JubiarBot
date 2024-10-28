const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Read PAGE_ACCESS_TOKEN from token.txt
const PAGE_ACCESS_TOKEN = fs.readFileSync(path.join(__dirname, '../token.txt'), 'utf8').trim();
const url = `https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;

// Function to delete a message
async function deleteMessage(messageId) {
    try {
        const deleteUrl = `https://graph.facebook.com/v21.0/${messageId}?access_token=${PAGE_ACCESS_TOKEN}`;
        await axios.delete(deleteUrl);
        console.log(`Message with ID ${messageId} deleted successfully.`);
    } catch (error) {
        console.error('Error deleting message:', error.response ? error.response.data : error.message);
    }
}

module.exports = { deleteMessage };
