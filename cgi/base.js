/**
 * base.js
 * 
 * CGI Server
 */
var readConfig = require('read-config'), configFileName = './finman.json', port, config,
http = require('http');

/**
 * Read config file name from command line args.
 */
if(process.argv.length > 2) {
    configFileName = process.argv.splice(2);
}

console.log("Starting FinManage App");
console.log("Config File Name: " + configFileName);

config = readConfig(configFileName);
port=config.port;

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
        appDet = readConfig("./cgi/CONST.json");
    } else {
        resStatus = '404';
        appDet = {'URL': req.url, 'Status':'Not Found'};
    }
    s = JSON.stringify(appDet);
    res.writeHead(resStatus,{'Content-Type':'application/json', 'Content-Length':s.length});
    res.write(s);
    res.end();
}