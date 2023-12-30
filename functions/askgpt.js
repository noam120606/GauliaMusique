const puppeteer = require('puppeteer');

module.exports = (prompt) => {

    return new Promise(async (resolve, reject) => {

        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();

        await page.goto('https://chat-app-f2d296.zapier.app/');

        const textBoxSelector = 'textarea[aria-label="chatbot-user-prompt"]';
        await page.waitForSelector(textBoxSelector);
        await page.type(textBoxSelector, prompt);

        await page.keyboard.press('Enter');

        await page.waitForSelector('[data-testid="final-bot-response"] p');

        var value = await page.$$eval('[data-testid="final-bot-response"]', async (elements) => {
            return elements.map((element) => element.textContent);
        });

        setTimeout(async () => {
            if (value.length == 0) resolve('Timeout, unexcepted error');
        }, 30000);

        await browser.close();

        value.shift();
        resolve(value.join('\n\n\n\n'));
        
    });

};