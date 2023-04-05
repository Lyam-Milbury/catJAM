const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection, AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Kill the cat.'),
	async execute(interaction) {
        const connection = getVoiceConnection(interaction.member.voice.channel.guildId);
		if(connection){
			connection.destroy();
			await interaction.reply('The cat has been killed...')
		}
		else{
			await interaction.reply('You cannot kill what is already dead...');
		}
	},
};