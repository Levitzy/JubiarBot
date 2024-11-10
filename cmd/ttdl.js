const api = require('../jubiar-pagebot-api/sendmessage');
const axios = require('axios'); // Make sure axios is installed for API requests

module.exports = {
    name: 'ttdl', // Command keyword
    description: 'Downloads TikTok video without watermark and sends it as a video or a link if file size is too large',
    adminBot: false,
    async execute(senderId, messageText) {
        try {
            // Extract the TikTok URL from the user's message
            const userTikTokUrl = messageText.split(' ')[1]; // Assuming the command is followed by the URL
            if (!userTikTokUrl) {
                await api.sendMessage(senderId, { text: 'Please provide a TikTok URL.' });
                return;
            }

            // Fetch video data from the API
            const response = await axios.get(`https://api.kenliejugarap.com/tikwmbymarjhun/?url=${userTikTokUrl}&lang=en`);
            const videoData = response.data;

            if (videoData.status && videoData.response === 'success') {
                const videoUrl = videoData.hd_play;

                // Attempt to send video; if too large, fallback to URL
                const videoMessage = {
                    attachment: {
                        type: 'video',
                        payload: {
                            url: videoUrl,
                            is_reusable: true
                        }
                    }
                };

                try {
                    await api.sendMessage(senderId, videoMessage);
                } catch (error) {
                    if (error.message.includes("Attachment size exceeds allowable limit")) {
                        // Send the video URL as a fallback
                        await api.sendMessage(senderId, { text: `The video is too large to send directly. You can watch it here: ${videoUrl}` });
                    } else {
                        throw error;
                    }
                }
            } else {
                // Handle case where video data is not successfully retrieved
                await api.sendMessage(senderId, { text: 'Could not retrieve the video. Please check the URL and try again.' });
            }
        } catch (error) {
            console.error(`Error executing ${this.name} command:`, error);
            await api.sendMessage(senderId, { text: 'An error occurred while processing your request.' });
        }
    }
};
