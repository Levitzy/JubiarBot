const api = require('../jubiar-pagebot-api/sendmessage');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'winrar',
    description: 'Generates a WinRAR license key and provides the key to the user',

    async execute(senderId, messageText) {
        const userInput = messageText.split(' ')[1]; // Assumes user input format is 'winrar <user_input>'
        if (!userInput) {
            await api.sendMessage(senderId, { text: 'Please provide the required input in the format: winrar <user_input>' });
            return;
        }

        try {
            // Call the API to generate the license key
            const response = await axios.get(`https://winrar.kenliejugarap.com/gen?user=${userInput}&license=${userInput}`);
            const licenseKey = response.data.key;

            // Send the key back to the user
            await api.sendMessage(senderId, { text: `Here is your generated key: ${licenseKey}` });

            // Create a temporary rarreg.key file with the license key
            const keyFilePath = path.join(__dirname, 'rarreg.key');
            fs.writeFileSync(keyFilePath, licenseKey);

            // Provide feedback to the user
            await api.sendMessage(senderId, { text: 'The rarreg.key file has been created successfully.' });

        } catch (error) {
            console.error(`Error executing winrar command:`, error);
            await api.sendMessage(senderId, { text: 'An error occurred while generating the license key.' });
        }
    }
};
