window.public_translate = translate;
window.public_read = read;

//https://libretranslate.com/?source=ru&target=en&q=%25D0%259A%25D0%25B0%25D0%25BA%2520%25D0%25B4%25D0%25B5%25D0%25BB%25D0%25B0%3F
async function translate() {
    let text = document.getElementById("from").value;
    text = await restTranslate(text, "ru", "en");
    text = await restTranslate(text, "en", "ru");
    document.getElementById("to").value = text;
}

async function restTranslate(text, fromLang, toLang) {
    text = encodeURIComponent(text);
    let url = `translate?fromLang=${fromLang}&toLang=${toLang}&text=${text}`;
    let res = await fetch(url);
    res = res.text();
    return res;
}

//also maybe https://cloud.google.com/text-to-speech/docs/voices
//https://ttsmp3.com/text-to-speech/Russian/
async function read() {
    const text = document.getElementById("to").value;
    const url = await restRead(text);
    new Audio(url).play();
}

async function restRead(text) {
    text = encodeURIComponent(text);
    let res = await fetch(`read?text=${text}`);
    res = await res.json();
    return res.voiceUrl;
}
