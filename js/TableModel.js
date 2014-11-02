;(function() {
    'use strict';

    var DEFAULTS = {
        SERVICE_URL : '/api/table',
        EVENTS : {
            MODEL_CHANGED : 'model:changed',
            MODEL_FETCH : 'model:fetch',
            MODEL_SORT : 'model:sort',
            LOADING_START : 'loading:start',
            LOADING_END : 'loading:end'
        }
    };

    var TableModel = function TableModel() {
        var sortParams = JSON.parse(window.localStorage.getItem('sortParams'));
        this.page = 0;

        if(sortParams) {
            this.sortParams = {
                direction : sortParams.direction,
                num : sortParams.num
            };
        }
        else {
            this.sortParams = {
                direction : false,
                num : -1
            };
        }

        window.events.trigger(DEFAULTS.EVENTS.LOADING_START);

        this.fetch(function() {
            this.sort();
        }.bind(this));

        this.bindEvents();
    };

    TableModel.prototype.bindEvents = function bindEvents() {
        window.events.subscribe(DEFAULTS.EVENTS.MODEL_FETCH, this.fetch.bind(this));
        window.events.subscribe(DEFAULTS.EVENTS.MODEL_SORT, this.setSortParams.bind(this));
        return this;
    };

    TableModel.prototype.fetch = function fetch(callback) {
        window.events.trigger(DEFAULTS.EVENTS.LOADING_START);
        var xhr = new XMLHttpRequest();
        var _this = this;
        xhr.open('GET', DEFAULTS.SERVICE_URL + '?page=' + this.page);

        xhr.onreadystatechange = function() {
            var response;

            if (this.readyState != 4) {
                return false;
            }
            else if(this.status === 404) {
                console.log('Error => TableModel.fetch => ' + this.responseText);
                return false;
            }

            response = JSON.parse(this.responseText);

            _this.header = response.header.value;

            if(_this.page === 0) {
                _this.data = response.data;
            }
            else {
                response.data.forEach(function(el) {
                   _this.data.push(el);
                });
            }

            _this.data.sortParams = _this.sortParams;
            _this.sort();
            window.events.trigger(DEFAULTS.EVENTS.LOADING_END);
            _this.page++;

            if(typeof callback === 'function') {
                callback();
            }
        };

        xhr.send(null);

        return this;
    };

    TableModel.prototype.sort = function sort() {
        var compare;

        if(this.sortParams.direction > 0) {
            compare = function(rowA, rowB) {
                return rowA.array[this.sortParams.num] - rowB.array[this.sortParams.num];
            }.bind(this);
        }
        else if(this.sortParams.direction < 0) {
            compare = function(rowA, rowB) {
                return -(rowA.array[this.sortParams.num] - rowB.array[this.sortParams.num]);
            }.bind(this);
        }
        else {
            return false;
        }

        this.data.sort(compare);
        window.events.trigger(DEFAULTS.EVENTS.MODEL_CHANGED);
        return this;
    };

    TableModel.prototype.setSortParams = function setSortParams(options) {
        this.sortParams.direction = options.direction;
        this.sortParams.num = options.num;
        window.localStorage.setItem('sortParams', JSON.stringify(this.sortParams));
        this.sort();
    };

    window.TableModel = TableModel;
})();