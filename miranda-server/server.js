let verbose = true;

/* - - - - - -
*   Imports &
*   Globals
* - - - - - - -
*/ 
let express = require('express')
let app = express();

let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server);

let crypto = require('crypto');

let database = require('./database.js');

let logger = require('./logger.js');
logger.initConsoleReader(verbose, database, server, io, logger);
database.init(logger);

const port = process.env.PORT || 3000;

let currentId = 0;
let users = {};

/* 
* - - - - - -
*/

// https://stackoverflow.com/questions/19106861/authorizing-and-handshaking-with-socket-io
io.use((socket, next) => {
    var handshake = socket.handshake.query;

    logger.verbose("Query: " + JSON.stringify(handshake));

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

    
    database.getTable("users", table => {
        table.query({"username": users[userid]}, null, result => {
            logger.verbose("Sending userData packet");
            socket.emit('userData', '{"username":"' + users[userid] + '", "firstname":"' + result[0]["firstname"] + '", "lastname":"' + result[0]["lastname"] + '"}');
        });
    });

    socket.on('new-message', (message) => {
        logger.info("Received message from " + users[socket.handshake.query.id] + ": " + message);
        socket.emit('message', users[socket.handshake.query.id] + ': \"' + message + '\"');
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
            table.insert(message, result => {
                if (result.insertedCount == 1)
                    socket.emit('new-user', "success");
                else 
                    socket.emit('new-user', "error");
            });
        });
    });
});

server.listen(port, () => {
    logger.info(`Started on port: ${port}`);
});

