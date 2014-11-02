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
        this.fetch();
        this.bindEvents();
    };

    TableModel.prototype.bindEvents = function bindEvents() {
        window.events.subscribe(DEFAULTS.EVENTS.MODEL_FETCH, this.fetch.bind(this));
        window.events.subscribe(DEFAULTS.EVENTS.MODEL_SORT, this.setSortParams.bind(this));
        return this;
    };

    TableModel.prototype.fetch = function fetch() {
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
            window.events.trigger(DEFAULTS.EVENTS.MODEL_CHANGED);
            window.events.trigger(DEFAULTS.EVENTS.LOADING_END);
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
;(function() {
    'use strict';

    var DEFAULTS = {
        TABLE : {
            TAG : 'table',
            CLASS : 'table',
            HEAD_ROW : {
                TAG : 'tr',
                CLASS : 'table__head-row'
            },
            HEAD_CELL : {
                TAG : 'th',
                CLASS : 'table__head-cell'
            },
            ROW : {
                TAG : 'tr',
                CLASS : 'table__row'
            },
            CELL : {
                TAG : 'td',
                CLASS : 'table__cell',
                MINUS_CLASS : 'table__cell-minus',
                NUMBER_CLASS : 'table__cell-num',
                SORT_UP_CLASS : 'table__cell_up',
                SORT_DOWN_CLASS : 'table__cell_down'
            }
        }
    };

    //Private methods
    var _renderTableBody = function _renderTableBody(data) {
        var tableFragment = document.createDocumentFragment(),
            column,
            rows = data.length,
            cols = data[0].array.length,
            j, i, value, element;

        for(i = 0; i < rows; i++) {
            column = document.createElement(DEFAULTS.TABLE.ROW.TAG);
            column.classList.add(DEFAULTS.TABLE.ROW.CLASS);

            for(j = 0; j < cols; j++) {
                value = TableView.prototype.format(data[i].array[j]);
                element = document.createElement(DEFAULTS.TABLE.CELL.TAG);
                element.classList.add(DEFAULTS.TABLE.CELL.CLASS);

                if(typeof value === 'number') {
                    element.classList.add(DEFAULTS.TABLE.CELL.NUMBER_CLASS);
                }
                if(typeof value === 'number' && value < 0) {
                    element.classList.add(DEFAULTS.TABLE.CELL.MINUS_CLASS);
                }

                element.innerHTML = value;
                column.appendChild(element);
            }
            tableFragment.appendChild(column);
        }

        return tableFragment;
    };

    var _renderHeaders = function _renderHeaders(data, sortParams) {
        var tableFragment = document.createDocumentFragment(),
            head,
            cols = data.length,
            i, element;

        for(i = 0; i < cols; i++) {
            element = document.createElement(DEFAULTS.TABLE.HEAD_CELL.TAG);
            element.classList.add(DEFAULTS.TABLE.HEAD_CELL.CLASS);
            element.setAttribute('data-num', i);
            if(parseInt(sortParams.num) === i) {
                element.setAttribute('data-direction', sortParams.direction);
                element.classList.add( (sortParams.direction > 0) ? DEFAULTS.TABLE.CELL.SORT_UP_CLASS : DEFAULTS.TABLE.CELL.SORT_DOWN_CLASS );
            }
            else {
                element.setAttribute('data-direction', '0');
            }

            element.innerHTML = data[i].title;
            tableFragment.appendChild(element);
        }

        head = document.createElement(DEFAULTS.TABLE.HEAD_ROW.TAG);
        head.classList.add(DEFAULTS.TABLE.HEAD_ROW.CLASS);
        head.appendChild(tableFragment);

        return head;
    };

    var TableView = function TableView() {
        this.elem = document.body;
    };

    TableView.prototype.render = function render(model) {
        var head = _renderHeaders(model.header, model.sortParams);
        var body = _renderTableBody(model.data);

        if(this.table) {
            document.body.removeChild(this.table);
        }

        this.table = document.createElement(DEFAULTS.TABLE.TAG);
        this.table.classList.add(DEFAULTS.TABLE.CLASS);
        this.table.appendChild(head);
        this.table.appendChild(body);

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
            value = +value.toFixed(3);
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
            SORT_TABLE_TOGGLER_CLS : 'table__head-cell',
            LOADING_CLASS : 'loading'
        },
        EVENTS : {
            MODEL_CHANGED : 'model:changed',
            MODEL_FETCH : 'model:fetch',
            MODEL_SORT : 'model:sort',
            LOADING_START : 'loading:start',
            LOADING_END : 'loading:end'
        }
    };

    var TableController = function TableController() {
        this.model = new window.TableModel();
        this.view = new window.TableView();
        this.bindEvents();
    };

    TableController.prototype.bindEvents = function bindEvents() {
        window.events.subscribe(DEFAULTS.EVENTS.LOADING_START, function() {
           document.body.classList.add(DEFAULTS.SELECTORS.LOADING_CLASS);
        });

        window.events.subscribe(DEFAULTS.EVENTS.LOADING_END, function() {
            document.body.classList.remove(DEFAULTS.SELECTORS.LOADING_CLASS);
        });

        window.events.subscribe(DEFAULTS.EVENTS.MODEL_CHANGED, function() {
            this.view.render(this.model);
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

            this.sortTable(el.getAttribute('data-num'), el.getAttribute('data-direction'));
        }

        event.preventDefault();
    };

    TableController.prototype.loadMore = function loadMore() {
        window.events.trigger(DEFAULTS.EVENTS.MODEL_FETCH);
    };

    TableController.prototype.sortTable = function sortTable(num, direction) {
        var direction = parseInt(direction);
        var newDirection = (direction === 0) ? 1 : direction*(-1);
        window.events.trigger(DEFAULTS.EVENTS.MODEL_SORT, { direction : newDirection, num : num });
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