import { TopBalancer, BottomBalancer } from './Balancer';
import { TopSource, BottomSource } from './Source';

export default function Column({ topDataArray, bottomDataArray, fixHandler }) {
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
    this.fixHandler = fixHandler;
    this.version = 0;
}

Column.prototype.isScrollableDown = function() {
    return this.source.bottom.isDataAvailable() || !this.balancer.bottom.isFullView();
}

Column.prototype.isScrollableUp = function() {
    return this.source.top.isDataAvailable() || !this.balancer.top.isFullView();
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
        if (++counter > 40) {
            debugger;
        }
        if (counter > 50) throw new Error('counter');
        // get resize amount
        const toResize = newSize - this.getArea();
        // choose either expand or shrink
        if (toResize > 0) {
            // if balancer is not able to resize more - go out from loop
            if (balancer.isFixed()) {
                //debugger;
                break;
            }
            balancer.expand(toResize) 
        } else {
            balancer.shrink(-toResize);
        }
    }
    const sizeAfter = this.getArea();
    if (sizeAfter !== newSize) {
        // we are not able to resize more, balancer is fixed
        // TODO possible implement fixHandler
        if (typeof this.fixHandler === 'function') {
            setTimeout(() => this.fixHandler(sizeAfter), 0);
        }

        // TODO or just reverse back opposite balancer
    }
    this.version += 1;
    return this;
}

Column.prototype.resizeTop = function(newSize) {
    if (this.balancer.top.type === 'empty') this.balancer.top.updateFromMain(false);
    return this.resize(this.balancer.top, newSize);
}

Column.prototype.resizeBottom = function(newSize) {
    if (this.balancer.bottom.type === 'empty') this.balancer.bottom.updateFromMain(false);
    return this.resize(this.balancer.bottom, newSize);
}

Column.prototype.scrollUp = function(size) {
    const currentArea = this.getArea();
    return this.resizeTop(currentArea - size).resizeBottom(currentArea);
}

Column.prototype.scrollDown = function(size) {
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
    const balancers = this.countBalancersArea();
    const main = this.countMainArea();
    return balancers + main;
};

Column.prototype.getItemsCount = function() {
    const balancerItems = Object.keys(this.balancer)
        .map(key => this.balancer[key].size)
        .reduce((acc, size) => { return size > 0 ? ++acc : acc }, 0);

    return balancerItems + this._main.length;
};

Column.prototype.countBalancersArea = function() {
    const topBalancerViewArea = this.balancer.top.getSize();
    const bottomBalancerViewArea = this.balancer.bottom.getSize();
    return topBalancerViewArea + bottomBalancerViewArea;
}

Column.prototype.countMainArea = function() {
    return this._main.reduce((acc, item) => { return acc + item.size }, 0)
}
