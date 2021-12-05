const { Message } = require('discord.js');
const puppeteer = require('puppeteer');

var channel = client.channels.cache.get("709928073843441674");

async function startBrowser(){
    let browser;
    try{
        console.log("Opening the browser...");
        browser = await puppeteer.launch({
            headless: true,
            args: ["--disable-setuid-sandbox"],
            'ignoreHTTPSErrors': false
        });
    } catch(err){
        console.log("Couldn't create a browser instance => : ", err);
    }
    return browser;
}

module.exports = {
    startBrowser
};