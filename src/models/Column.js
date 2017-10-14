import {
    GRID_HEIGHT,
} from '../constants/grid';

function Item(size) {
    this.size = size;
    this.topMargin = 0;
    this.bottonMargin = 0;
}

export default function Column(dataSource) {
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

