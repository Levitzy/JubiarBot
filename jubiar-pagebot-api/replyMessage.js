const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// Read PAGE_ACCESS_TOKEN from token.txt
const config = require('../config.json');
const PAGE_ACCESS_TOKEN = config.PAGE_ACCESS_TOKEN;


module.exports.replyMessage = async (recipientId, message, messageId) => {
    const url = `https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;

    try {
        if (message.filedata) {
            // Handle file data as an attachment using FormData
            const formData = new FormData();
            formData.append('recipient', JSON.stringify({ id: recipientId }));
            formData.append('message', JSON.stringify({ attachment: message.attachment }));
            formData.append('filedata', message.filedata);
            formData.append('reply_to', messageId); // Specify message_id to reply to

            await axios.post(url, formData, {
                headers: formData.getHeaders()
            });
        } else {
            // Handle text or attachment messages without filedata
            const data = {
                recipient: { id: recipientId },
                message: message.attachment ? { attachment: message.attachment } : { text: message.text },
                reply_to: messageId // Specify message_id to reply to
            };
            await axios.post(url, data);
        }

        console.log('Reply sent successfully.');
    } catch (error) {
        console.error('Error sending reply:', error.response ? error.response.data : error.message);
    }
};
