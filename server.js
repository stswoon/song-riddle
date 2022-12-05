const express = require('express');
const {translate} = require('./puppeteer-run');
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
    const result = await translate(req.query.text, req.query.fromLang, req.query.toLang)
    res.contentType("text").send(result);
});

app.get('/read', async (req, res) => {
    console.info("voice");
    const result = await voice(req.query.text)
    res.send(JSON.stringify({voiceUrl: result.voiceUrl, downloadUrl: result.downloadUrl}));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
