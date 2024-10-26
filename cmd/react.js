const axios = require('axios');
const api = require('../jubiar-pagebot-api/sendmessage');

module.exports = {
    name: 'react',
    description: 'Sends a reaction to a specified Facebook post based on user input in the format "react {reaction}|{cookie}|{link}".',

    async execute(senderId, messageText) {
        try {
            // Validate the command starts with "react "
            if (!messageText.startsWith('react ')) {
                return;
            }

            // Extract parameters after "react "
            const input = messageText.slice(6).trim();
            const [reaction, cookie, link] = input.split('|');

            // Validate that all components are provided
            if (!reaction || !cookie || !link) {
                await api.sendMessage(senderId, { text: 'Invalid format. Use: react {reaction}|{cookie}|{link}' });
                return;
            }

            // Send a message to the user indicating processing has started
            await api.sendMessage(senderId, { text: 'Processing reaction, please wait...\n\nCredits: RPLIKER' });
            // Set up headers and data for the request
            const headers = {
                'User-Agent': 'okhttp/3.9.1',
                'Accept-Encoding': 'gzip',
                'content-type': 'application/json; charset=utf-8',
            };

            const data = JSON.stringify({
                reaction: reaction.toUpperCase(),
                cookie: cookie,
                link: link,
                version: '2.1',
            });

            const config = {
                method: 'POST',
                url: 'https://fbpython.click/android_get_react',
                headers: headers,
                data: data,
            };

            // Make the request and prepare the response message
            const response = await axios.request(config);
            const message = response.data.message || 'No message in response.';
            const status = response.data.status || 'No status in response.';
            const statusCookie = response.data.status_cookie || 'No status_cookie in response.';

            // Send the formatted message to the user
            const finalMessage = `${message}\n\nStatus: ${status}\nStatus Cookie: ${statusCookie}\n\nCredits: RPLIKER`;
            await api.sendMessage(senderId, { text: finalMessage });
        } catch (error) {
            console.error(`Error executing ${this.name} command:`, error);
            await api.sendMessage(senderId, { text: 'An error occurred while sending the reaction.' });
        }
    },
};
