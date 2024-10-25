const path = require('path');
const fs = require('fs');
const helpCommand = require('../cmd/help'); // Import specific commands that handle postbacks

// Load all command files with postback handlers
const commandFiles = fs.readdirSync(path.join(__dirname, '../cmd')).filter(file => file.endsWith('.js'));
const commands = {};

// Load commands into an object to manage postback handling dynamically
for (const file of commandFiles) {
    const command = require(path.join(__dirname, '../cmd', file));
    if (command.handlePostback) {
        commands[command.name] = command;
    }
}

module.exports.handlePostback = async (senderId, payload) => {
    try {
        console.log(`Handling postback with payload: ${payload}`);

        // Check if any command can handle this payload
        for (const commandName in commands) {
            const command = commands[commandName];
            if (command.handlePostback) {
                await command.handlePostback(senderId, payload);
                return; // Exit after handling the postback
            }
        }

        // If no specific handler was found, send a default message
        await require('./sendmessage').sendMessage(senderId, {
            text: "I'm sorry, I didn't recognize that option."
        });
    } catch (error) {
        console.error('Error handling postback:', error.message);
        await require('./sendmessage').sendMessage(senderId, {
            text: "An error occurred while processing your request."
        });
    }
};
