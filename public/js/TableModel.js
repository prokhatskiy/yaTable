;(function() {
    'use strict';

    var DEFAULTS = {
        SERVICE_URL : '/api/table',
        EVENTS : {
            MODEL_CHANGED : 'model:changed',
            MODEL_FETCH : 'model:fetch',
            MODEL_SORT : 'model:sort'
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

        this.fetch();
        this.bindEvents();
    };

    TableModel.prototype.bindEvents = function bindEvents() {
        window.events.subscribe(DEFAULTS.EVENTS.MODEL_FETCH, this.fetch.bind(this));
        window.events.subscribe(DEFAULTS.EVENTS.MODEL_SORT, this.setSortParams.bind(this));
        return this;
    };

    TableModel.prototype.fetch = function fetch() {
        var xhr = new XMLHttpRequest();
        var _this = this;
        xhr.open('GET', DEFAULTS.SERVICE_URL + '?page=' + this.page + '&sort=' + this.sortParams.num + '&sortDirection=' + this.sortParams.direction, true);

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

            if(_this.page === 0) {
                _this.data = response;
            }
            else {
                response.data.forEach(function(el) {
                   _this.data.data.push(el);
                });
            }

            _this.data.sortParams = _this.sortParams;
            window.events.trigger(DEFAULTS.EVENTS.MODEL_CHANGED);
            _this.page++;
        };

        xhr.send(null);

        return this;
    };

    TableModel.prototype.sort = function sort() {
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