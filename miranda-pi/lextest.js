var lex = require("./lex.js");
var stdin = process.openStdin();

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
            console.log(data.message);
            console.log("\nEnter question:");
        }
    });
});