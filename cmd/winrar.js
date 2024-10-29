const axios = require('axios');
const fs = require('fs');
const fsp = require('fs').promises;

module.exports = {
    name: 'winrar',
    description: 'Generates a WinRAR license key',

    async execute(senderId, messageText) {
        let userInput = messageText.trim();
        let nameForLicense;

        // Check if user input is provided
        if (userInput) {
            nameForLicense = userInput;
        } else {
            // Fetch a random name if no user input is provided
            try {
                const randomUserResponse = await axios.get('https://randomuser.me/api/?results=1&inc=name');
                const randomName = randomUserResponse.data.results[0].name;
                nameForLicense = `${randomName.first} ${randomName.last}`;
            } catch (error) {
                console.error('Error fetching random name:', error);
                await api.sendMessage(senderId, { text: 'Error generating a random name for the license.' });
                return;
            }
        }

        const apiUrl = `https://winrar.kenliejugarap.com/gen?user=${nameForLicense}&license=${nameForLicense}`;

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
