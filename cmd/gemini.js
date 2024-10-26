const axios = require('axios');
const api = require('../jubiar-pagebot-api/sendmessage');

module.exports = {
    name: 'gemini',
    description: 'Fetches a response from the Gemini API based on the user prompt in the format "gemini {user_input}".',

    async execute(senderId, messageText) {
        try {
            if (!messageText.startsWith('gemini ')) {
                await api.sendMessage(senderId, { text: 'Invalid format. Use: gemini {your prompt}' });
                return;
            }

            const userInput = messageText.slice(7).trim();
            await api.sendMessage(senderId, { text: 'Processing your Gemini request, please wait...' });

            // Primary API URL
            const primaryUrl = `https://deku-rest-apis.ooguy.com/gemini?prompt=${encodeURIComponent(userInput)}`;
            // Fallback API URL
            const fallbackUrl = `https://joshweb.click/gemini?prompt=${encodeURIComponent(userInput)}`;

            let response;
            try {
                response = await axios.get(primaryUrl);
            } catch (primaryError) {
                console.warn('Primary domain failed, attempting fallback domain.');
                response = await axios.get(fallbackUrl);
            }

            let geminiMessage = response.data.gemini || 'No response from Gemini.';
            geminiMessage = geminiMessage.replace(/(\*\*|\*|```|_|~|>)/g, '');
            await api.sendMessage(senderId, { text: geminiMessage });
        } catch (error) {
            console.error(`Error executing ${this.name} command:`, error);
            await api.sendMessage(senderId, { text: 'An error occurred while processing your Gemini request.' });
        }
    },
};
