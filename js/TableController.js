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