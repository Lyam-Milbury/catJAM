const play = require("./play");

module.exports = {
    name: 'skip',
    aliases: 's',
    cooldown: 0,
    description: '**!skip/!s** is used to skip to the next song in the queue',
    async execute(message, args, cmd, client, Discord){
        if(!message.member.voice.channel)
            return message.channel.send('You need to be in a channel to skip a song');
        if(!play.server_queue)
            return message.channel.send("There aren't any songs in the queue");
        play.server_queue.connection.dispatcher.end();
        message.channel.send(`Song Skipped`);
    }
}
