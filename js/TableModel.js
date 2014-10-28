;(function() {
    'use strict';

    var DEFAULTS = {
        SERVICE_URL : '/api/1.json',
        EVENTS : {
            MODEL_CHANGED : 'model:changed',
            MODEL_FETCH : 'model:fetch'
        }
    };

    var TableModel = function TableModel() {
        this.page = 0;

        this.sortParams = {
            direction : false,
            id : 0
        };

        this.fetch();
        this.bindEvents();
    };

    TableModel.prototype.bindEvents = function bindEvents() {
        window.events.subscribe(DEFAULTS.EVENTS.MODEL_FETCH, function() {
            this.fetch();
        }.bind(this));

        return this;
    };

    TableModel.prototype.fetch = function fetch() {
        var xhr = new XMLHttpRequest();
        var _this = this;
        xhr.open('GET', DEFAULTS.SERVICE_URL + '?page=' + this.page, true);

        xhr.onreadystatechange = function() {
            var response = [];

            if (this.readyState != 4) {
                return false;
            }
            else if(this.status === 404) {
                console.log('Error => TableModel.fetch => ' + this.responseText);
                return false;
            }

            response = JSON.parse(this.responseText).response;

            if(_this.page === 0) {
                _this.data = response;
            }
            else {
                response.forEach(function(el) {
                   _this.data.push(el);
                });
            }

            window.events.trigger(DEFAULTS.EVENTS.MODEL_CHANGED);

            _this.page++;
        };

        xhr.send(null);

        return this;
    };

    TableModel.prototype.sort = function sort() {
        if(!this.sortParams.direction) {
            return false;
        }


        window.events.trigger(DEFAULTS.EVENTS.MODEL_CHANGED);
        return this;
    };

    window.TableModel = TableModel;
})();