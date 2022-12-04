const { Selector } = require("testcafe");

fixture('Getting Started')

test('My first test', async t => {
    t.navigateTo("https://translate.yandex.ru/?source_lang=en&target_lang=sq&text=ffffff%0Asdfsdsdfsda%0Adsf");
    console.log(Selector("#translation").innerText);
    // Test code goes here
});