const {translate} = require('@vitalets/google-translate-api');
// const translate = require('google-translate-api-x'); //"google-translate-api-x": "^10.4.2",

module.exports.translateWrap = async function translateWrap(text, fromLang, toLang) {
    const res = await translate(text, {from: fromLang, to: toLang, client: 'gtx'});
    console.log(res.text)
    return res.text
}
