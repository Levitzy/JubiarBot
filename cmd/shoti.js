const axios = require('axios');
const fs = require('fs');
const path = require('path');
const api = require('../jubiar-pagebot-api/sendmessage');
const { deleteMessage } = require('../jubiar-pagebot-api/deletemessage');

module.exports = {
    name: 'shoti',
    description: 'Fetches a video using the Shoti API, downloads it, and sends it as a video attachment.',

    async execute(senderId, messageText) {
        let processingMessageId = null;

        try {
            if (messageText.trim() === this.name) {
                // Send "processing" message
                const processingMessage = await api.sendMessage(senderId, {
                    text: 'Processing your video, please wait...'
                });
                
                // Capture the message ID of the "processing" message
                processingMessageId = processingMessage.message_id;

                // Request the video details
                const response = await axios.get('https://shoti.kenliejugarap.com/getvideo.php?apikey=shoti-0763839a3b9de35ae3da73816d087d57d1bbae9f8997d9ebd0da823850fb80917e69d239a7f7db34b4d139a5e3b02658ed26f49928e5ab40f57c9798c9ae7290c536d8378ea8b01399723aaf35f62fae7c58d08f04');

                if (response.data.status) {
                    const videoUrl = response.data.videoDownloadLink;
                    const videoTitle = response.data.title;
                    const tempFilePath = path.join(__dirname, "shoti.mp4");

                    // Download and save the video
                    const videoStream = await axios({
                        url: videoUrl,
                        method: 'GET',
                        responseType: 'stream'
                    });

                    const writer = fs.createWriteStream(tempFilePath);
                    videoStream.data.pipe(writer);

                    await new Promise((resolve, reject) => {
                        writer.on('finish', resolve);
                        writer.on('error', reject);
                    });

                    // Send text with the video attachment
                    const videoMessage = await api.sendMessage(senderId, {
                        text: `${videoTitle}\n\nCreated by Jubiar`,
                        attachment: {
                            type: 'video',
                            payload: {
                                url: videoUrl,
                                is_reusable: true
                            }
                        }
                    });

                    // Delete "processing" message
                    if (processingMessageId) {
                        await deleteMessage(processingMessageId);
                    }

                    fs.unlinkSync(tempFilePath);
                } else {
                    await api.sendMessage(senderId, { text: 'Sorry, no video was found.' });
                }
            }
        } catch (error) {
            console.error('Error fetching, downloading, or sending the video:', error);
            await api.sendMessage(senderId, { text: 'An error occurred while fetching the video. Please try again later.' });
        } finally {
            // Ensure "processing" message is deleted if it hasn't been already
            if (processingMessageId) {
                await deleteMessage(processingMessageId);
            }
        }
    }
};
