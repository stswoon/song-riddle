window.public_translate = translate;
window.public_read = read;
window.public_stop = stop;

async function translate() {
    let langs = ["ru"];
    langs.push(document.getElementById("lang1").value);
    if (document.getElementById("lang2").value) {
        langs.push(document.getElementById("lang2").value);
    }
    if (document.getElementById("lang3").value) {
        langs.push(document.getElementById("lang3").value);
    }
    //langs.push("ru");
    if (document.getElementById("lang4").value) {
        langs.push(document.getElementById("lang4").value);
    }

    langs = langs.join(",");
    let text = document.getElementById("from").value;
    text = await restTranslate(text, langs);
    document.getElementById("to").value = text;

    document.getElementById("stop").disabled = true;
}

async function restTranslate(text, langs) {
    text = encodeURIComponent(text);
    let url = `translate?langs=${langs}&text=${text}`;
    let res = await fetch(url);
    res = res.text();
    return res;
}

let audio;


//TODO: пропуск строк как будто спец символы даже вручную на сайте
async function read() {
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
