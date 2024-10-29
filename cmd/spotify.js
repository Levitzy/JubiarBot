const api = require('../jubiar-pagebot-api/sendmessage');

module.exports = {
    name: 'spotify', // Command trigger: "spotify {user_input}"
    description: 'Fetches Spotify audio based on user input.',

    async execute(senderId, messageText) {
        try {
            // Extract the search query from the command, removing 'spotify' from the input
            const query = messageText.slice(8).trim(); // Adjusts for "spotify " prefix

            if (!query) {
                await api.sendMessage(senderId, { text: 'Please provide a search term after "spotify".' });
                return;
            }

            // Build the API URL with the user input
            const apiUrl = `https://joshweb.click/api/spotify2?q=${encodeURIComponent(query)}`;

            // Fetch the data from the Spotify API
            const response = await fetch(apiUrl);
            const data = await response.json();

            // Check if the data contains audio information
            if (data && data.audio_url) {
                // Send the audio as a response
                await api.sendMessage(senderId, {
                    attachment: {
                        type: 'audio',
                        payload: {
                            url: data.audio_url // Replace with actual audio URL from API response
                        }
                    }
                });
            } else {
                // Inform the user if no audio was found
                await api.sendMessage(senderId, { text: `No audio found for "${query}". Try a different search term.` });
            }
        } catch (error) {
            console.error(`Error executing ${this.name} command:`, error);
            await api.sendMessage(senderId, { text: 'An error occurred while fetching audio from Spotify.' });
        }
    }
};
