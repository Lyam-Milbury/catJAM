const path = require('path');
const fs = require('fs');

module.exports = (client) => {
    let config = JSON.parse(fs.readFileSync(path.resolve('\src','\Data','\config.json')));
    const prefix = config.prefix;
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));

    try{
        command.execute(message, args, cmd, client, Discord);
    }   catch(err){
        message.reply("An error occured while trying to execute command");
        console.log(err);
    }
}