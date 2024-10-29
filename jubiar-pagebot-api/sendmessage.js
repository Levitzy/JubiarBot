const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const PAGE_ACCESS_TOKEN = fs.readFileSync(path.join(__dirname, '../token.txt'), 'utf8').trim();

const MAX_MESSAGE_LENGTH = 2000;  // Max characters allowed per message

const sendTypingIndicator = async (recipientId, action) => {
    const url = `https://graph.facebook.com/v11.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;
    await axios.post(url, {
        recipient: { id: recipientId },
        sender_action: action
    });
};

// Split a long message into chunks
function splitMessage(message) {
    const messageChunks = [];
    let start = 0;
    while (start < message.length) {
        const end = start + MAX_MESSAGE_LENGTH;
        messageChunks.push(message.slice(start, end));
        start = end;
    }
    return messageChunks;
}

module.exports.sendMessage = async (recipientId, message) => {
    const url = `https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;

    try {
        await sendTypingIndicator(recipientId, 'typing_on');

        if (message.filedata) {
            // Send file data as an attachment
            const formData = new FormData();
            formData.append('recipient', JSON.stringify({ id: recipientId }));
            formData.append('message', JSON.stringify({ attachment: message.attachment }));
            formData.append('filedata', message.filedata);

            await axios.post(url, formData, {
                headers: formData.getHeaders()
            });
        } else {
            // Check if message.text exceeds 2000 characters and split if necessary
            if (message.text && message.text.length > MAX_MESSAGE_LENGTH) {
                const messageChunks = splitMessage(message.text);
                for (const chunk of messageChunks) {
                    const data = { recipient: { id: recipientId }, message: { text: chunk } };
                    await axios.post(url, data);
                }
            } else {
                // Send a normal message without splitting
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

        // Send error details to the user
        const errorMessage = error.response?.data?.error?.message || error.message || 'An unknown error occurred.';
        await axios.post(url, {
            recipient: { id: recipientId },
            message: { text: `Error: ${errorMessage}` }
        });
    } finally {
        await sendTypingIndicator(recipientId, 'typing_off');
    }
};
