import {
    GRID_HEIGHT,
    GRID_SCROLL_HEIGHT,
    COLUMN_PAD,
} from '../constants/grid';
import { Item, TopBalancer, BottomBalancer } from './Balancer';
import { TopSource, BottomSource } from './Source';

export default function Column({ topDataArray, bottomDataArray }) {
    this._main = [];
    // init sources
    this.source = {
        top: new TopSource(topDataArray),
        bottom: new BottomSource(bottomDataArray),
    };

    // create empty balancers
    this.balancer = {
        top: new TopBalancer({
            topSource: this.source.top,
            bottomSource: new BottomSource(this._main),
        }),
        bottom: new BottomBalancer({
            topSource: new TopSource(this._main),
            bottomSource: this.source.bottom,
        }),
    };
}

Column.prototype.addToSource = function({ type, dataArray }) {
    if (!Object.keys(this.source).includes(type)) {
        throw new Error(`Column: addToSource(): wrong source type: ${type}`);
    }
    this.source[type].concat(dataArray);
    return this;
}

Column.prototype.resize = function(balancer, newSize) {
    let counter = 0;
    while (this.getArea() !== newSize) {
        if (++counter > 100) throw new Error('counter');
        // get resize amount
        const toResize = newSize - this.getArea();
        // choose either expand or shrink
        toResize > 0 
            ? balancer.expand(toResize) 
            : balancer.shrink(-toResize);
    }
    return this;
}

Column.prototype.resizeTop = function(newSize) {
    return this.resize(this.balancer.top, newSize);
}

Column.prototype.resizeBottom = function(newSize) {
    return this.resize(this.balancer.bottom, newSize);
}

Column.prototype.isAtTop = function() {
    return !this.nextItem && this.balancer.top.isFullView();
}

Column.prototype.isAtBottom = function() {
    return !this.nextItem && this.balancer.bottom.isFullView();
}

Column.prototype.getArea = function() {
    const balancers = Object.keys(this.balancer).map(key => this.balancer[key]).reduce(countArea, 0);
    const main = this._main.reduce(countArea, 0);
    const padding = main && (this._main.length + 1) * COLUMN_PAD;
    return balancers + main + padding;
};

Column.prototype.getItemsCount = function() {
    const balancerItems = Object.keys(this.balancer)
        .map(key => this.balancer[key].size)
        .reduce((acc, size) => { return size > 0 ? ++acc : acc }, 0);

    return balancerItems + this._main.length;
};

function countArea(acc, item) {
    const viewArea = item.getSize();
    if (!viewArea) {
        return acc;
    }
    return acc + viewArea;
}
