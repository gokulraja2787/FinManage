var sqlite = require('sqlite3'), readConfig = require('read-config');
const SQLS = readConfig('cgi/SQL.json');
/**
 * db.js
 * Holds DB Related details
 */
exports.FinmanDb = function(homeLocation) {
    var homeDir, __db;
    homeDir = homeLocation;

    var openDb = function() {
        __db = new sqlite.Database(homeDir + '/DO_NOT_DELETE_OR_MOVE.db', (err) => {
            if(err) {
                console.error(err.message);
                process.exit(2);
            }
        });
    }

    var closeDb = function() {
        if(undefined != __db && null != __db) {
            __db.close(function(error){
                if (error) {
                    console.log(error);
                }
            });
        }
    }

    var initSchema = function() {
        openDb();
        __db.serialize(function(){
            __db.run(SQLS.createSchema.versionTable);
            __db.run(SQLS.createSchema.userTable);
            __db.all(SQLS.createSchema.readVersion, function(err, rows){
                var TOTAL_COUNT
                rows.forEach(function (row) {
                    TOTAL_COUNT = row.TOTAL_COUNT;
                });
                console.log('Row Count is ' + TOTAL_COUNT + ' ' + typeof TOTAL_COUNT);
                if (TOTAL_COUNT == 0) {
                    console.log('Inserting app version...');
                    var stmt = __db.prepare(SQLS.createSchema.insertVersion);
                    var appDet = readConfig("./cgi/CONST.json");
                    stmt = stmt.run(appDet.appName, appDet.appVersion, function(err) {
                        if (err) {
                            console.log('error');
                        }
                    });
                    stmt.finalize();
                    //closeDb(); DB is closed after statement completes
                } else {
                    closeDb();
                }
            });
        });
    }

    var getHomeDir = function() {
        return homeDir;
    }

    initSchema();

    this.whichLocation = function() {
        return getHomeDir();
    }

    this.getAllUsers = function(callback, res, resStatus) {
        openDb();
        __db.serialize(function(){
            var result = {};
            result.message = 'list';
            result.items = [];
            __db.each(SQLS.users.getAllEmails, function (err, row) {
                if (err) {
                    console.error('Error in getting emails ');
                    console.error(err);
                    result.message = 'error';
                    result.items = 'Error occured while picking user details: ' + err;
                } else {
                    result.items.push(row.email);
                }
            }, function(err) {
                if (err) {
                    console.error('Error in getting emails ');
                    console.error(err);
                    result.message = 'error';
                    result.items = 'Error occured while picking user details: ' + err;
                } else {
                    callback(res, result, resStatus);
                }
            });
            closeDb();
        });
    }

    this.addUser = function(callback, res, resStatus, firstName, lastName, email) {
        var result = {};
        result.message = 'success';
        result.userModel = {};
        result.userModel.firstName = firstName;
        result.userModel.lastName = lastName;
        result.userModel.email = email;
        openDb();
        __db.serialize(function(){
            var stmt = __db.prepare(SQLS.users.addUser);
            stmt = stmt.run(firstName, lastName, email, function(err) {
                if (err) {
                    console.log('Error while inserting record ' + err);
                    result.message = 'fail';
                    result.userModel = 'DB ERROR';
                }
                callback(res, result, resStatus);
            });
            stmt.finalize();
        });
    }
}

//var localProto = exports.FinmanDb.prototype;

/*localProto.whichLocation = function() {
    return getHomeDir();
}*/