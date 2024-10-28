const { sendTypingIndicator } = require('./sendmessage');

async function setOnlineIndicator(recipientId) {
    // Turn on the typing indicator
    await sendTypingIndicator(recipientId, 'typing_on');
    
    // Optionally, keep it on periodically or turn it off after a delay
    setTimeout(async () => {
        await sendTypingIndicator(recipientId, 'typing_off');
    }, 5000); // Adjust timing as needed
}

module.exports = {
    setOnlineIndicator,
};
