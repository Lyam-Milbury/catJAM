const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection, AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pauses the song'),
	async execute(interaction) {
        const connection = getVoiceConnection(interaction.member.voice.channel.guildId);
        let player = connection.state.subscription.player;

        if(player.state.status == AudioPlayerStatus.Playing){
            player.pause();
            interaction.reply('Song paused');
        }
        else if(player.state.status == AudioPlayerStatus.Paused){
            player.unpause();
            interaction.reply('Song unpaused');
        }

	},
};