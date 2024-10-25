const fs = require('fs');
const path = require('path');

module.exports = function loadCommands() {
    const commands = {};
    const cmdPath = path.join(__dirname, '../cmd');
    
    try {
        // Read all files from the cmd folder
        const commandFiles = fs.readdirSync(cmdPath).filter(file => file.endsWith('.js'));

        console.log('Deploying commands...');
        
        // Load each command file
        for (const file of commandFiles) {
            const command = require(path.join(cmdPath, file));
            if (command.name) {
                commands[command.name] = command;
                console.log(`Command "${command.name}" deployed successfully.`);
            } else {
                console.warn(`Command in file ${file} is missing a name property.`);
            }
        }
        
        console.log('All commands have been successfully deployed!');
        return commands;
    } catch (error) {
        console.error('Error loading commands:', error);
        return {};
    }
};
