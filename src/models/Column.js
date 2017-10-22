import { TopBalancer, BottomBalancer } from './Balancer';
import { TopSource, BottomSource } from './Source';

function getDivider() {
    return {
        get: () => { return { size: 20, renderClass: 'divider', type: 'divider' } },
    };
}

export default function Column({ topDataSource, bottomDataSource, fixHandler }) {
    this._main = [];
    // init sources
    this.source = {
        top: topDataSource,
        bottom: bottomDataSource,
    };

    // create empty balancers
    this.balancer = {
        top: new TopBalancer({
            topSource: this.source.top,
            bottomSource: new BottomSource(this._main),
            dividerSource: getDivider(),
        }),
        bottom: new BottomBalancer({
            topSource: new TopSource(this._main),
            bottomSource: this.source.bottom,
            dividerSource: getDivider(),
        }),
    };
    this.fixHandler = fixHandler;
    this.version = 0;
}

Column.prototype.isScrollableDown = function() {
    return this.source.top.isDataAvailable() || !this.balancer.top.isFullView();
}

Column.prototype.isScrollableUp = function() {
    return this.source.bottom.isDataAvailable() || !this.balancer.bottom.isFullView();
}

Column.prototype.addToSource = function({ type, dataArray }) {
    if (!Object.keys(this.source).indexOf(type) === -1) {
        throw new Error(`Column: addToSource(): wrong source type: ${type}`);
    }
    this.source[type].concat(dataArray);
    return this;
}

Column.prototype.resize = function(balancer, newSize) {
    let counter = 0;
    // TODO guard in case recursive empty resize: if (balancer.type === 'empty') return this;
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
    /*
    // no more data in main - do nothing
    if (this.balancer.top.type === 'empty') return this;
    */
    return this.resize(this.balancer.top, newSize);
}

Column.prototype.resizeBottom = function(newSize) {
    if (this.balancer.bottom.type === 'empty') this.balancer.bottom.updateFromMain(false);
    // no more data in main - do nothing
    /*
    if (this.balancer.bottom.type === 'empty') {
        debugger;
        return this;
    }
    */
    return this.resize(this.balancer.bottom, newSize);
}

Column.prototype.scrollUp = function(size) {
    if (!this.isScrollableUp()) return this;
    const currentArea = this.getArea();
    if (this.balancer.bottom.size >= currentArea && (this.balancer.bottom.viewArea + size) > currentArea) {
        // resize the amount we are able to
        //debugger; 
        const ableToScroll = currentArea - this.balancer.bottom.viewArea;
        // TODO this is dirty thing "-1" to prevent balancer move to main
        ableToScroll && this.resizeBottom(currentArea + ableToScroll - 1).resizeTop(currentArea);
        
        if (this.balancer.bottom.type === 'scrollable' && this.balancer.bottom._raw.isScrollableUp) {
            // pass scroll to inner item
            this.balancer.bottom.contentPosition -= size;
            // set balancer size according to current height
            this.balancer.bottom._raw.size = this.balancer.bottom._raw.height;
            this.balancer.bottom.version += 1;
            this.version += 1;
            return this;
        } else {
            // move balancer to top
            this.balancer.top.update({
                itemData: this.balancer.bottom.getRaw(),
                initViewArea: this.balancer.bottom.viewArea,
            });
            // get new item from data
            this.balancer.bottom.updateFromData();
            // and resize the amount not scrolled before
            return this.resizeBottom(currentArea + size - ableToScroll + 1).resizeTop(currentArea);
        }
    }
    return this.resizeBottom(currentArea + size).resizeTop(currentArea);
}

Column.prototype.scrollDown = function(size) {
    if (!this.isScrollableDown()) return this;
    const currentArea = this.getArea();
    if (this.balancer.top.size >= currentArea && (this.balancer.top.viewArea + size) > currentArea) {
        // resize the amount we are able to
        //debugger;
        const ableToScroll = currentArea - this.balancer.top.viewArea;
        this.resizeTop(currentArea + ableToScroll - 1).resizeBottom(currentArea);
        
        if (this.balancer.top.type === 'scrollable' && this.balancer.top.scroll) {
            // pass scroll to inner item
            debugger;
        } else {
            // move balancer to top
            this.balancer.bottom.update({
                itemData: this.balancer.top.getRaw(),
                initViewArea: this.balancer.top.viewArea,
            });
            // get new item from data
            this.balancer.top.updateFromData();
            // and resize the amount not scrolled before
            return this.resizeTop(currentArea + size - ableToScroll + 1).resizeBottom(currentArea);
        }
    }
    return this.resizeTop(currentArea + size).resizeBottom(currentArea);
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
