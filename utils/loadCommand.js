const fs = require('fs');
const path = require('path');

module.exports = function loadCommands(port) {
    const commands = {};
    const cmdPath = path.join(__dirname, '../cmd');
    const commandFiles = fs.readdirSync(cmdPath).filter(file => file.endsWith('.js'));

    console.log(`===========================`);
    console.log(`   Facebook Bot is Online   `);
    console.log(`===========================`);
    console.log(`Server is listening on port ${port}`);
    console.log(`---------------------------`);
    
    console.log('Deploying commands...');
    
    for (const file of commandFiles) {
        const command = require(path.join(cmdPath, file));
        commands[command.name] = command;
        console.log(`Command "${command.name}" deployed successfully.`);
    }
    
    console.log('All commands have been successfully deployed!');
    console.log(`---------------------------`);
    console.log(`Commands Deployed:`);
    console.log(`---------------------------`);
    const commandNames = Object.keys(commands);
    console.log(commandNames.join(', '));
    console.log(`---------------------------`);
    console.log(`Total Commands: ${commandNames.length}`);
    console.log(`===========================`);

    return { commands };
};
