import {
    GRID_HEIGHT,
    GRID_SCROLL_HEIGHT,
    COLUMN_PAD,
} from '../constants/grid';

function Item(data) {
    this.size = data.size - COLUMN_PAD;
    this.topMargin = 0;
    this.bottonMargin = 0;
    this.data = {
        text: data.text,
    };
}

function Balancer(itemData, viewArea) {
    Item.call(this, itemData);
    this.viewArea = viewArea ? viewArea : this.size;
}
Balancer.prototype.isScrollable = function(scrollSize) {
    const newViewArea = this.viewArea + scrollSize;
    return newViewArea > 0 && newViewArea < this.size;
}
/*
Balancer.prototype.isScrollable = function(scrollSize) {
    return this.viewArea > scrollSize;
}
*/
Balancer.prototype.resize = function(size) {
    this.viewArea += size;
}

function Buff(itemData) {
    Item.call(this, itemData);
    this.noDisplay = true;
}


export default function Column(dataSource) {
    this.totalSize = 0;
    this.itemsCount = 0;
    this.main = [];
    this.buffer = {};
    this.addBuffer('top', dataSource.next().value);
    this.addBalancer('top', dataSource.next().value);

    while (this.totalSize < GRID_HEIGHT) {
        const newItemData = dataSource.next().value;
        // TODO remove COLUMN_PAD from this logic
        if ((newItemData.size + this.totalSize) < GRID_HEIGHT) {
            this.addItem(newItemData);
        } else {
            const viewArea = GRID_HEIGHT - this.totalSize - COLUMN_PAD;
            this.addBalancer('bottom', newItemData, viewArea);
        }
    }

    this.addBuffer('bottom', dataSource.next().value);

    this.moveUp = function() {
    };
    this.resize = function () {
    };
    this.version = 0;
}

Column.prototype.addItem = function(data) {
    const item = new Item(data);
    this.main.push(item);
    this.totalSize += (item.size + COLUMN_PAD);
    ++this.itemsCount;
}

Column.prototype.addBalancer = function(type, itemData, viewArea) {
    const item = new Balancer(itemData, viewArea);
    this[type.concat('Bal')] = item;
    this.totalSize += (item.viewArea + COLUMN_PAD);
    ++this.itemsCount;
}

Column.prototype.addBuffer = function(type, itemData) {
    this.buffer[type] = new Buff(itemData);
}

Column.prototype.moveDown = function() {
    // update top balancer
    if(this.topBal.isScrollable(-GRID_SCROLL_HEIGHT)) {
        this.topBal.resize(-GRID_SCROLL_HEIGHT);
    } else {
    }
    // update bottom balancer
    if (this.bottomBal.isScrollable(GRID_SCROLL_HEIGHT)) {
        this.bottomBal.resize(GRID_SCROLL_HEIGHT);
    } else {
    }
    return this;
}
