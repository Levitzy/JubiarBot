const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'shoti',
    description: 'Fetches a video using the Shoti API, downloads it, and sends it as a video attachment.',
    adminBot: false,
    async execute(senderId, messageText) {
        try {
            if (messageText.trim() === this.name) {
                await api.sendMessage(senderId, {
                    text: 'Processing your video, please wait...'
                });

                // Request the video details
                const response = await axios.get('https://shoti.kenliejugarap.com/getvideo.php?apikey=shoti-7eb71049889365e4d57c63fcb3e1d5e1bb80a178e4016bb48df704b0ed4f95798cb464105ae55c064bebb5d2470beed4c077a7bcf5f4b9673ecaaef349530bea2375588713cc819677428b042e9d665c85977c68cc');

                if (response.data.status) {
                    const videoUrl = response.data.videoDownloadLink;
                    const videoTitle = response.data.title;
                    const tiktokUrl = response.data.tiktokUrl; // New data field from the API
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

                    // Send video attachment
                    await api.sendMessage(senderId, {
                        attachment: {
                            type: 'video',
                            payload: {
                                url: videoUrl,
                                is_reusable: true
                            }
                        }
                    });

                    // Send formatted message with credits
                    await api.sendMessage(senderId, {
                        text: `${videoTitle}\n\n${tiktokUrl}\n\nCredits: Kenlie`
                    });

                    fs.unlinkSync(tempFilePath);
                } else {
                    await api.sendMessage(senderId, { text: 'Sorry, no video was found.' });
                }
            }
        } catch (error) {
            console.error('Error fetching, downloading, or sending the video:', error);
            await api.sendMessage(senderId, { text: 'An error occurred while fetching the video. Please try again later.' });
        }
    }
};
