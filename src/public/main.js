window.public_read = read;
window.public_stop = stop;

function randomLangs() {
    const setLang = (id, lang) => document.getElementById(id).value = lang;
    const randomLang = () => {
        const items = Object.keys(langs);
        return items[Math.floor(Math.random() * items.length)];
    };
    setLang("lang1", randomLang());
    setLang("lang2", randomLang());
    setLang("lang3", randomLang());
    setLang("lang4", randomLang());
}

$("#songTextsDialog").dialog({autoOpen: false, width: 940});

function search() {
    $("#songTextsDialog").dialog("open");
}

//some langs from https://lingva.ml/api/v1/languages
const langs = {
    ru: "Русский",
    en: "Английский",
    tr: "Турецкий",
    uk: "Украинский",
    es: "Испанский",
    pl: "Польский",
    ko: "Корейский",
    it: "Итальянский",
    el: "Греческий",
    de: "Немецкий",
    fr: "Французский",
    zh: "Китайский",
    kk: "Казахстан",
    tl: "Филиппинский",
    be: "Белорусский",
    ja: "Японский",
    sa: "Санскрит",
    la: "Латынь",
    km: "Кхмерский",
    hi: "Хинди",
    fa: "Персидский",
    so: "Сомали",
    zu: "Зулу",
    ur: "Урду"
}

const langVoiceMappings = [
    {
        lingvaMlValue: "ru",
        lingvaMlText: "Русский",
        voiceLang: "ru-RU",
        voiceVoiceURI: "Google русский"
    },
    {
        lingvaMlValue: "en",
        lingvaMlText: "Английский",
        voiceLang: "en-US",
        voiceVoiceURI: "Google US English"
    },
    {
        lingvaMlValue: "fr",
        lingvaMlText: "Французский",
        voiceLang: "fr-FR",
        voiceVoiceURI: "Google français"
    },
    {
        lingvaMlValue: "de",
        lingvaMlText: "Немецкий",
        voiceLang: "de-DE",
        voiceVoiceURI: "Google Deutsch"
    }
];

function constructSelect(id, langs, selectLang, hideEmpty) {
    function createOption(value, text, selected) {
        const opt = document.createElement('option');
        opt.value = value;
        opt.innerHTML = text;
        opt.selected = selected;
        return opt;
    }

    const select = document.getElementById(id);
    if (!hideEmpty) {
        select.appendChild(createOption("", ""));
    }
    Object.keys(langs).forEach(lang => {
        select.appendChild(createOption(lang, langs[lang], lang === selectLang));
    });
}

constructSelect("langSource", langs, "ru", true);
constructSelect("lang1", langs, "en", true);
constructSelect("lang2", langs);
constructSelect("lang3", langs);
constructSelect("lang4", langs);
const langsFinal = {};
langVoiceMappings.forEach(item => langsFinal[item.lingvaMlValue] = item.lingvaMlText);
constructSelect("langFinal", langsFinal, "ru", true);

window.public_translate = translate;

async function translate(button) {
    const getLang = (id) => document.getElementById(id).value;

    let langs = [];
    langs.push(getLang("langSource"));
    langs.push(getLang("lang1"));
    getLang("lang2") && langs.push(getLang("lang2"));
    getLang("lang3") && langs.push(getLang("lang3"));
    getLang("lang4") && langs.push(getLang("lang4"));
    langs.push(getLang("langFinal"));
    langs = langs.join(",");

    let text = document.getElementById("from").value;

    button.disabled = true;
    document.getElementById("progressbarTranslate").style.display = 'block';
    try {
        text = await restTranslate(text, langs);
    } catch (e) {
        console.error("Failed to translate", e);
        alert("Ошибка конвертации");
    }
    document.getElementById("progressbarTranslate").style.display = 'none';
    button.disabled = false;

    document.getElementById("to").value = text;
}

async function restTranslate(text, langs) {
    text = encodeURIComponent(text);
    let url = `translate?langs=${langs}&text=${text}`;
    let res = await fetch(url);
    res = res.text();
    return res;
}


function speak2() {
    // const U = new SpeechSynthesisUtterance("Привет как дела");
    // speechSynthesis.speak(U);

    const U = new SpeechSynthesisUtterance();
    U.voiceURI = "Google русский";
    U.lang = "ru-RU";
    U.pitch = 1;
    U.rate = 0.9;
    U.volume = 1;
    // U.rvIndex = 0;
    // U.rvTotal = 1;
    // const voices = speechSynthesis.getVoices();
    // console.log(voices);
    // U.voice = voices[18];
    U.text = "Привет как дела";
    speechSynthesis.speak(U);
}

let audio;


//TODO: пропуск строк как будто спец символы даже вручную на сайте
async function read() {
    responsiveVoice.speak("Привет как дела", "Russian Female");


    const text = document.getElementById("to").value;
    const res = await restRead(text);

    const downloadUrl = res.downloadUrl;
    document.getElementById("download").href = downloadUrl;

    document.getElementById("stop").disabled = false;
    const url = res.voiceUrl;
    audio = new Audio(url);
    audio.play();
}

//also maybe https://cloud.google.com/text-to-speech/docs/voices
//https://ttsmp3.com/text-to-speech/Russian/
async function restRead(text) {
    const pause = " -. "; //pause to avoid deletion dublicated text (which is ofter for songs in the end of paragraph) during tts
    text = text.replaceAll("\n", pause).replaceAll("\r", pause);
    text = encodeURIComponent(text);
    let res = await fetch(`read?text=${text}`);
    res = await res.json();
    return res;
}

function stop() {
    audio.pause()
}
