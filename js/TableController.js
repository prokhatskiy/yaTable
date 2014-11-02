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