var Server = require('./api/Server.js');
var Db = require('./api/Db.js');
var fs = require('fs');

var server = new Server();

//Ugly server for static files
server.on('/', function(params, req, res) {
    res.writeHead(200, 'text/html');
    var fileStream = fs.createReadStream('./public/index.html');
    fileStream.pipe(res);
});

server.on('/js/prod/scripts.js', function(params, req, res) {
    res.writeHead(200, 'application/javascript');
    var fileStream = fs.createReadStream('./public/js/scripts.js');
    fileStream.pipe(res);
});

server.on('/css/styles.css', function(params, req, res) {
    res.writeHead(200, 'text/css');
    var fileStream = fs.createReadStream('./public/css/styles.css');
    fileStream.pipe(res);
});

//table service
server.on('/api/table', function(params, req, res) {
    var page = params.split('page=')[1] || 0;

    var response = {
        header : {},
        page : page,
        data : {}
    };

    new Db(function(db) {
        var _this = this;
        _this.getHeader(db, function(header) {
            response.header = header;
            _this.getTable(db, page, function(table) {
                response.data = table;
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.write(JSON.stringify(response));
                res.end();
            });
        });
    });
});