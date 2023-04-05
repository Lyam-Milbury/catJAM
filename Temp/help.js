const play = require("./play");

module.exports = {
    
    name: 'help',
    aliases: 'h',
    cooldown: 0,
    description: '**!help** returns a list of useful commands for catJAM',
    async execute(message, args, cmd, client, Discord){
        return message.channel.send(play.description);
    }
}