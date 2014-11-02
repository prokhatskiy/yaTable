var http = require('http');
var url = require('url');
var config = require('./config.js');
var path = require('path');
var fs = require('fs');

function Server() {
    this.start();
};

Server.prototype.requests = {};

Server.prototype.start = function () {
    http.createServer(this.onRequest.bind(this)).listen(config.SERVER.PORT);
    console.log('Server has started.');
};

Server.prototype.onRequest = function(req, res) {
    var pathname = url.parse(req.url).pathname;
    var params = url.parse(req.url).query;
    this.emmit(pathname, [params, req, res]);
};

Server.prototype.emmit = function(path, eventOptions, context) {
    var observers = this.requests[path];
    var i;

    if (observers) {
        i = observers.length;
        while (i--) {
            if (typeof observers[i] === 'function') {
                observers[i].apply(context, eventOptions);
            }
        }
    }

    return this;
};

Server.prototype.on = function(eventType, callback) {
    var observers = this.requests;

    if (!(eventType in observers)) {
        observers[eventType] = [];
    }

    observers[eventType].push(callback);

    return this;
};


module.exports = Server;