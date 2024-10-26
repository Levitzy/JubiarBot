const axios = require('axios');
const api = require('../jubiar-pagebot-api/sendmessage');

module.exports = {
    name: 'gemini',
    description: 'Fetches a response from the Gemini API based on the user prompt in the format "gemini {user_input}".',

    async execute(senderId, messageText) {
        try {
            // Validate that the command starts with "gemini "
            if (!messageText.startsWith('gemini ')) {
                await api.sendMessage(senderId, { text: 'Invalid format. Use: gemini {your prompt}' });
                return;
            }

            // Extract the user input after "gemini "
            const userInput = messageText.slice(7).trim();

            // Send a message indicating processing has started
            await api.sendMessage(senderId, { text: 'Processing your Gemini request, please wait...' });

            // Set up the API request
            const url = `https://deku-rest-apis.ooguy.com/gemini?prompt=${encodeURIComponent(userInput)}`;
            const response = await axios.get(url);

            // Extract the "gemini" value from the response
            let geminiMessage = response.data.gemini || 'No response from Gemini.';

            // Remove markdown symbols for clarity
            geminiMessage = geminiMessage.replace(/(\*\*|\*|```|_|~|>)/g, '');

            // Send the cleaned response back to the user
            await api.sendMessage(senderId, { text: geminiMessage });
        } catch (error) {
            console.error(`Error executing ${this.name} command:`, error);
            await api.sendMessage(senderId, { text: 'An error occurred while processing your Gemini request.' });
        }
    },
};
