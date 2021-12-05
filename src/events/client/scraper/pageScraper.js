const chai = require('chai');
idArr = ['#tr53275', '#tr55676','#tr53025','#tr58386', '#tr58155', '#tr53026', '#tr53086', '#tr58387', '#tr57908', '#tr53045'];
const scraperObject = {
    url: 'https://www.nowinstock.net/ca/videogaming/consoles/sonyps5/', 
    async scraper(browser){
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url);
        var expect = chai.expect;

        const cookieSel = await page.$('.cc_b_ok'); //.cc_b_ok
        await cookieSel.evaluate(cookieSel => cookieSel.click());

        for(i = 0; i < idArr.length; i++){
            const availability = await page.$(idArr[i] + ' > .stockStatus');
            expect(await availability.evaluate((node) => node.innerText)).to.have.lengthOf(12);
        }

        //console.log('Made it here?');
    }
}

module.exports = scraperObject;