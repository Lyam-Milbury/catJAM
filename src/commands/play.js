const { SlashCommandBuilder } = require('discord.js');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const queue = new Map();    //Queue map
const { createAudioPlayer, joinVoiceChannel, getVoiceConnection, createAudioResource, AudioPlayerStatus  } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays music')
        .addStringOption(option => 
            option.setName('message').setDescription('Enter the url or song name').setRequired(true).setMaxLength(100)),
            
    async execute(interaction){
        const userInput = interaction.options.getString('message');

        const voiceChannel = interaction.member.voice.channelId;
        
        //If the user posts a link, use ytdl 
        if(ytdl.validateURL(userInput)){
            const song_info = await ytdl.getInfo(userInput)
            song = {title: song_info.videoDetails.title, url: song_info.videoDetails.video_url}
        }   else{
                //Else, user posted a string, use string to search for wanted video
                const videoFinder = async (query) =>{
                    const videoResult = await ytSearch(query);
                    return (videoResult.videos.length > 1) ? videoResult.videos[0]: null;
                }

                const video = await videoFinder(userInput);

                if(video){  //Used for ytSearch
                    song = { title: video.title, url: video.url}
                }   else{
                    await interaction.reply('Error finding video.');
                }
            }
        
        const stream = ytdl(song.url, {
            filter: 'audioonly',
            quality: 140,
        });

        const player = createAudioPlayer();
                
        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channelId,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });
        
        const resource = createAudioResource(stream);
        player.play(resource);

        connection.subscribe(player);
        //const subscription = connection.subscribe(audioPlayer);
        await interaction.reply('Song time');
        player.on(AudioPlayerStatus.Idle, () => {
            //player.play(getNextResource());
            player.stop();
            connection.destroy();
        });

    },
};