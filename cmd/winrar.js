const api = require('../jubiar-pagebot-api/sendmessage');
const fs = require('fs');
const axios = require('axios');
const path = require('path');

module.exports = {
    name: 'winrar',
    description: 'Generates a WinRAR license key',

    async execute(senderId, messageText) {
        const userInput = messageText.trim();
        const apiUrl = `https://winrar.kenliejugarap.com/gen?user=${userInput}&license=${userInput}`;

        try {
            // Make the API call
            const response = await axios.get(apiUrl);
            const keyData = response.data.key;

            // Send the key data value back to the user
            await api.sendMessage(senderId, { text: keyData });

            // Create a temporary rarreg.key file with the license data
            const tempFilePath = path.join(__dirname, 'rarreg.key');
            fs.writeFileSync(tempFilePath, keyData, 'utf8');

            // Send the rarreg.key file to the user
            await api.sendMessage(senderId, {
                attachment: {
                    type: 'file',
                    payload: {
                        is_reusable: true
                    }
                }
            });

        } catch (error) {
            console.error(`Error executing ${this.name} command:`, error);
            await api.sendMessage(senderId, { text: 'An error occurred while generating the WinRAR license key.' });
        }
    }
};
