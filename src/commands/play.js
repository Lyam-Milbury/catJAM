const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const queue = new Map();    //Queue map

module.exports = {
    name: 'play',   //Main command
    aliases: ['p', 'stop', 'pause', 'resume', 'queue', 'q', 'remove', 'r'],  //Aliases for secondary commands
    cooldown: 0,
    description:['**!play/!p** is used to play the audio of a youtube video in a voice chat, links or keywords can be used to find the video',
    '**!stop** is used to empty the queue and stop the current song',
    '**!pause** can be used to pause and resume audio playback.','**!resume** is used to resume audio playback', '**!queue/!q** returns the current queue',
    '**!remove/!r** removes a specified song from the queue based on its current position in the queue (e.g. X = 1, 2, 3 etc)'],
    async execute(message, args, cmd, client, Discord){
        const voice_channel = message.member.voice.channel;
        if(!voice_channel)
            return message.channel.send('Please join a voice channel to execute this command!');
        
        const permissions = voice_channel.permissionsFor(message.client.user);
        if(!permissions.has('CONNECT'))
            return message.channel.send("You don't have the required permissions to connect");
        if(!permissions.has('SPEAK'))
            return message.channel.send("You don't have the required permissions to jam");

        const server_queue = queue.get(message.guild.id);

        if(cmd === 'play' || cmd === 'p'){
            if(!args.length)
                return message.channel.send('What should I play? Add a link or song name');
            let song = {};

            //If the user posts a link, using ytdl 
            if(ytdl.validateURL(args[0])){
                const song_info = await ytdl.getInfo(args[0]);
                song = {title: song_info.videoDetails.title, url: song_info.videoDetails.video_url}
            }   else{
                //Else, user posted a string, use string to search for wanted video
                const videoFinder = async (query) =>{
                    const videoResult = await ytSearch(query);
                    return (videoResult.videos.length > 1) ? videoResult.videos[0]: null;
                }

                const video = await videoFinder(args.join(''));

                if(video){  //Used for ytSearch
                    song = { title: video.title, url: video.url}
                }   else{
                    return message.channel.send('Error finding video.');
                }
            }

            if(!server_queue){
                const queue_constructor = {
                    voice_channel: voice_channel,
                    text_channel: message.channel,
                    connection: null,
                    songs: []
                }
    
                queue.set(message.guild.id, queue_constructor);
                queue_constructor.songs.push(song);
    
                try{
                    const connection =  await voice_channel.join();
                    queue_constructor.connection = connection;
                    video_player(message.guild, queue_constructor.songs[0], 0);
                }   catch(err){
                    queue.delete(message.guild.id);
                    message.channel.send('There was an error connecting');
                    throw err;
                }
            }   else{
                if(server_queue.connection.dispatcher.paused){
                    message.channel.send('Queue is currently paused!');
                }
                server_queue.songs.push(song);
                return message.channel.send(`**${song.title}** was added to the queue`);
            }
        }
        else if(cmd === 'stop') stop_song(message, server_queue);
        else if(cmd === 'pause') pause_song(message, server_queue);
        else if(cmd === 'resume') resume_song(message, server_queue);
        else if(cmd === 'queue' || cmd === 'q') list_queue(message, server_queue);
        else if(cmd === 'remove' || cmd === 'r') remove_song(message, server_queue, args);
    }
}

const stop_song = (message, server_queue) =>{
    if(!message.member.voice.channel)
        return message.channel.send('You need to be in a channel to stop a queue');
    server_queue.songs = [];
    server_queue.connection.dispatcher.end();
    message.channel.send(`Queue emptied, ending song playback 👋`);
}

const pause_song = (message, server_queue) =>{
    if(!message.member.voice.channel)
        return message.channel.send('You need to be in a channel to pause a song');
    if(!server_queue)
        return message.channel.send("There aren't any songs in the queue");
    if(server_queue.connection.dispatcher.paused){
        resume_song(message, server_queue);
    }
    else{
        server_queue.connection.dispatcher.pause();
        message.channel.send(`Song paused`);
    }
}

const list_queue = (message, server_queue) => {
    if(!server_queue){
        return message.channel.send('Queue is currently empty');
    }
    let songTitles = '';
    let counter = 1;
    for(song of server_queue.songs){
        songTitles += `${counter}: **${song.title}**\n`;
        counter += 1;
    }
    let queueMsg = `Songs currently in queue:\n${songTitles}`;
    message.channel.send(queueMsg);
}

const resume_song = (message, server_queue) =>{
    if(!message.member.voice.channel)
        return message.channel.send('You need to be in a channel to resume a queue');
    if(!server_queue)
        return message.channel.send("There aren't any songs in the queue");
    if(!server_queue.connection.dispatcher.paused){
        return message.channel.send("The song isn't paused");
    } else {
        server_queue.connection.dispatcher.resume();
        message.channel.send(`Song resumed`);
    }
}

const remove_song = (message, server_queue, args) => {
    if(!server_queue){
        return message.channel.send('Queue is currently empty');
    }
    const trackToRemove = parseInt(args[0]);
    if(isNaN(trackToRemove)){
        return message.channel.send('Please enter the queue position of the song (e.g. 1, 2, 3 etc)');
    }
    if(trackToRemove > server_queue.songs.length || trackToRemove < 0){
        return message.channel.send('Number entered is not a valid queue position.');
    }
    if(trackToRemove == 1){
        skip_song(message, server_queue);
        return;
    }
    message.channel.send(`**${server_queue.songs[trackToRemove - 1].title}** removed from the queue`);
    server_queue.songs.splice(trackToRemove - 1, 1);
}

const video_player = async(guild,song, tries)=>{
    const song_queue = queue.get(guild.id);
    if(!song){
        song_queue.voice_channel.leave();
        queue.delete(guild.id);
        return message.channel.send('No more songs in queue 👋');
    }
    const stream = ytdl(song.url, {
        // requestOptions:{
        //     headers: {
        //         cookie: process.env.YOUTUBE_COOKIE,
        //     },
        // },
        filter: 'audioonly', 
        quality: 140,
    });
    song_queue.connection.play(stream, {seek:0, volume: 0.5}).on('start', () => {
        tries = 0;
    }).on('finish', () => {
        song_queue.songs.shift();
        video_player(guild,song_queue.songs[0], 0);
    }).on('error', (err)=>{     //Errors here usually happen on websocket interruptions
        console.log(err);
        if(tries < 5) {
            setTimeout(() => {
                message.channel.send(`**There was an error trying to play the song, retrying... (try ${tries + 1}/5)**`);
                video_player(guild, song_queue.songs[0], tries +1);
            }, 1000);
        }
    });
    await song_queue.text_channel.send(`Now jamming to **${song.title}**`);
}