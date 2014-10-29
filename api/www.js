var Server = require('./Server.js');
var Db = require('./Db.js');

var server = new Server();

server.on('/api/table', function(req, res) {
    var db = new Db(function(db) {
       this.getTable(db, 0, function(table) {
           res.writeHead(200, {'Content-Type': 'application/json'});
           res.write(JSON.stringify(table));
           res.end();
       });
    });
});