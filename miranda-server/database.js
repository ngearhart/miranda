(function() {

    var mongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/miranda";

    let logger = require('./logger.js');

    module.exports.getMongoClient = () => {
        return mongoClient;
    };

    module.exports.init = (logger) => {
        this.logger = logger;
        mongoClient.connect(url, (err, db) => {
            if (err) throw err;
            logger.verbose("Database 'miranda' initialized!");
            db.close();
        });
    };

    module.exports.tableExists = (tableName, onComplete) => {
        mongoClient.connect(url, (err, db) => {
            if (err) throw err;

            db.db("miranda").collection('system.namespaces').find().toArray((err, items) => {
                if (err) throw err;
                
                var found = false;
                items.forEach(item => {
                    if (item == tableName) found = true; 
                });
                
                db.close();
                onComplete(found);
            });
        });
    };

    module.exports.createTable = (tableName, onComplete) => {
        module.exports.tableExists(tableName, (found) => {
            if (found) {
                logger.verbose("Did not create table '" + tableName + "' because it already existed");
                onComplete();
            } else {
                mongoClient.connect(url, (err, db) => {
                    if (err) throw err;
                    db.db("miranda").createCollection(tableName, function(err, res) {
                        if (err) throw err;
                        logger.verbose("Table '" + tableName+ "' created!");
                        db.close();
                        onComplete();
                    });
                });
            }
        });
    };

    module.exports.getTable = (tableName, onComplete) => {
        //module.exports.createTable(tableName, () => {     // Removed because NoSQL is cool!
            var table = { name: tableName };
    
            table.query = (selectWhat, where, onCompleteQuery) => {
                mongoClient.connect(url, (err, db) => {
                    if (err) throw err;
                    logger.verbose("Querying " + table.name + " with " + JSON.stringify(selectWhat) + " and " + JSON.stringify(where));
                    db.db("miranda").collection(table.name).find(selectWhat, where).toArray((err, result) => {
                        if (err) throw err;
                        onCompleteQuery(result);
                    });
                    db.close();
                });
            };
    
            table.queryOne = (queryText, onCompleteQuery) => {
                mongoClient.connect(url, (err, db) => {
                    if (err) throw err;
                    db.db("miranda").collection(table.name).findOne(queryText, (err, result) => {
                        if (err) throw err;
                        onCompleteQuery(result);
                    });
                    db.close();
                });
            };

            table.insert = (val, onCompleteInsert) => {
                mongoClient.connect(url, (err, db) => {
                    if (err) throw err;
                    if (val[0])
                        db.db("miranda").collection(table.name).insertMany(val, (err, result) => {
                            if (err) throw err;
                            onCompleteInsert(result);
                        });
                    else 
                        db.db("miranda").collection(table.name).insertOne(val, (err, result) => {
                            if (err) throw err;
                            onCompleteInsert(result);
                        });
                    db.close();
                });
            }

            onComplete(table);
        //});
    };
}());


