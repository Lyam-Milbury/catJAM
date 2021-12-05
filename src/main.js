//Requires Nodejs v14.16.1, @discordjs V12.5.2, @discordjs/opus, opusscript

const Discord = require('discord.js');
const config = require('./Data/config.json');
const scraper = require('./events/client/scraper/scraperMain.js')

let intents = new Discord.Intents(32767);     //32767 Provides all intents
let client = new Discord.Client({ intents: intents, partials:["MESSAGE", "CHANNEL", "REACTION"] });

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['command_handler', 'event_handler'].forEach(handler =>{
    require(`./handlers/${handler}`)(client, Discord);
})

//Client login using an environment variable for the api key
client.login(process.env.DISCORD_APIKEY);

scraper.interval();