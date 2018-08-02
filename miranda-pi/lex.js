(function() {
    var AWS = require('aws-sdk');
    var uuid = require('uuid');

    var credentials = new AWS.SharedIniFileCredentials({filename: "aws_keys.txt"});
    AWS.config.credentials = credentials;
    AWS.config.region = 'us-west-2';
    var lex = new AWS.LexRuntime();
    var polly = new AWS.Polly();

    
    var Stream = require('stream')
    var Speaker = require('speaker');
    const speaker = new Speaker({
        channels: 1,
        bitDepth: 16,
        sampleRate: 16000
    });

    module.exports.sendText = (message, onComplete) => {
        var params = {
            botAlias: 'Production', /* required */
            botName: 'Miranda', /* required */
         //   contentType: 'text/plain; charset=utf-8', /* required */
            inputText: message, /* required */
            userId: uuid.v4() /* required */
          };
        lex.postText(params, (err, data) => {
            var params = {
                OutputFormat: "pcm", 
                SampleRate: "16000", 
                Text: data.message, 
                TextType: "text", 
                VoiceId: "Salli"
               };
            polly.synthesizeSpeech(params, function(err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else     {
                    var bufferStream = new Stream.PassThrough();
                    // convert AudioStream into a readable stream
                    bufferStream.end(data.AudioStream);
                    // Pipe into Player
                    bufferStream.pipe(speaker);
                }
                onComplete(err, data);
            });
        });
    };
})();
