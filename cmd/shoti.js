const axios = require('axios');
const fs = require('fs');
const path = require('path');
const api = require('../jubiar-pagebot-api/sendmessage');

module.exports = {
    name: 'shoti',  // The name of the command
    description: 'Fetches a video using the Shoti API, downloads it, and sends it as a video attachment.',

    async execute(senderId, messageText) {
        try {
            // Check if the message text matches the command name
            if (messageText.trim() === this.name) {
                // Make the API request to get the video
                const response = await axios.get('https://shoti.kenliejugarap.com/getvideo.php?apikey=shoti-0763839a3b9de35ae3da73816d087d57d1bbae9f8997d9ebd0da823850fb80917e69d239a7f7db34b4d139a5e3b02658ed26f49928e5ab40f57c9798c9ae7290c536d8378ea8b01399723aaf35f62fae7c58d08f04');

                // Check if the API returned a valid response
                if (response.data.status) {
                    const videoUrl = response.data.videoDownloadLink;
                    const videoTitle = response.data.title;

                    // Define a temporary path to save the video
                    const tempFilePath = path.join(__dirname, `${videoTitle}.mp4`);

                    // Download the video and save it to the temporary file
                    const videoStream = await axios({
                        url: videoUrl,
                        method: 'GET',
                        responseType: 'stream'
                    });

                    // Save the video stream to a temporary file
                    const writer = fs.createWriteStream(tempFilePath);
                    videoStream.data.pipe(writer);

                    // Wait for the file to finish writing
                    await new Promise((resolve, reject) => {
                        writer.on('finish', resolve);
                        writer.on('error', reject);
                    });

                    // Send the video file to the user without the 'text' field
                    const responseMessage = {
                        attachment: {
                            type: 'video',
                            payload: {
                                is_reusable: true
                            }
                        }
                    };

                    // Send the video file as an attachment using api.sendMessage
                    await api.sendMessage(senderId, {
                        recipient: {
                            id: senderId
                        },
                        message: responseMessage,
                        filedata: fs.createReadStream(tempFilePath)
                    });

                    // Clean up: remove the temporary file after sending
                    fs.unlinkSync(tempFilePath);
                } else {
                    // If no video is found, send an error message
                    const errorMessage = {
                        text: Buffer.from('Sorry, no video was found.', 'utf-8').toString()
                    };
                    await api.sendMessage(senderId, { recipient: { id: senderId }, message: errorMessage });
                }
            }
        } catch (error) {
            // Handle any errors that occur during the API request, downloading, or sending the message
            console.error('Error fetching, downloading, or sending the video:', error);

            const errorMessage = {
                text: Buffer.from('An error occurred while fetching the video. Please try again later.', 'utf-8').toString()
            };
            await api.sendMessage(senderId, { recipient: { id: senderId }, message: errorMessage });
        }
    }
};
