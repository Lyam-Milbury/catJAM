const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection, AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remove')
		.setDescription('Remove the song by its position in the queue')
        .addIntegerOption(option =>
            option.setName('number').setDescription('Song position in queue').setRequired(true).setMinValue(1)),

	async execute(interaction) {
        const userInput = interaction.options.getInteger('number');
        const connection = getVoiceConnection(interaction.member.voice.channel.guildId);
        const player = (getVoiceConnection(interaction.member.voice.channel.guildId) && getVoiceConnection(interaction.member.voice.channel.guildId).state.subscription.player) ? getVoiceConnection(interaction.member.voice.channel.guildId).state.subscription.player 
        : undefined;

        if(player){
            if (userInput <= player.queue.length){
                const songTitle = player.queue[userInput - 1].song.title;
                player.queue.splice(userInput - 1, 1);
                await interaction.reply(`Removed **${songTitle}** from the queue.`);
            }
            else {
                await interaction.reply(`Invalid queue position, learn to count.`);
            }
        }
        else {
            await interaction.reply(`Nothing is playing, bozo.`)
        }
	},
};