const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const PAGE_ACCESS_TOKEN = fs.readFileSync(path.join(__dirname, '../token.txt'), 'utf8').trim();

const sendTypingIndicator = async (recipientId, action) => {
    const url = `https://graph.facebook.com/v11.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;
    await axios.post(url, {
        recipient: { id: recipientId },
        sender_action: action
    });
};

module.exports.sendMessage = async (recipientId, message) => {
    const url = `https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;

    try {
        // Turn on typing indicator
        await sendTypingIndicator(recipientId, 'typing_on');

        if (message.filedata) {
            // Send file data as an attachment using FormData
            const formData = new FormData();
            formData.append('recipient', JSON.stringify({ id: recipientId }));
            formData.append('message', JSON.stringify({ attachment: message.attachment }));
            formData.append('filedata', message.filedata);

            await axios.post(url, formData, {
                headers: formData.getHeaders()
            });
        } else {
            // Send text or other attachments without filedata
            const data = {
                recipient: { id: recipientId },
                message: message.attachment ? { attachment: message.attachment } : { text: message.text }
            };
            await axios.post(url, data);
        }

        console.log('Message sent successfully.');
    } catch (error) {
        console.error('Error sending message:', error.message);

        // Send error details to the user
        const errorMessage = error.response?.data?.error?.message || error.message || 'An unknown error occurred.';
        await axios.post(url, {
            recipient: { id: recipientId },
            message: { text: `Error: ${errorMessage}` }
        });
    } finally {
        // Turn off typing indicator
        await sendTypingIndicator(recipientId, 'typing_off');
    }
};
