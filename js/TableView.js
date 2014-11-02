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