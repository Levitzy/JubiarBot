const axios = require('axios');
const FormData = require('form-data');
const { sendTypingIndicator } = require('../extra/sendTypingIndicator');

// Function to send messages
module.exports.sendMessage = async (recipientId, message) => {
    try {
        // Turn on typing indicator
        await sendTypingIndicator(recipientId, 'typing_on');

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
            // Otherwise, send text or other types of attachments
            const data = {
                recipient: { id: recipientId },
                message: message.attachment ? { attachment: message.attachment } : { text: message.text }
            };
            await axios.post(url, data);
        }

        console.log('Message sent successfully.');
    } catch (error) {
        console.error('Error sending message:', error.response ? error.response.data : error.message);
    } finally {
        // Turn off typing indicator
        await sendTypingIndicator(recipientId, 'typing_off');
    }
};
