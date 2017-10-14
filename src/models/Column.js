import {
    GRID_HEIGHT,
} from '../constants/grid';

function Item({ data, viewArea }) {
    this.size = data.size;
    this.topMargin = 0;
    this.bottonMargin = 0;
    this.data = {
        text: data.text,
    };
    this.viewArea = viewArea;
}

export default function Column(dataSource) {
    this.totalSize = 0;
    this.itemsCount = 0;
    this.main = [];
    this.addItem(dataSource.next().value, 'topBuf', false);
    this.addItem(dataSource.next().value, 'topBalancer');

    while (this.totalSize < GRID_HEIGHT) {
        const newItemData = dataSource.next().value;
        if ((newItemData.size + this.totalSize) < GRID_HEIGHT) {
            this.addItem(newItemData, 'main');
        } else {
            const viewArea = GRID_HEIGHT - this.totalSize;
            this.addItem(newItemData, 'botBalancer', true, viewArea);
        }
    }

    this.addItem(dataSource.next().value, 'botBuf', false);

    this.moveDown = function() {
    };
    this.moveUp = function() {
    };
    this.resize = function () {
    };
    this.version = 0;
}

Column.prototype.addItem = function(data, place, inView = true, viewArea = 'max') {
    const item = new Item({ data, viewArea });
    if (place !== 'main') {
        this[place] = item;
    } else {
        this.main.push(item);
    }
    if (inView) {
        this.totalSize += item.size;
    }
    ++this.itemsCount;
}
