const axios = require('axios');

module.exports = {
    name: 'ytmp3',
    description: 'Converts YouTube video links to MP3 and sends the file to the user',
    adminBot: false,
    async execute(senderId, messageText) {
        const youtubeUrl = messageText.split(' ')[1]; // Assumes the command is called with "/ytmp3 <youtube_link>"

        if (!youtubeUrl) {
            await api.sendMessage(senderId, { text: 'Please provide a valid YouTube link.' });
            return;
        }

        try {
            // Notify user of processing
            await api.sendMessage(senderId, { text: 'Processing your MP3 download, please wait...' });

            // Make API call to get the MP3 file link
            const response = await axios.get(`https://apiv2.kenliejugarap.com/music?url=${youtubeUrl}`);
            const data = response.data;

            // Check if API response is successful
            if (data.status && data.response) {
                // Send MP3 file link to the user
                await api.sendMessage(senderId, {
                    attachment: {
                        type: 'audio',
                        payload: {
                            url: data.response,
                            is_reusable: true
                        }
                    }
                });

                // Send title, note, and download link
                await api.sendMessage(senderId, {
                    text: `Title: ${data.title}\n\nNote: ${data.note}\n\nDownload: ${data.response}`
                });
            } else {
                await api.sendMessage(senderId, { text: 'Failed to retrieve the MP3 file. Please try again later.' });
            }
        } catch (error) {
            console.error(`Error executing ytmp3 command:`, error);
            await api.sendMessage(senderId, { text: 'An error occurred while processing your request. Please try again.' });
        }
    }
};
