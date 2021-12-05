const browserObject = require('./browser');
const scraperController = require('./pageController');

let browserInstance = browserObject.startBrowser();

const interval = setInterval(scraperController(browserInstance), 30000);

module.exports ={interval};