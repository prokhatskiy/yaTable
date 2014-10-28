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