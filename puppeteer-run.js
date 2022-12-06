const puppeteer = require('puppeteer');

module.exports.translate = async function translate(text, fromLang, toLang) {
    try {


        let headless = process.env.dev === "true" ? false : true;
        const browser = await puppeteer.launch({headless, args: ['--no-sandbox', '--disable-setuid-sandbox'],});
        const page = await browser.newPage();

        // await page.goto(`https://translate.yandex.ru/?source_lang=${fromLang}&target_lang=${toLang}&text=${text}`);
        await page.goto(`https://translate.google.com/?sl=${fromLang}&tl=${toLang}&text=${text}`);
        const resultSelector = '.lRu31';
        await page.waitForSelector(resultSelector);
        const result = await page.evaluate((resultSelector) => {
            return document.querySelectorAll(resultSelector)[0].innerText;
        }, resultSelector);
        console.log(result);

        await browser.close();

        return result;
    } catch (e) {
        console.error("Fail to translate, error: ", e);
        throw e;
    }
};
