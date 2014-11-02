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

Db.prototype.saveTable = function(db, data, callback) {
    var collection = db.collection(config.DB.DOC);

    collection.remove({title : 'tableRow'}, function(err, result) {
        collection.insert(data, function(err, result) {
            if(typeof callback === 'function') callback(result);
        });
    });
};

Db.prototype.saveHeader = function(db, data, callback) {
    var collection = db.collection(config.DB.DOC);

    collection.remove({title : 'tableHeader'}, function(err, result) {
        collection.insert([{title : 'tableHeader', value : data}], function(err, result) {
            if(typeof callback === 'function') callback(result);
        });
    });
};

Db.prototype.getTable = function(db, page, callback) {
    var collection = db.collection(config.DB.DOC);

    collection.find(
        {
            'title' : 'tableRow'
        },
        {
            limit : config.ITEMS_PER_PAGE,
            skip : page*config.ITEMS_PER_PAGE
        },
        function(err, docs) {
            docs.toArray(function(err, docs) {
                if(typeof callback === 'function') callback(docs);
            });
        }
    );
};

Db.prototype.getHeader = function(db, callback) {
    var collection = db.collection(config.DB.DOC);

    collection.findOne(
        {
            'title' : 'tableHeader'
        },
        function(err, doc) {
            if(typeof callback === 'function') callback(doc);
        }
    );
};

module.exports = Db;