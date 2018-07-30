(function() {
    var AWS = require('aws-sdk');
    var uuid = require('uuid');

    var credentials = new AWS.SharedIniFileCredentials({filename: "aws_keys.txt"});
    AWS.config.credentials = credentials;
    AWS.config.region = 'us-west-2';
    var lex = new AWS.LexRuntime();

    module.exports.sendText = (message, onComplete) => {
        var params = {
            botAlias: 'Production', /* required */
            botName: 'Miranda', /* required */
         //   contentType: 'text/plain; charset=utf-8', /* required */
            inputText: message, /* required */
            userId: uuid.v4() /* required */
          };
        lex.postText(params, onComplete);
    };
})();
