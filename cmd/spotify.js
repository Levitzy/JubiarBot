const axios = require('axios');

module.exports = {
    name: 'spotify',
    description: 'Fetches a Spotify song link and details based on user input.',

    async execute(senderId, messageText) {
        try {
            // Extract the search query by removing the command keyword
            const args = messageText.split(' ').slice(1);
            if (args.length === 0) {
                await api.sendMessage(senderId, { text: 'Please specify a song name after the command.' });
                return;
            }

            // Fetch song data from the API
            const { data } = await axios.get(`https://hiroshi-api.onrender.com/tiktok/spotify?search=${encodeURIComponent(args.join(' '))}`);
            const songData = data[0];
            const link = songData?.download;
            const name = songData?.name;

            // Check if a link was retrieved
            if (link) {
                // Send the audio file first
                await api.sendMessage(senderId, {
                    attachment: {
                        type: 'audio',
                        payload: {
                            url: link
                        }
                    }
                });

                // Send additional information about the song
                await api.sendMessage(senderId, {
                    text: `Name: ${name || 'Unknown'}\nDownload URL: ${link}`
                });
            } else {
                await api.sendMessage(senderId, { text: 'Sorry, I could not find the song. Please try a different search term.' });
            }

        } catch (error) {
            console.error(`Error executing spotify command:`, error);
            await api.sendMessage(senderId, { text: 'An error occurred while processing your Spotify request.' });
        }
    }
};
