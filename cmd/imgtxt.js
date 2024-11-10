const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'imgtxt',
    description: 'Send an image to extract text from it.',
    adminBot: false,
    async execute(senderId, messageText, messageId, messageAttachments) {
        if (messageAttachments && messageAttachments.length > 0) {
            const imageUrl = messageAttachments[0].payload.url; // Assuming the image URL is in this structure

            // Now reply to the user to inform them to wait while processing
            await api.replyMessage(senderId, { text: "Processing your image for text extraction..." }, messageId);

            // Call the image to text API
            try {
                const response = await axios.get(`https://img2txt.kenliejugarap.com/image2txt?url=${encodeURIComponent(imageUrl)}`);
                const extractedText = response.data.text; // Assuming the response has a text field

                // Send the extracted text back to the user
                await api.sendMessage(senderId, { text: `Extracted Text: ${extractedText}` });
            } catch (error) {
                console.error('Error extracting text from image:', error.message);
                await api.sendMessage(senderId, { text: "An error occurred while extracting text from the image." });
            }
        } else {
            await api.sendMessage(senderId, { text: "Please send an image." });
        }
    }
};
