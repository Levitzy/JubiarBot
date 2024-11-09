const axios = require('axios');

module.exports = {
    name: 'ttdl',
    description: 'Downloads and sends the HD version of a TikTok video without watermark',

    async execute(senderId, messageText) {
        try {
            // Extract TikTok URL from user input
            const user_tiktok_url = messageText.split(' ')[1];  // Assumes the command format is "ttdl {TikTok URL}"

            // Fetch video data from the API
            const response = await axios.get(`https://api.kenliejugarap.com/tikwmbymarjhun/?url=${user_tiktok_url}&lang=en`);

            // Check if the response is successful and contains hd_play URL
            if (response.data && response.data.status === true) {
                const hdPlayUrl = response.data.hd_play;

                // Send the HD video to the user
                await api.sendMessage(senderId, {
                    attachment: {
                        type: 'video',
                        payload: {
                            url: hdPlayUrl,
                            is_reusable: true
                        }
                    }
                });
            } else {
                await api.sendMessage(senderId, { text: 'Failed to retrieve video. Please check the URL and try again.' });
            }
        } catch (error) {
            console.error(`Error executing ${this.name} command:`, error);
            await api.sendMessage(senderId, { text: 'An error occurred while processing your request.' });
        }
    }
};
