//Requires Nodejs v18.15.0, @discordjs V14.9.0, @discordjs/opus, opusscript

const { Client, GatewayIntentBits, Events, Collection } = require('discord.js');
const config = require('./Data/config.json');
//const scraper = require('./scraper/scraperMain.js')
//32767 Provides all intents

let client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ], 
});

client.commands = new Collection();
client.events = new Collection();

client.once(Events.ClientReady, c => {
	console.log(`${c.user.tag} is ready to jam`);
});


['command_handler', 'event_handler'].forEach(handler =>{
    require(`./handlers/${handler}`)(client);
});

//Client login using an environment variable for the api key
client.login(process.env.DISCORD_APIKEY);


