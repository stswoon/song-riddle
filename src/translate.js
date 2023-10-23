const fetch = require('node-fetch');

module.exports.translate = async function translate(text, fromLang, toLang) {
    try {
        console.log(`Translate from=${fromLang} to=${toLang}, text: \n${text.substring(0,50)}...`);
        //const domain = "https://lingva.ml";
        const domain = "http://lingva-ml-standby.stswoon.ru:10002";
        let url = `${domain}/api/v1/${fromLang}/${toLang}/${encodeURIComponent(text)}`;
        let res = await fetch(url);
        res = await res.json();
        res = res.translation;
        console.log(`Translation result: \n${res.substring(0,50)}...`);
        return res;
    } catch (e) {
        console.error("Fail to translate, error: ", e);
        throw e;
    }
};
