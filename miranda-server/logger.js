(function() {
    let stdin = process.openStdin();
    let terminal = require('./terminal.js');
    let  dateTime = require('node-datetime');
    var verbose = true;

    module.exports.initConsoleReader = (verbose, database, io, logger) => {
        this.verbose = verbose;
        // Console commands
        stdin.addListener("data", function(d) {
            var params = d.toString().trim().split('.');
            logger.verbose("Received command: [" + d.toString().trim() + "]");
            switch (params[0]) {
                case "exit":
                    logger.warn("Closing Miranda-AWS NodeJS Server...");
                    io.close();
                    logger.info("Connections closed. Process terminated");
                    process.exit(0);
                break;
                
                case "database":
                    if (!params[1]) {
                        logger.info("Syntax: 'database.<query|insert>'");
                        break;
                    }
                    switch(params[1]) {
                        case "query":
                            if (!params[2]) {
                                logger.info("Syntax: 'database.query.<tableName>.<selection>.<query>'");
                                break;
                            } 
                            database.getTable(params[2], table => table.query(params[3] ? JSON.parse(params[3]) : null, params[4] ? JSON.parse(params[4]) : null, result => logger.raw(JSON.stringify(result, null, 4))));
                        break;
                        case "insert":
                            if (!params[2] || !params[3]) {
                                logger.info("Syntax: 'database.query.<tableName>.<insertion>'");
                                break;
                            } 
                            try {
                                database.getTable(params[2], table => table.insert(JSON.parse(params[3]), result => logger.raw("Changed " + result.insertedCount + " rows")));
                            } catch(e) {
                                logger.error("Error - probably JSON syntax. Ex: {\"firstname\":\"noah\", \"lastname\":\"gearhart\"}");
                            }
                        break;
                        default: logger.error("Syntax error: Database command not found '" + params[1] + "'");
                    }
                break;
                default: logger.error("Command not found.");
            }
        });  
    };

    module.exports.info = (message) => {
        terminal.colorize("[%W%2INFO%n @ " + getCurrentTime() +  "] \t%g" + message + "\r\n").reset();
    };

    module.exports.verbose = (message) => {
        if (verbose)
            terminal.colorize("[%W%5VERBOSE%n @ " + getCurrentTime() +  "] \t%c" + message + "\r\n").reset();
    };

    module.exports.warn = (message) => {
        terminal.colorize("[%W%3WARN%n @ " + getCurrentTime() +  "] \t%y" + message + "\r\n").reset();
    };

    module.exports.error = (message) => {
        terminal.colorize("[%W%1ERROR%n @ " + getCurrentTime() +  "] \t%r" + message + "\r\n").reset();
    };

    module.exports.raw = (message) => {
        terminal.colorize("%4" + message + "\r\n").reset();
    };

    function getCurrentTime() {
        return dateTime.create().format('m/d H:M:S');
    }

}());