const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const { sendTypingIndicator } = require('../extra/sendTypingIndicator'); // Adjust path as needed

// Read PAGE_ACCESS_TOKEN from token.txt
const PAGE_ACCESS_TOKEN = fs.readFileSync(path.join(__dirname, '../token.txt'), 'utf8').trim();

module.exports.sendMessage = async (recipientId, message) => {
    const url = `https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;

    try {
        // Start typing indicator
        await sendTypingIndicator(recipientId, 'typing_on');

        // Check if the message includes a file to send
        if (message.filedata) {
            // Handle file upload
            const form = new FormData();
            form.append('recipient', JSON.stringify({ id: recipientId }));
            form.append('message', JSON.stringify({
                attachment: {
                    type: message.attachment.type,
                    payload: {
                        is_reusable: message.attachment.payload.is_reusable
                    }
                }
            }));
            form.append('filedata', message.filedata);

            // Send the form-data as a POST request
            await axios.post(url, form, {
                headers: {
                    ...form.getHeaders()
                }
            });
        } else {
            // Define data structure for either text or attachment message without file upload
            const data = {
                recipient: { id: recipientId },
                message: message.attachment ? { attachment: message.attachment } : { text: message.text }
            };

            // Send the message
            await axios.post(url, data);
        }
    } catch (error) {
        const errorMessage = error.response?.data?.error?.message || error.message || 'An unknown error occurred.';
        await axios.post(url, {
            recipient: { id: recipientId },
            message: { text: `Error: ${errorMessage}` }
        });
    } finally {
        // Stop typing indicator
        await sendTypingIndicator(recipientId, 'typing_off');
    }
};
