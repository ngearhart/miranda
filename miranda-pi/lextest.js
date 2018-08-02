var lex = require("./lex.js");
var stdin = process.openStdin();

var Speaker = require('speaker');
const speaker = new Speaker({
    channels: 2,          // 2 channels
    bitDepth: 16,         // 16-bit samples
    sampleRate: 44100     // 44,100 Hz sample rate
});

console.log("\nEnter question:");
stdin.addListener("data", function(d) {
    lex.sendText(d.toString().trim(), (err, data) => {
        if (err)  { 
            console.log(err);
            process.exit(); 
            return;
        }
        if (data.message) {
            console.log("\nResponse:");
            console.log(data);
            //data.audioStream.pipe(speaker);
            console.log("\nEnter question:");
        }
    });
});