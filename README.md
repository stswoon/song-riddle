# song-riddle

https://stswoon-song-riddle.onrender.com

## Architecture

Step 1 - deploy - https://stswoon-song-riddle.onrender.com

Step 2 - translate - https://lingva.ml/api/v1/${fromLang}/${toLang}/${encodeURIComponent(text)}
https://github.com/thedaviddelta/lingva-translate

Step 3 - tss - SpeechSynthesisUtterance
или https://voxworker.com/ru/ajax/convert
или https://app.responsivevoice.org/81826
или http://mary.dfki.de/
или https://ttsmp3.com/text-to-speech/Russian/

https://stackoverflow.com/questions/59061345/how-to-save-speechsynthesis-audio-to-a-mp3-file-in-a-uwp-application
https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis

Step 4 - песни БД
https://teksty-pesenok.ru/

Step 5 - сохранение загадок?
TODO: Через шару урла в base 64?

Step 6 - стилизация
https://getuikit.com/


TODO styles,
TODO песни редирект?
TODO html 1.1 - server events
TODO mobile
