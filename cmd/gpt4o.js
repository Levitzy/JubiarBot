const axios = require('axios');
const api = require('../jubiar-pagebot-api/sendmessage');

function generateUID() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

module.exports = {
    name: 'gpt4o',
    description: 'Fetches a response from the GPT-4O API based on the user prompt in the format "gpt4o {user_input}".',

    async execute(senderId, messageText) {
        try {
            if (!messageText.startsWith('gpt4o ')) {
                await api.sendMessage(senderId, { text: 'Invalid format. Use: gpt4o {your prompt}' });
                return;
            }

            const userInput = messageText.slice(6).trim();
            const uid = generateUID();
            await api.sendMessage(senderId, { text: 'Processing your GPT-4O request, please wait...' });

            // Primary and fallback URLs
            const primaryUrl = `https://deku-rest-apis.ooguy.com/api/gpt-4o?q=${encodeURIComponent(userInput)}&uid=${uid}`;
            const fallbackUrl = `https://joshweb.click/api/gpt-4o?q=${encodeURIComponent(userInput)}&uid=${uid}`;

            let response;
            try {
                response = await axios.get(primaryUrl);
            } catch (primaryError) {
                await api.sendMessage(senderId, { text: 'The primary service is currently unavailable, switching to an alternative server...' });
                response = await axios.get(fallbackUrl);
            }

            let resultMessage = response.data.result || 'No response from GPT-4O.';
            resultMessage = resultMessage.replace(/(\*\*|\*|```|_|~|>)/g, '');
            await api.sendMessage(senderId, { text: resultMessage });
        } catch (error) {
            console.error(`Error executing ${this.name} command:`, error);
            await api.sendMessage(senderId, { text: 'An error occurred while processing your GPT-4O request.' });
        }
    },
};
