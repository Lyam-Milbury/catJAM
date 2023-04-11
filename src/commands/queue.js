const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection, AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Shows the current queue'),
	async execute(interaction) {
        const connection = getVoiceConnection(interaction.member.voice.channel.guildId);
        let player = connection.state.subscription.player;

	},
};