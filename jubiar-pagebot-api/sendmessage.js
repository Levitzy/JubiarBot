const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Read token.txt for PAGE_ACCESS_TOKEN
const PAGE_ACCESS_TOKEN = fs.readFileSync(path.join(__dirname, '../token.txt'), 'utf8').trim();

module.exports.sendMessage = async (recipientId, message) => {
    const url = `https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;

    // Check if the message includes an attachment or text
    const data = {
        recipient: { id: recipientId },
        message: message.attachment ? { attachment: message.attachment } : { text: message.text }
    };

    try {
        // If there's a filedata (for video), use form-data to send the file
        if (message.filedata) {
            const formData = new FormData();
            formData.append('recipient', JSON.stringify({ id: recipientId }));
            formData.append('message', JSON.stringify({ attachment: message.attachment }));
            formData.append('filedata', message.filedata);

            // Send request with the form data
            await axios.post(url, formData, {
                headers: formData.getHeaders()
            });
        } else {
            // Otherwise, send normal text or attachment without filedata
            await axios.post(url, data);
        }

        console.log('Message sent successfully.');
    } catch (error) {
        console.error('Error sending message:', error.response ? error.response.data : error.message);
    }
};
