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
    this.version = 0;
}

Column.prototype.isScrollableDown = function() {
    return this.source.bottom.isDataAvailable();
}

Column.prototype.isScrollableUp = function() {
    return this.source.top.isDataAvailable();
}

Column.prototype.addToSource = function({ type, dataArray }) {
    if (!Object.keys(this.source).includes(type)) {
        throw new Error(`Column: addToSource(): wrong source type: ${type}`);
    }
    this.source[type].concat(dataArray);
    return this;
}

Column.prototype.resize = function(balancer, newSize) {
    console.log('column: resize: new Size: %s', newSize);
    let counter = 0;
    while (this.getArea() !== newSize) {
        if (++counter > 40) {
            debugger;
        }
        if (counter > 50) throw new Error('counter');
        // get resize amount
        const toResize = newSize - this.getArea();
        // choose either expand or shrink
        toResize > 0 
            ? balancer.expand(toResize) 
            : balancer.shrink(-toResize);
    }
    this.version += 1;
    console.log('column: resize: result: %s', this.getArea());
    return this;
}

Column.prototype.resizeTop = function(newSize) {
    if (this.balancer.top.type === 'empty') this.balancer.top.updateFromMain();
    return this.resize(this.balancer.top, newSize);
}

Column.prototype.resizeBottom = function(newSize) {
    if (this.balancer.bottom.type === 'empty') this.balancer.bottom.updateFromMain();
    return this.resize(this.balancer.bottom, newSize);
}

Column.prototype.scrollUp = function(size) {
    console.log('Column: scrollUp: size: %s', size);
    const currentArea = this.getArea();
    return this.resizeTop(currentArea - size).resizeBottom(currentArea);
}

Column.prototype.scrollDown = function(size) {
    console.log('Column: scrollDown: size: %s', size);
    const currentArea = this.getArea();
    return this.resizeTop(currentArea + size).resizeBottom(currentArea);
    return this;
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
