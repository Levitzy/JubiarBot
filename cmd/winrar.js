const axios = require('axios');
const fs = require('fs');
const fsp = require('fs').promises;

module.exports = {
    name: 'winrar',
    description: 'Generates a WinRAR license key',

    async execute(senderId, messageText) {
        // Check for user input; generate a random numeric string if none is provided
        const userInput = messageText.trim() || Math.floor(Math.random() * 1000000).toString();
        const apiUrl = `https://winrar.kenliejugarap.com/gen?user=${userInput}&license=${userInput}`;

        try {
            // Inform the user that the process is starting
            await api.sendMessage(senderId, { text: 'Generating your WinRAR license key, please wait...' });

            // Make the API call to generate the license key
            const response = await axios.get(apiUrl);
            const keyData = response.data.key;

            // Send the key data value back to the user
            await api.sendMessage(senderId, { text: keyData });

            // Create a temporary rarreg.key file with the license data
            const tempFilePath = `rarreg_${Date.now()}.key`;
            await fsp.writeFile(tempFilePath, keyData);

            // Send the rarreg.key file as a stream
            await api.sendMessage(senderId, {
                attachment: {
                    type: 'file',
                    payload: {
                        is_reusable: true
                    }
                },
                filedata: fs.createReadStream(tempFilePath) // Send as a file stream
            });

            // Clean up the file after sending
            await fsp.unlink(tempFilePath);

        } catch (error) {
            console.error(`Error executing ${this.name} command:`, error);
            await api.sendMessage(senderId, { text: 'An error occurred while generating the WinRAR license key.' });
        }
    }
};
