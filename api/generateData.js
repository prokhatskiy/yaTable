var Db = require('./Db.js');
var config = require('./config.js');

var dataGenerator = {
    cols : 10,
    rows : 10000,
    docName : config.DB.DOC,
    array : [],
    header : [],

    generate : function() {
        this.generateHeader();
        this.generateArray();
        this.saveDataToDb({
            type : 'yaTableData',
            header : this.header,
            data : this.array
        });
    },

    generateHeader : function() {
        var value = {};
        this.header = [];
        for(var j = 0; j < this.cols; j++) {
            if(j === this.rows - 1) {
                value = {
                    title : 'Последняя ячейка',
                    isSortable : false
                };
            }
            else {
                value = {
                    title : 'Ячейка №' + j,
                    isSortable : true
                };
            }

            this.header.push(value);
        }
    },

    getRandomInteger : function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    getRandomFloat : function(min, max) {
        return Math.random() * (max - min + 1) + min;;
    },

    getRandomBoolean : function() {
        return (Math.random() < 0.51);
    },

    generateArray : function() {
        var min,
            max,
            value,
            rowArr = [];

        for(var i = 0; i < this.rows; i++) {
            for(var j = 0; j < this.cols; j++) {
                if(j === this.cols - 1) {
                    value = this.getRandomBoolean();
                }
                else {
                    min = this.getRandomInteger(-j, 0);
                    max = this.getRandomInteger(0, j);
                    value = this.getRandomFloat(min, max);
                }

                rowArr.push(value);
            }
            this.array.push(rowArr);
            rowArr = [];
        }

        return this.array;
    },

    saveDataToDb : function(data) {
        new Db(function(db) {
            this.save(db, data, function() {
                db.close();
            });
        });
    }
};

dataGenerator.generate();

module.exports = dataGenerator;