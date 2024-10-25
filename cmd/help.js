const api = require('../jubiar-pagebot-api/sendmessage');

module.exports = {
    name: 'help',
    description: 'Provides quick reply options for users to navigate commands or access features.',

    async execute(senderId) {
        // Define the quick reply options and a button message for more interaction
        let responseMessage = {
            text: 'How can I assist you today? Choose an option below:',
            quick_replies: [
                {
                    content_type: 'text',
                    title: 'View Products',
                    payload: 'VIEW_PRODUCTS_PAYLOAD'
                },
                {
                    content_type: 'text',
                    title: 'Contact Support',
                    payload: 'CONTACT_SUPPORT_PAYLOAD'
                },
                {
                    content_type: 'text',
                    title: 'FAQ',
                    payload: 'FAQ_PAYLOAD'
                }
            ],
            // Button message example
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'button',
                    text: 'Or check out our website for more details:',
                    buttons: [
                        {
                            type: 'web_url',
                            url: 'https://example.com',
                            title: 'Visit Website'
                        },
                        {
                            type: 'postback',
                            title: 'Get Started',
                            payload: 'GET_STARTED_PAYLOAD'
                        }
                    ]
                }
            }
        };

        // Send the prepared message
        await api.sendMessage(senderId, responseMessage);
    }
};
