const express = require('express');
const {translate} = require('./translate');
const {voice} = require("./voxworker");


const app = express();
app.get('/health', (req, res) => res.send('OK'));
app.use(express.static(__dirname + '/public', {extensions: ['html']}));

const unexpectedExceptionHandle = (cause) => console.error("Something went wrong: ", cause);
process.on('uncaughtException', unexpectedExceptionHandle);
process.on('unhandledRejection', unexpectedExceptionHandle);
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
        text = await translate(text, langs[i], langs[i + 1]);
    }
    res.contentType("text").send(text);
});

app.get('/translateEventSource', async function (req, res) {
    console.info("translateEventSource");

    res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive'
    });
    res.flushHeaders();
    // Tell the client to retry every 10 seconds if connectivity is lost
    res.write('retry: 10000\n\n');

    let text = decodeURIComponent(req.query.text);
    let langs = req.query.langs;
    langs = langs.split(",");

    for (let i = 0; i < langs.length - 1; i++) {
        // Emit an SSE that contains the current 'count' as a string
        res.write(`data: convert ${langs[i]} -> ${langs[i + 1]}\n\n`);
        text = await translate(text, langs[i], langs[i + 1]);
    }

    text = replaceAll(text, "\n", "___enter___");
    res.write(`data: result: ${text}\n\n`);
    res.end();
});

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

app.get('/read', async (req, res) => {
    console.info("voice");
    const text = decodeURIComponent(req.query.text);
    const result = await voice(text);
    res.send(JSON.stringify({voiceUrl: result.voiceUrl, downloadUrl: result.downloadUrl}));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
