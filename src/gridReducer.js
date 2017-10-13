import { GRID_DATA_READY } from './actions';

const COLUMN_WIDTH = 150;
const COLUMN_PAD = 20;
const GRID_WIDTH = 500;
const GRID_HEIGHT = 800;

function getColumnSource(queue) {
    return function* () {
        let index = 0;
        let goRight = true;

        while (queue[index]) {
            index += goRight ? 1 : -1 ;
            const reverse = yield queue[index];
            if (reverse < 0) throw new Error('reverse lower then Zero');
            if (reverse) {
                index = reverse;
                goRight = !goRight;
            }
        }
    }
}

function Item(size) {
    this.size = size;
    this.topMargin = 0;
    this.bottonMargin = 0;
}

function Column(dataSource) {
    this.totalSize = 0;
    this.itemsCount = 0;
    this.main = [];
    this.addItem(dataSource.next().value.size, 'topBuf');
    this.addItem(dataSource.next().value.size, 'topBalancer');
    while (this.totalSize < GRID_HEIGHT) {
        const newItem = dataSource.next().value;
        if ((newItem.size + this.totalSize) < GRID_HEIGHT) {
            this.addItem(newItem.size, 'main');
        } else {
            break;
        }
    }
    this.addItem(dataSource.next().value.size, 'botBalancer');
    this.addItem(dataSource.next().value.size, 'botBuf');

    this.moveDown = function() {
    };
    this.moveUp = function() {
    };
    this.resize = function () {
    };
    this.version = 0;
}

Column.prototype.addItem = function(size, place) {
    if (place !== 'main') {
        this[place] = new Item(size);
    } else {
        this.main.push(new Item(size));
    }
    this.totalSize += size;
    ++this.itemsCount;
}

function getColumnsNumber(gridWidth, columnWidth) {
    return Math.round(gridWidth / columnWidth);
}

function calculateColumns() {
    const columnsNumber = getColumnsNumber(GRID_WIDTH, COLUMN_WIDTH);
    const columns = [];
    for (let i = 0; i < columnsNumber; ++i) {
        columns.push({});
    }
    return columns;
}

const initialState = {
    width: GRID_WIDTH,
    height: GRID_HEIGHT,
    columns: calculateColumns(),
};



export default function gridReducer(state = initialState, action) {
    switch (action.type) {
        case GRID_DATA_READY: {
            return Object.assign({}, state, { columns: state.columns.map(column => new Column(getColumnSource(action.payload)())) });
        }
        default: return state;
    }
}
