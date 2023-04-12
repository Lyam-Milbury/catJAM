const { SlashCommandBuilder } = require('discord.js');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { createAudioPlayer, joinVoiceChannel, getVoiceConnection, createAudioResource, AudioPlayerStatus} = require('@discordjs/voice');
let isListener = false;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays music')
        .addStringOption(option => 
            option.setName('message').setDescription('Enter the url or song name').setRequired(true).setMaxLength(100)),
            
    async execute(interaction){
        try {
            const userInput = interaction.options.getString('message');
            const voiceChannel = interaction.member.voice.channelId;
            
            if(voiceChannel === undefined){
                await interaction.reply('Please join a voice channel to jam.');
            }
            else{
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
                })
                
                // check if there is an existing player in the channel 
                const player = (getVoiceConnection(interaction.member.voice.channel.guildId) && getVoiceConnection(interaction.member.voice.channel.guildId).state.subscription.player) ? getVoiceConnection(interaction.member.voice.channel.guildId).state.subscription.player : createAudioPlayer();

                // check if there is an existing connection
                const connection = getVoiceConnection(interaction.member.voice.channel.guildId) ? getVoiceConnection(interaction.member.voice.channel.guildId) : joinVoiceChannel({
                    channelId: interaction.member.voice.channelId,
                    guildId: interaction.guildId,
                    adapterCreator: interaction.guild.voiceAdapterCreator,
                });

                if (player.queue) {
                    player.queue.push({stream, song});
                    interaction.reply(`**${song.title}** from ${song.url} has been added to the queue`);
                }
                else{
                    player.queue = [{stream, song}];
                }

                if (!connection.state.subscription){
                    connection.subscribe(player);
                    player.play(createAudioResource(player.queue[0].stream))
                    interaction.reply(`Now jamming to **${player.queue[0].song.title}** from ${player.queue[0].song.url}`);
                    player.queue.shift();
                }

                if(!isListener){
                    isListener = true;
                    player.addListener("stateChange", (oldOne, newOne) => {
                        if (newOne.status == AudioPlayerStatus.Idle) {
                            if (player.queue.length > 0){
                                player.play(createAudioResource(player.queue[0].stream));
                                interaction.channel.send(`Now jamming to **${player.queue[0].song.title}**`);
                                player.queue.shift();
                            }
                            else {
                                connection.destroy();
                                isListener = false;
                            }
                        }
                    });
                }
            }
        } catch (err) {
            console.error(err);
            const connection = getVoiceConnection(interaction.member.voice.channel.guildId);
            if(connection){
                connection.destroy();
            }
            await interaction.reply('The cat was murdered by an error...');
        }
    }

    
}