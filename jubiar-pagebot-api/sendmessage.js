const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// Read PAGE_ACCESS_TOKEN from token.txt
const PAGE_ACCESS_TOKEN = fs.readFileSync(path.join(__dirname, '../token.txt'), 'utf8').trim();

module.exports.sendMessage = async (recipientId, message) => {
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
