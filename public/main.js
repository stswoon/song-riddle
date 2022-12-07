window.public_translate = translate;
window.public_read = read;
window.public_stop = stop;

//TODO: add lang list
async function translate() {
    let text = document.getElementById("from").value;
    text = await restTranslate(text, "ru,en,ru");
    document.getElementById("to").value = text;
}

async function restTranslate(text, langs) {
    text = encodeURIComponent(text);
    let url = `translate?langs=${langs}&text=${text}`;
    let res = await fetch(url);
    res = res.text();
    return res;
}

let audio;

//TODO: test download
//TODO: пропуск строк как будто спец символы даже вручную на сайте
async function read() {
    const text = document.getElementById("to").value;
    const url = await restRead(text);
    audio = new Audio(url);
    audio.play();
}

//also maybe https://cloud.google.com/text-to-speech/docs/voices
//https://ttsmp3.com/text-to-speech/Russian/
async function restRead(text) {
    text = encodeURIComponent(text);
    let res = await fetch(`read?text=${text}`);
    res = await res.json();
    return res.voiceUrl;
}

function stop() {
    audio.pause()
}
