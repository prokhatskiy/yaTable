var MongoClient = require('mongodb').MongoClient;
var config = require('./config.js')

// Connection URL
var url =  'mongodb://' + config.DB.USER + ':' + config.DB.PASSWORD + '@' + config.DB.SERVER + '/' + config.DB.NAME

function Db(callback) {
    var _this = this;
    this.connect(function(db) {
        if(typeof callback === 'function') callback.call(_this, db);
    });
};

Db.prototype.connect = function(callback) {
    MongoClient.connect(url, function(err, db) {
        if(typeof callback === 'function') callback(db);
    });
};

Db.prototype.save = function(db, data, callback) {
    var collection = db.collection(config.DB.DOC);

    collection.remove({title : 'yaTableData'}, function(err, result) {
        collection.insert([{title : 'yaTableData', value : data}], function(err, result) {
            if(typeof callback === 'function') callback(result);
        });
    });
};

module.exports = Db;