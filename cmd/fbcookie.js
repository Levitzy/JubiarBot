const axios = require('axios');
const cheerio = require('cheerio');
const api = require('../jubiar-pagebot-api/sendmessage');

module.exports = {
    name: 'fbcookie',
    description: 'Log in to Facebook and retrieve session cookies.',

    async execute(senderId, messageText) {
        try {
            // Parse email and password from the messageText
            const [email, password] = messageText.split(' ').slice(1); // assumes /fbcookie email password

            if (!email || !password) {
                await api.sendMessage(senderId, { text: 'Please provide both email and password.' });
                return;
            }

            const loginUrl = 'https://m.facebook.com/login.php';
            const ua = "Mozilla/5.0 (Linux; Android 4.1.2; GT-I8552 Build/JZO54K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.125 Mobile Safari/537.36";

            // Start session
            const session = axios.create({
                headers: { 'User-Agent': ua }
            });

            // Retrieve initial login page
            const loginPage = await session.get(loginUrl);
            const $ = cheerio.load(loginPage.data);

            // Extract required form keys
            const formKeys = {
                lsd: $('input[name="lsd"]').attr('value'),
                jazoest: $('input[name="jazoest"]').attr('value'),
                m_ts: $('input[name="m_ts"]').attr('value'),
                li: $('input[name="li"]').attr('value'),
                try_number: $('input[name="try_number"]').attr('value'),
                unrecognized_tries: $('input[name="unrecognized_tries"]').attr('value'),
                bi_xrwh: $('input[name="bi_xrwh"]').attr('value'),
                email,
                pass: password,
                login: "submit"
            };

            // Send login request
            const loginResponse = await session.post(loginUrl, formKeys, { maxRedirects: 0 }).catch(err => err.response);
            
            // Check for login success by evaluating cookies
            const cookies = loginResponse.headers['set-cookie'];
            const cookieString = cookies.map(cookie => cookie.split(';')[0]).join('; ');

            if (cookieString.includes('c_user')) {
                await api.sendMessage(senderId, { text: `Login successful. Cookie: ${cookieString}` });
            } else if (cookieString.includes('checkpoint')) {
                await api.sendMessage(senderId, { text: 'Account checkpointed by Facebook. Login unsuccessful.' });
            } else {
                await api.sendMessage(senderId, { text: 'Incorrect details or login failed.' });
            }

        } catch (error) {
            console.error(`Error executing fbcookie command:`, error);
            await api.sendMessage(senderId, { text: 'An error occurred while processing your request. Please try again.' });
        }
    }
};
