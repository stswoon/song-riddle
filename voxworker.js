const fetch = require('node-fetch');
// import fetch from 'node-fetch';

module.exports.voice = async function voice(text) {
    try {
        const url = "https://voxworker.com/ru/ajax/convert"
        let formdata = new URLSearchParams(); //URLSearchParams same as FormData or form-data npm lib, https://stackoverflow.com/questions/63576988/how-to-use-formdata-in-node-js-without-browser
        formdata.append("voice", "rh-oleg");
        formdata.append("text", text);
        formdata.append("speed", "1.0");
        formdata.append("pitch", "1.0");
        let requestOptions = {method: 'POST', body: formdata};
        let res = await fetch(url, requestOptions);
        res = await res.json();
        console.log(res);

        if (res.status === "queue") {
            await sleep(1000)
            res = await fetch(url, requestOptions);
            res = await res.json();
            console.log(res);
        }

        return res;
    } catch (e) {
        console.error("Fail to voice, error: ", e);
        throw e;
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

// async function restRead(text) {
//     const res = await safeFetch(async () => {
//         const urlencoded = new URLSearchParams();
//         urlencoded.append('msg', text);
//         urlencoded.append('lang', 'Maxim');
//         urlencoded.append('source', 'ttsmp3');
//         url = "https://ttsmp3.com/makemp3_new.php" + "?" + urlencoded;
//         const res = await fetch(url, {
//             method: "GET", mode: 'no-cors',
//             headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         });
//         res = await res.json();
//         return res;
//     });
//     return res.URL;
// }
