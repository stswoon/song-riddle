const express = require('express');
// const {translate} = require('./puppeteer-run');
const {translateWrap} = require('./g-translate-lib');
const {voice} = require("./voxworker");

const unexpectedExceptionHandle = (cause) => console.error("Something went wrong: ", cause);
process.on('uncaughtException', unexpectedExceptionHandle);
process.on('unhandledRejection', unexpectedExceptionHandle);

const app = express();
app.get('/health', (req, res) => res.send('OK'));
app.use(express.static(__dirname + '/public', {extensions: ['html']}));
app.use((error, req, res, next) => {
    unexpectedExceptionHandle(error);
    res.status(500).send("Server Error");
});

app.get('/translate', async (req, res) => {
    console.info("translate");
    let text = decodeURIComponent(req.query.text);
    let langs = req.query.langs;
    langs = langs.split(",");
    for (let i = 0; i < langs.length - 1; i++) {
        text = await translateWrap(text, langs[i], langs[i + 1]);
        console.log(langs[i] + " -> " + langs[i + 1]);
        console.log(text);
    }
    res.contentType("text").send(text);
});

app.get('/read', async (req, res) => {
    console.info("voice");
    const result = await voice(req.query.text)
    res.send(JSON.stringify({voiceUrl: result.voiceUrl, downloadUrl: result.downloadUrl}));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
