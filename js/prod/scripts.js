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
;(function() {
    'use strict';

    var DEFAULTS = {
        TABLE : {
            TAG : 'table',
            CLASS : 'table',
            ROW : {
                TAG : 'tr',
                CLASS : 'table__col'
            },
            CELL : {
                TAG : 'td',
                CLASS : 'table__cell',
                MINUS_CLASS : 'table__cell-minus'
            }
        }
    };

    var TableView = function TableView() {
        this.elem = document.body;
        this.decimalsNum = 3;
    };

    TableView.prototype.render = function render(data) {
        var tableFragment = document.createDocumentFragment(),
            column,
            rows = data.length,
            cols = data[0].length,
            j, i, value, element;

        for(i = 0; i < rows; i++) {
            column = document.createElement(DEFAULTS.TABLE.ROW.TAG);
            column.classList.add(DEFAULTS.TABLE.ROW.CLASS);

            for(j = 0; j < cols; j++) {
                value = this.format(data[i][j]);
                element = document.createElement(DEFAULTS.TABLE.CELL.TAG);
                element.classList.add(DEFAULTS.TABLE.CELL.CLASS);

                if(typeof value === 'number' && value < 0) {
                    element.classList.add(DEFAULTS.TABLE.CELL.MINUS_CLASS);
                }

                element.innerHTML = value;
                column.appendChild(element);
            }
            tableFragment.appendChild(column);
        }

        if(this.table) {
            document.body.removeChild(this.table);
        }

        this.table = document.createElement(DEFAULTS.TABLE.TAG);
        this.table.classList.add(DEFAULTS.TABLE.CLASS);
        this.table.appendChild(tableFragment);

        this.elem.appendChild(this.table);
    };

    TableView.prototype.format = function format(value) {
        if(typeof value === 'boolean') {
            if(value) {
                value = 'Да';
            }
            else {
                value = 'Нет';
            }
        }
        else if(typeof value === 'number') {
            value = parseFloat(value.toFixed(this.decimalsNum));
        }

        return value;
    };

    window.TableView = TableView;
})();
;(function() {
    'use strict';

    var DEFAULTS = {
        SELECTORS : {
            LOAD_MORE_CLS : 'load-more-btn',
            SORT_TABLE_TOGGLER_CLS : 'table__cell_header'
        },
        EVENTS : {
            MODEL_CHANGED : 'model:changed',
            MODEL_FETCH : 'model:fetch'
        }
    };

    var TableController = function TableController() {
        this.model = new window.TableModel();
        this.view = new window.TableView();
        this.bindEvents();
    };

    TableController.prototype.bindEvents = function bindEvents() {
        window.events.subscribe(DEFAULTS.EVENTS.MODEL_CHANGED, function() {
            this.view.render(this.model.data);
        }.bind(this));

        document.body.addEventListener('click', this.onClick.bind(this));
    };

    TableController.prototype.onClick = function onClick(event) {
        var el = event.target,
            num, dimension;

        if(el.classList.contains(DEFAULTS.SELECTORS.LOAD_MORE_CLS)) {
            this.loadMore();
        }
        else if(el.classList.contains(DEFAULTS.SELECTORS.SORT_TABLE_TOGGLER_CLS)) {
            this.sortTable(el.getAttribute('data-num'), el.getAttribute('data-dimension'));
        }

        event.preventDefault();
    };

    TableController.prototype.loadMore = function loadMore() {
        window.events.trigger(DEFAULTS.EVENTS.MODEL_FETCH);
    };

    TableController.prototype.sortTable = function sortTable(num, dimention) {
        alert('Sort!');
    };

    window.TableController = TableController;
})();
;(function () {
    var events = {};
    events.observers = {};

    events.trigger = function trigger(eventType, eventOptions, context) {
        setTimeout(function(){
            var observers = events.observers[eventType];
            var i;

            if (observers) {
                i = observers.length;
                while (i--) {
                    if (typeof observers[i] === 'function') {
                        observers[i].call(context, eventOptions);
                    }
                }
            }
        }, 0);

        return this;
    };

    events.subscribe = function subscribe(eventType, callback) {
        var observers = events.observers;

        if (!(eventType in observers)) {
            observers[eventType] = [];
        }

        observers[eventType].push(callback);

        return this;
    };

    window.events = events;
})();

;(function() {
    'use strict';

    var App = function App() {
        this.controller = new window.TableController();
    };

    window.app = new App();
})();