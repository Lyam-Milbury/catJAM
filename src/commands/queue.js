const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection, AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Shows the current queue'),
	async execute(interaction) {
        const connection = getVoiceConnection(interaction.member.voice.channel.guildId);
        const player = (getVoiceConnection(interaction.member.voice.channel.guildId) && getVoiceConnection(interaction.member.voice.channel.guildId).state.subscription.player) ? getVoiceConnection(interaction.member.voice.channel.guildId).state.subscription.player 
        : undefined;

        if(player && player.queue.length > 0){
            let res = ``;
            let ind = 1;
            for (let obj of player.queue){
                res += `${ind} - **${obj.song.title}**\n`
                ind += 1;
            }
            await interaction.reply(res);
        }
        else if (player && player.queue.length == 0){
            await interaction.reply(`There are no more songs in the queue, get jamming...`)
        }
        else {
            await interaction.reply(`catJam is not jamming`)
        }
	},
};