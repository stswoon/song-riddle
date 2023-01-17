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
    setLang("lang5", randomLang());
}

$("#songTextsDialog").dialog({autoOpen: false, width: 940});

function search() {
    document.getElementById("songTextsDialogIframe").src = "https://teksty-pesenok.ru";
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
constructSelect("lang5", langs);
const langsFinal = {};
langVoiceMappings.forEach(item => langsFinal[item.lingvaMlValue] = item.lingvaMlText);
constructSelect("langFinal", langsFinal, "ru", true);

window.public_translate = translate;

const getLang = (id) => document.getElementById(id).value;

async function translate(button) {
    let langs = [];
    langs.push(getLang("langSource"));
    langs.push(getLang("lang1"));
    getLang("lang2") && langs.push(getLang("lang2"));
    getLang("lang3") && langs.push(getLang("lang3"));
    getLang("lang4") && langs.push(getLang("lang4"));
    getLang("lang5") && langs.push(getLang("lang5"));
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

VOICE_CHUNK = 170; //max ~200, reduce because of /n and just in case

function speak() {
    const tts = (text) => {
        const U = new SpeechSynthesisUtterance();
        //U.pitch = 1;
        U.rate = 0.9;
        U.volume = 1;

        const langVoiceMapping = langVoiceMappings.find(mapping => mapping.lingvaMlValue === getLang("langFinal"));
        U.voiceURI = langVoiceMapping.voiceVoiceURI; //"Google русский";
        U.lang = langVoiceMapping.voiceLang; //"ru-RU";
        U.text = text;
        speechSynthesis.speak(U);
    };

    speechSynthesis.cancel();

    let text = document.getElementById("to").value;
    while (text.length) {
        let subText = "";
        if (text.length >= VOICE_CHUNK) {
            let subTextApproximate = text.substring(0, VOICE_CHUNK);
            let lastSpaceIndex = subTextApproximate.lastIndexOf("\n");
            lastSpaceIndex = lastSpaceIndex || text.length;
            subText = text.substring(0, lastSpaceIndex);
            text = text.substring(lastSpaceIndex, text.length);
        } else {
            subText = text;
            text = "";
        }
        tts(subText);
        console.log("Voice chunk: " + subText);
    }
}

function stop() {
    speechSynthesis.cancel();
}

function hide() {
    if (document.getElementById("from").style.color === "aliceblue") {
        document.getElementById("from").style.color = "black";
    } else {
        document.getElementById("from").style.color = "aliceblue";
    }
}

function share() {
    alert("TODO");
}
