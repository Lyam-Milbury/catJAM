const path = require('path');
const fs = require('fs');

module.exports = (client, Discord) =>{
    const dir = path.resolve('\src','\commands');
    const command_files = fs.readdirSync(dir).filter(file => file.endsWith('.js'));
    
    for(const file of command_files){
        let playDir = path.resolve('\src','\commands',`${file}`);
        let command = require(playDir);
        if(command.name){
            client.commands.set(command.name, command);
        }   else{
            continue;
        }
    }
}