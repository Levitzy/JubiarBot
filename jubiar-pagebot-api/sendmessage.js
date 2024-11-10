const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const splitMessage = require('../extra/splitMessage');  // Import splitMessage function

const config = require('../config.json');
const PAGE_ACCESS_TOKEN = config.PAGE_ACCESS_TOKEN;


const sendTypingIndicator = async (recipientId, action) => {
    const url = `https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;
    await axios.post(url, {
        recipient: { id: recipientId },
        sender_action: action
    });
};

module.exports.sendMessage = async (recipientId, message) => {
    const url = `https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;

    try {
        await sendTypingIndicator(recipientId, 'typing_on');

        if (message.filedata) {
            const formData = new FormData();
            formData.append('recipient', JSON.stringify({ id: recipientId }));
            formData.append('message', JSON.stringify({ attachment: message.attachment }));
            formData.append('filedata', message.filedata);

            await axios.post(url, formData, {
                headers: formData.getHeaders()
            });
        } else {
            if (message.text && message.text.length > 2000) {
                const messageChunks = splitMessage(message.text);
                for (const chunk of messageChunks) {
                    const data = { recipient: { id: recipientId }, message: { text: chunk } };
                    await axios.post(url, data);
                }
            } else {
                const data = {
                    recipient: { id: recipientId },
                    message: message.attachment ? { attachment: message.attachment } : { text: message.text }
                };
                await axios.post(url, data);
            }
        }

        console.log('Message sent successfully.');
    } catch (error) {
        console.error('Error sending message:', error.message);

        const errorMessage = error.response?.data?.error?.message || error.message || 'An unknown error occurred.';
        await axios.post(url, {
            recipient: { id: recipientId },
            message: { text: `Error: ${errorMessage}` }
        });
    } finally {
        await sendTypingIndicator(recipientId, 'typing_off');
    }
};
