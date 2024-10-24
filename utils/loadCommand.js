const fs = require('fs');
const path = require('path');

// Load configuration from config.json
const config = require('../config.json');

module.exports = function loadCommands() {
    const commands = {};
    const cmdPath = path.join(__dirname, '../cmd');
    const commandFiles = fs.readdirSync(cmdPath).filter(file => file.endsWith('.js'));

    console.log('Deploying commands...');

    for (const file of commandFiles) {
        const command = require(path.join(cmdPath, file));
        commands[command.name] = command;
        console.log(`Command "${command.name}" with description "${command.description}" deployed successfully.`);
    }

    console.log('All commands have been successfully deployed!');
    return { commands, config };
};
