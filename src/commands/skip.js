const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection, AudioPlayerStatus, createAudioResource } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skips the current song'),
	async execute(interaction) {
        const connection = getVoiceConnection(interaction.member.voice.channel.guildId);
        const player = (getVoiceConnection(interaction.member.voice.channel.guildId) && getVoiceConnection(interaction.member.voice.channel.guildId).state.subscription.player) ? getVoiceConnection(interaction.member.voice.channel.guildId).state.subscription.player 
        : undefined;

        if(player){
            if (player.queue.length > 0){
                player.play(createAudioResource(player.queue[0].stream));
                interaction.reply(`Skipped song, now jamming to **${player.queue[0].song.title}**`);
                player.queue.shift();
            }
            else {
                interaction.reply(`Skipped song, nothing left. Going to sleep now.`);
                connection.destroy();
            }
        }
        else {
            await interaction.reply(`Nothing is playing, bozo`)
        }
	},
};