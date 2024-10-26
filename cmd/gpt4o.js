const axios = require('axios');
const api = require('../jubiar-pagebot-api/sendmessage');

// Helper function to generate a random UID
function generateUID() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

module.exports = {
    name: 'gpt4o',
    description: 'Fetches a response from the GPT-4O API based on the user prompt in the format "gpt4o {user_input}".',

    async execute(senderId, messageText) {
        try {
            // Validate that the command starts with "gpt4o "
            if (!messageText.startsWith('gpt4o ')) {
                await api.sendMessage(senderId, { text: 'Invalid format. Use: gpt4o {your prompt}' });
                return;
            }

            // Extract the user input after "gpt4o "
            const userInput = messageText.slice(6).trim();
            const uid = generateUID();

            // Send a message indicating processing has started
            await api.sendMessage(senderId, { text: 'Processing your GPT-4O request, please wait...' });

            // Set up the API request
            const url = `https://deku-rest-apis.ooguy.com/api/gpt-4o?q=${encodeURIComponent(userInput)}&uid=${uid}`;
            const response = await axios.get(url);

            // Extract the "result" value from the response
            let resultMessage = response.data.result || 'No response from GPT-4O.';

            // Remove markdown symbols for clarity
            resultMessage = resultMessage.replace(/(\*\*|\*|```|_|~|>)/g, '');

            // Send the cleaned response back to the user
            await api.sendMessage(senderId, { text: resultMessage });
        } catch (error) {
            console.error(`Error executing ${this.name} command:`, error);
            await api.sendMessage(senderId, { text: 'An error occurred while processing your GPT-4O request.' });
        }
    },
};
