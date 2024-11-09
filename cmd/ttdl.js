const api = require('../jubiar-pagebot-api/sendmessage');
const axios = require('axios');

module.exports = {
    name: 'ttdl',
    description: 'Downloads and sends a TikTok video in HD without watermark.',

    async execute(senderId, messageText) {
        try {
            // Extract the TikTok URL from the user's message
            const user_tiktok_url = messageText.split(' ')[1]; // assuming the command format is 'ttdl <tiktok_url>'
            if (!user_tiktok_url) {
                await api.sendMessage(senderId, { text: 'Please provide a valid TikTok URL.' });
                return;
            }

            // Fetch the video data from the API
            const response = await axios.get(`https://api.kenliejugarap.com/tikwmbymarjhun/?url=${user_tiktok_url}&lang=en`);

            // Check if the API response was successful
            if (response.data.status && response.data.response === 'success') {
                const hdVideoUrl = response.data.hd_play;
                
                // Send the HD video to the user
                await api.sendMessage(senderId, {
                    attachment: {
                        type: 'video',
                        payload: {
                            url: hdVideoUrl,
                            is_reusable: true
                        }
                    }
                });
            } else {
                // Handle the case where the API did not return a successful response
                await api.sendMessage(senderId, { text: 'Failed to retrieve the video. Please check the URL or try again later.' });
            }
        } catch (error) {
            console.error(`Error executing ${this.name} command:`, error);
            await api.sendMessage(senderId, { text: 'An error occurred while processing your request.' });
        }
    }
};
