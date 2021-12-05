const pageScraper = require('./pageScraper');
var channel = client.channels.cache.get("709928073843441674");

async function scrapeAll(browserInstance){
    let browser;
    try{
        browser = await browserInstance;
        await pageScraper.scraper(browser);
    } catch(err){
        channel.send("@PS5")
    }
}
module.exports = (browserInstance) => scrapeAll(browserInstance)