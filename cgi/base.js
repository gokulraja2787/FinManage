/**
 * base.js
 * 
 * CGI Server
 */
var readConfig = require('read-config'), configFileName = './finman.json', port, config,
http = require('http'), os = require('os'), fs = require('fs'), finmanDB = require('./db').FinmanDb;

/**
 * Read config file name from command line args.
 */
if(process.argv.length > 2) {
    configFileName = process.argv.splice(2);
}

console.log("Starting FinManage App");
console.log("Config File Name: " + configFileName);

config = readConfig(configFileName);

/**
 * If config file is invalid then exit
 */
if (config === undefined || config.homeFolder === undefined || config.port === undefined) {
    console.log('Invalid or missing config file');
    process.exit(1);
}

port = config.port;

homeDir = os.homedir() + '/' + config.homeFolder;

console.log('Checking if ' + homeDir + ' exists else creating new');

if (!fs.existsSync(homeDir)) {
    fs.mkdirSync(homeDir);
    console.log(homeDir + ' created!!!');
}

/**
 * Creating DB
 */
d = new finmanDB(homeDir);
console.log('DB Check: ' + d.whichLocation());

// Create and run server in configured port
http.createServer(function(req, res){
    var method = req.method;
    console.log('Method: ' + method);
    var resStatus;
    switch (method) {
        case 'GET':
            resStatus = 200;
            doGet(req, res, resStatus);
        break;
        case 'POST':
            resStatus = 200
            doPost(req, res, resStatus);
        break;
        default :
            resStatus = 405;
    }
}).listen(port);


console.log("CGI Running node at port: " + port);

/**
 * Defines operations for HTTP GET method
 * 
 * @param {} req 
 * @param {} res 
 * @param {} resStatus
 */
function doGet(req, res, resStatus) {
    var context = req.url;
    if(context.endsWith("/whoareyou")) {
        resjson = readConfig("./cgi/CONST.json");
        writeResponse(res, resjson, resStatus);
    } else if(context.endsWith("/users/list")) {
        resjson = d.getAllUsers(writeResponse, res, resStatus);
    } else {
        resStatus = '404';
        resjson = {'URL': req.url, 'Status':'Not Found'};
        writeResponse(res, resjson, resStatus);
    }
}

function writeResponse(res, resjson, resStatus) {
    s = JSON.stringify(resjson);
    if (null === s || undefined === s) {
        s = '{"message":"error", "items":"back end error"}';
    }
    res.writeHead(resStatus,{'Content-Type':'application/json', 
    'Content-Length':s.length,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'application/json',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT'});
    res.write(s);
    res.end();
}

/**
 * Defines operations for HTTP POST method
 * 
 * @param {} req 
 * @param {} res 
 * @param {} resStatus
 */
function doPost(req, res, resStatus) {
    var context = req.url;
    if(context.indexOf('/users/add') > -1) {
        var bdy = '', POST = { };
        req.on('data', function(data) {
            bdy += data;
        });
        req.on('end',function(){
            POST = JSON.parse(bdy);
            resjson = d.addUser(writeResponse, res, resStatus, POST.firstName, POST.lastName, POST.email);
        });
    } else {
        resStatus = '404';
        resjson = {'URL': req.url, 'Status':'Not Found'};
        writeResponse(res, resjson, resStatus);
    }
}