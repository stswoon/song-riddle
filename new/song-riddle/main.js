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
    let url = `https://libretranslate.com/?source=${fromLang}&target=${toLang}&q=${text}`;
    let res = await fetch(url);
    res = response.text();



    // const res = await safeFetch(async () => {
    //     let res = await fetch("https://libretranslate.com/translate", {
    //         method: "POST",
    //         body: JSON.stringify({
    //             q: text,
    //             source: fromLang, target: toLang, format: "text",
    //             api_key: ""
    //         }),
    //         headers: { "Content-Type": "application/json" }
    //     });
    //     return res;
    // });
    // return res.translatedText;
}

//also maybe https://cloud.google.com/text-to-speech/docs/voices
//https://ttsmp3.com/text-to-speech/Russian/
async function read() {
    const text = document.getElementById("to").value;
    const url = await restRead(text);
    new Audio(url).play();
}

function restRead2(text) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: "https://ttsmp3.com/makemp3_new.php",
            crossDomain: true,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: $.param({ msg: text, "lang": "Maxim", "source": "ttsmp3" }),
            success: (data) => resolve(data),
            error: (error) => reject(error)
        });
    });
    // $http({
    //     method: "post",
    //     url: URL,
    //     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //     data: $.param({ username: $scope.userName, password: $scope.password })
    // }).success(function (result) {
    //     console.log(result);
    // });
}


async function restRead(text) {
    const res = await safeFetch(async () => {
        const urlencoded = new URLSearchParams();
        urlencoded.append('msg', text);
        urlencoded.append('lang', 'Maxim');
        urlencoded.append('source', 'ttsmp3');
        url = "https://ttsmp3.com/makemp3_new.php" + "?" + urlencoded;
        const res = await fetch(url, {
            method: "GET", mode: 'no-cors',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        res = await res.json();
        return res;
    });
    return res.URL;
}

async function safeFetch(fetchCall, errorMsg) {
    try {
        let res = await fetchCall();
        if (res.status == 403) {
            throw new Error("Bad request status, response: ", res);
        }
        res = await res.json();
        return res;
    } catch (e) {
        console.error(errorMsg + " error: ", e);
        console.error(e);
        alert(errorMsg);
    }
}