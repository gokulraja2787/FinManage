var sqlite = require('sqlite3'), readConfig = require('read-config');
const SQLS = readConfig('cgi/SQL.json');
/**
 * db.js
 * Holds DB Related details
 */
exports.FinmanDb = function(homeLocation) {
    var homeDir, __db;
    homeDir = homeLocation;

    /**
     * Opens DB
     */
    var openDb = function() {
        __db = new sqlite.Database(homeDir + '/DO_NOT_DELETE_OR_MOVE.db', (err) => {
            if(err) {
                console.error(err.message);
                process.exit(2);
            }
        });
    }

    /**
     * Close DB
     */
    var closeDb = function() {
        if(undefined != __db && null != __db) {
            __db.close(function(error){
                if (error) {
                    console.log(error);
                }
            });
        }
    }

    /**
     * Initializes schemas
     */
    var initSchema = function() {
        openDb();
        __db.serialize(function(){
            __db.run(SQLS.createSchema.versionTable);
            __db.run(SQLS.createSchema.userTable);
            __db.run(SQLS.createSchema.bankAccTable);
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

    /* 
     * Check and create necessary schemas if don't exist
     */
    initSchema();

    this.whichLocation = function() {
        return getHomeDir();
    }

    /**
     * Get all users
     */
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

    /**
     * Insert new users
     */
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

    /**
     * Modify given user
     */
    this.modifyUser = function(callback, res, resStatus, uid, firstName, lastName, email) {
        var result = {};
        result.message = 'success';
        result.userModel = {};
        result.userModel.firstName = firstName;
        result.userModel.lastName = lastName;
        result.userModel.email = email;
        openDb();
        __db.serialize(function(){
            var stmt = __db.prepare(SQLS.users.updateUserByUid);
            stmt = stmt.run(firstName, lastName, email, uid, function(err) {
                if (err) {
                    console.log('Error while updating record ' + err);
                    result.message = 'fail';
                    result.userModel = 'DB ERROR';
                }
                callback(res, result, resStatus);
            });
            stmt.finalize();
        });
    }

    /**
     * Delete given user
     */
    this.deleteUser = function(callback, res, resStatus, email) {
        var result = {};
        result.message = 'success';
        openDb();
        __db.serialize(function() {
            var stmt = __db.prepare(SQLS.users.deleteUserByEmail);
            stmt.run(email, function(err){
                if (null !== err) {
                    console.log('DB Error while reading record: ' + err);
                    result.message = 'fail';
                }
                callback(res, result, resStatus);
            });
            stmt.finalize();
        });
    }

    /**
     * Get user details by email
     */
    this.getUserByEmail = function(callback, res, resStatus, email) {
        var result = {};
        result.message = 'success';
        result.userModel = {};
        openDb();
        __db.serialize(function() {
            var stmt = __db.prepare(SQLS.users.getUserByEmail);
            stmt.get(email, function(err, row){
                if (null !== err) {
                    console.log('DB Error while reading record: ' + err);
                    result.message = 'fail';
                    result.userModel = 'DB Error while reading record';
                } else {
                    if (null !== row && undefined !== row) {
                        result.userModel.uid = row.uid;
                        result.userModel.firstName = row.firstname;
                        result.userModel.lastName = row.lastname;
                        result.userModel.email = row.email;
                    } else {
                        result.message = 'fail';
                        result.userModel = 'No such user';
                    }
                }
                callback(res, result, resStatus);
            });
            stmt.finalize();
        });
    }

    /**
     * Get user details by UID
     */
    this.getUserByUID = function(callback, res, resStatus, uid) {
        var result = {};
        result.message = 'success';
        result.userModel = {};
        openDb();
        __db.serialize(function() {
            var stmt = __db.prepare(SQLS.users.getUserByUID);
            stmt.get(uid, function(err, row){
                if (null !== err) {
                    console.log('DB Error while reading record: ' + err);
                    result.message = 'fail';
                    result.userModel = 'DB Error while reading record';
                } else {
                    if (null !== row && undefined !== row) {
                        result.userModel.uid = row.uid;
                        result.userModel.firstName = row.firstname;
                        result.userModel.lastName = row.lastname;
                        result.userModel.email = row.email;
                    } else {
                        result.message = 'fail';
                        result.userModel = 'No such user';
                    }
                }
                callback(res, result, resStatus);
            });
            stmt.finalize();
        });
    }

    /**
     * Get all bank accounts
     */
    this.getAllBankAccs = function(callback, res, resStatus) {
        openDb();
        __db.serialize(function(){
            var result = {};
            result.message = 'list';
            result.items = [];
            __db.each(SQLS.banks.selectAllBankAcc, function (err, row) {
                if (err) {
                    console.error('Error in getting bank accounts ');
                    console.error(err);
                    result.message = 'error';
                    result.items = 'Error occured while picking bacnk account details: ' + err;
                } else {
                    result.items.push(row);
                }
            }, function(err) {
                if (err) {
                    console.error('Error in getting bank accounts ');
                    console.error(err);
                    result.message = 'error';
                    result.items = 'Error occured while picking bacnk account details: ' + err;
                } else {
                    callback(res, result, resStatus);
                }
            });
            closeDb();
        });
    }

    /**
     * Insert new bank account
     */
    this.addBankAccount = function(callback, res, resStatus, accNumber, bankName, displayName, createdByUID) {
        var result = {};
        result.message = 'success';
        result.bankModel = {};
        result.bankModel.accNumber = accNumber;
        result.bankModel.bankName = bankName;
        result.bankModel.displayName = displayName;
        openDb();
        __db.serialize(function(){
            var stmt = __db.prepare(SQLS.banks.addBankAcc);
            stmt = stmt.run(firstName, lastName, email, function(err) {
                if (err) {
                    console.log('Error while inserting record ' + err);
                    result.message = 'fail';
                    result.userModel = 'DB ERROR';
                    callback(res, result, resStatus);
                } else {
                    this.getUserByUID(callback, res, resStatus, createdByUID);
                }
            });
            stmt.finalize();
        });
    }
}

//var localProto = exports.FinmanDb.prototype;

/*localProto.whichLocation = function() {
    return getHomeDir();
}*/