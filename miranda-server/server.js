let verbose = true;

/* - - - - - -
*   Imports &
*   Globals
* - - - - - - -
*/ 
let express = require('express')
let app = express();
let path = require('path');

let http = require('http');
let https = require('https');
let sslPath = "/etc/letsencrypt/live/miranda.noahgearhart.com/";
let fs = require('fs');

let socketIO = require('socket.io');

let crypto = require('crypto');
let database = require('./database.js');

let logger = require('./logger.js');

let api = require('./api.js');

const port = process.env.PORT || 3000;

let currentId = 0;
let users = {};
let cookies = {};

let currentDateString = new Date().toDateString();

let raspberryPi;

/* 
* - - - - - -
*/
let httpPort = 443;
logger.info("Setting up express http server...");
app.use(express.static(path.join(__dirname, 'dist')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});
app.get('/api/:method/:info', function (req, res) {
    api.parse(req.params, result => res.send(result));
});
app.set('port', httpPort);

var httpServer;
var socketIOServer;
try {
    let httpsOptions = {  
        key: fs.readFileSync(sslPath + 'privkey.pem'),
        cert: fs.readFileSync(sslPath + 'fullchain.pem')
    };
    
    httpServer = https.createServer(httpsOptions, app);
    httpServer.listen(httpPort, () => logger.info(`Web server running on port with ssl: ${httpPort}`));

    // YAY! If we get this far, ssl is working.
    // Now, we automatically redirect to https
    var redirectServer = express();
    redirectServer.get('*', function(req, res) {  
        res.redirect('https://' + req.headers.host + req.url);
    })
    redirectServer.listen(80, () => logger.info("Non-ssl redirection server setup complete"));
} catch(e) {
    httpPort = 80;
    app.set('port', httpPort);
    httpServer = http.createServer(app);
    httpServer.listen(httpPort, () => logger.info(`Web server running on port NO SSL: ${httpPort}`));
}
let io = socketIO.listen(httpServer);

logger.initConsoleReader(verbose, database, io, logger);
database.init(logger);

// https://stackoverflow.com/questions/19106861/authorizing-and-handshaking-with-socket-io
io.use((socket, next) => {
    var handshake = socket.handshake.query;

    logger.verbose("Query: " + JSON.stringify(handshake));

    if (handshake.cookie) {
        for(var key in cookies) {
            if(cookies.hasOwnProperty(key) && handshake.cookie == cookies[key]) {
                // If auth cookie exists
                handshake.id = key;
                return next();
            }
        }
    }

    if (!handshake.username || !handshake.password) {
        logger.verbose("Denied connection due to lack of credentials");
        return next(new Error("Invalid credentials"));
    }

    database.getTable("users", table => {
        table.query({"username": handshake.username}, null, result => {
            if (result.length == 0) {
                logger.verbose("Denied connection due to invalid username");
                return next(new Error("Invalid username"));
            }
            if (result[0]["password"] != crypto.createHash('sha256').update(handshake.password).digest('hex')) {
                logger.verbose("Denied connection due to invalid password");
                return next(new Error("Invalid password"));
            }
            
            logger.verbose("Username/password success");
        
            logger.verbose("Handshake user id: " + handshake.id);
            if (!handshake.id) {
                handshake.id = "" + (++currentId);
                logger.verbose("Gave new id: " + handshake.id);
            }
            
            users[handshake.id] = handshake.username;
            next();
        });
    });
});

// io.set('authorization', function (handshake, callback) {
//     handshake.foo = 'bar';
//     callback(null, true);
// }); 

io.on('connection', (socket) => {
    var userid = socket.handshake.query.id;
    logger.info('User connected with id ' + userid);
    logger.verbose("Username: " + users[userid]);

    if (users[userid] == 'pi') {
        raspberryPi = socket;
        return;
    }

    database.getTable("users", table => {
        table.query({"username": users[userid]}, null, result => {
            logger.verbose("Sending userData packet");
            socket.emit('userData', '{"username":"' + users[userid] + '", "firstname":"' + result[0]["firstname"] + '", "lastname":"' + result[0]["lastname"] + '"}');
        });
    });

    socket.on('new-message', (message) => {
        logger.info("Received message from " + users[socket.handshake.query.id] + ": " + message);
        socket.emit('message', users[socket.handshake.query.id] + ': \"' + message + '\"');

        raspberryPi.emit('message', message);
    });

    socket.on('userTable', (message) => {
        database.getTable("users", table => {
            table.query(null, null, result => {
                result.forEach(element => {
                    logger.verbose('Sending userTable with element ' + JSON.stringify(element));
                    socket.emit('userTable', element);
                });
            });
        });
    });

    socket.on('new-user', (message) => {
        database.getTable("users", table => {
            message.password = crypto.createHash('sha256').update(message.password).digest('hex');
            table.insert(message, result => {
                if (result.insertedCount == 1)
                    socket.emit('new-user', "success");
                else 
                    socket.emit('new-user', "error");
            });
        });
    });

    socket.on('cookie', (message) => {
        switch(message) {
            case "create":
                // Store cookie as server start date + user id. This makes the user unique. However, it refreshes when the server restarts (both time and id)
                cookies[socket.handshake.query.id] = crypto.createHash('sha256').update(currentDateString + socket.handshake.query.id).digest('hex')
                socket.emit("cookie", "" + cookies[socket.handshake.query.id]);
                break;
        }
    });
});
