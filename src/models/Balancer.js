import {
    GRID_HEIGHT,
    GRID_SCROLL_HEIGHT,
    COLUMN_PAD,
} from '../constants/grid';

const emptyItem = {
    size: 0,
    data: { text: '' },
};

export function Item(data = emptyItem) {
    this.size = data.size;
    this.topMargin = 0;
    this.bottonMargin = 0;
    this.data = {
        text: data.data.text,
    };
}

export function Buff(itemData) {
    Item.call(this, itemData);
    this.noDisplay = true;
}

export function Balancer(itemData, viewArea) {
    Item.call(this, itemData);
    this.viewArea = viewArea ? viewArea : this.size;
}

Balancer.prototype.isScrollable = function(scrollSize) {
    const newViewArea = this.viewArea + scrollSize;
    return newViewArea > 0 && newViewArea < this.size + COLUMN_PAD;
}
/*
Balancer.prototype.isScrollable = function(scrollSize) {
    return this.viewArea > scrollSize;
}
*/
Balancer.prototype.resize = function(size) {
    if (!this.size) return;
    const newViewArea = this.viewArea + size;
    if (newViewArea > this.size + COLUMN_PAD) {
        this.scrollNext = newViewArea - this.size - COLUMN_PAD;
        this.viewArea = this.size;
    } else if(newViewArea <= 0) {
        this.scrollNext = -newViewArea;
        this.viewArea = 0;
    } else {
        this.viewArea += size;
    }
}

Balancer.prototype.getMargin = function() {
    if (this.viewArea <= this.size) {
        return 0;
    }
    return this.viewArea - this.size;
}
