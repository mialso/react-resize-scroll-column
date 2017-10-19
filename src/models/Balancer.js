import { COLUMN_PAD } from '../constants/grid';

const emptyItem = {
    size: 0,
    data: { text: '' },
    type: 'empty',
};

export function Item(data = emptyItem) {
    this.size = data.size;
    /*
    this.data = {
        text: data.data.text,
    };
    */
    this.type = data.type || 'normal';
    this._raw = data;
}

Item.prototype.getSize = function() {
    return this.size;
}

Item.prototype.getRaw = function() {
    return this._raw;
}

export function Balancer({ itemData, initViewArea, topSource, bottomSource, margin, version }) {
    // inherit from item with default data in case no itemData provided
    Item.call(this, itemData);
    this.viewArea = initViewArea ? initViewArea : 0;
    this.source = {
        top: topSource,
        bottom: bottomSource,
    };
    this.margin = margin || 0;
    this.version = version || 0;
}

Balancer.prototype = Object.create(Item.prototype);
Balancer.prototype.constructor = Balancer;

export function TopBalancer({ itemData, initViewArea, topSource, bottomSource }) {
    Balancer.call(this, arguments[0]);
}

TopBalancer.prototype = Object.create(Balancer.prototype);
TopBalancer.prototype.constructor = TopBalancer;
TopBalancer.prototype.isShrinkDataAvailable = function() {
    return this.source.bottom.isDataAvailable();
}
TopBalancer.prototype.isExpandDataAvailable = function() {
    return this.source.top.isDataAvailable();
}
TopBalancer.prototype.updateFromMain = function(addMargin = true) {
    const nextItem = this.source.bottom.get();
    this.update({
        itemData: nextItem,
        initViewArea: nextItem && nextItem.size,
        margin: addMargin ? COLUMN_PAD : 0,
    });
}
TopBalancer.prototype.updateFromData = function() {
    this.size && this.source.bottom.push(this.getRaw());
    const nextItem = this.source.top.get();
    this.update({ itemData: nextItem });
}
TopBalancer.prototype.moveItemToData = function() {
    this.size && this.source.top.push(this.getRaw());
}

export function BottomBalancer({ itemData, initViewArea, topSource, bottomSource }) {
    Balancer.call(this, arguments[0]);
}

BottomBalancer.prototype = Object.create(Balancer.prototype);
BottomBalancer.prototype.constructor = BottomBalancer;
BottomBalancer.prototype.isShrinkDataAvailable = function() {
    return this.source.top.isDataAvailable();
}
BottomBalancer.prototype.isExpandDataAvailable = function() {
    return this.source.bottom.isDataAvailable();
}
BottomBalancer.prototype.moveItemToData = function() {
    this.size && this.source.bottom.push(this.getRaw());
}
BottomBalancer.prototype.updateFromMain = function(addMargin = true) {
    const nextItem = this.source.top.get();
    this.update({
        itemData: nextItem,
        initViewArea: nextItem && nextItem.size,
        margin: addMargin ? COLUMN_PAD : 0,
        version: this.version + 1,
    });
}
BottomBalancer.prototype.updateFromData = function() {
    this.size && this.source.top.push(this.getRaw());
    const nextItem = this.source.bottom.get();
    this.update({ itemData: nextItem, version: this.version + 1 });
}

// TODO refactor getSize and getViewSize
Balancer.prototype.getSize = function() {
    return this.viewArea + this.margin;
}

Balancer.prototype.getViewSize = function() {
    return this.viewArea < this.size ? this.viewArea : this.size;
}

Balancer.prototype.isScrollable = function(scrollSize) {
    const newViewArea = this.viewArea + scrollSize;
    return newViewArea > 0 && newViewArea < this.size + COLUMN_PAD;
}

Balancer.prototype.isFullView = function() {
    return this.size === this.viewArea;
}

Balancer.prototype.shrink = function(size) {
    if (!size || size < 0) throw new Error(`Balancer: resizeDown(): no size or lower then 0: ${size}`);
    const viewResizeAvailable = this.viewArea + this.margin;
    // first - resize if available
    if (viewResizeAvailable) {
        // shrink item view
        let toResize = viewResizeAvailable > size ? size : viewResizeAvailable;
        if (this.margin > 0) {
            // shrink margin
            if (this.margin >= toResize) {
                this.margin -= toResize;
                toResize = 0;
            } else {
                toResize -= this.margin;
                this.margin = 0;
            }
        }
        // shrink viewArea
        this.viewArea -= toResize;
        this.version += 1;
    }
    // no more resize available - try to push item to and get new item from source
    if ((this.viewArea + this.margin) === 0) {
        this.moveItemToData();
        this.isShrinkDataAvailable() && this.updateFromMain();
    }
}

Balancer.prototype.expand = function(size) {
    if (!size || size < 0) throw new Error(`Balancer: resizeDown(): no size or lower then 0: ${size}`);

    if (this.isExpandDataAvailable()) {
        // we have more data to pull from source
        const viewResizeAvailable = this.size - this.viewArea;
        if (viewResizeAvailable) {
            // expand item view
            const toResize = viewResizeAvailable > size ? size : viewResizeAvailable;
            this.viewArea += toResize;
        } else if (size <= (COLUMN_PAD - this.margin) && this.source.bottom.isDataAvailable()) {
            // expand item margin
            this.margin += size;
        } else {
            this.updateFromData();
        }
    } else {
        // no more data available - resize any amount we have
        const viewResizeAvailable = this.size - this.viewArea;
        if (viewResizeAvailable > 0) {
            const toResize = viewResizeAvailable >= size ? size : viewResizeAvailable;
            this.viewArea += toResize;
        } else {
            // do nothing - no version update
            return;
        }
    } 
    this.version += 1;
}

Balancer.prototype.update = function({ itemData, initViewArea, margin }) {
    Balancer.call(
        this, 
        {
            initViewArea,
            itemData,
            margin,
            version: this.version,
            topSource: this.source.top,
            bottomSource: this.source.bottom,
        },
    );
}


/*
Balancer.prototype.resize = function(size, doScroll = true) {
    if (!this.size) return;
    const newViewArea = this.viewArea + size;
    if (doScroll) {
        if (newViewArea > this.size + COLUMN_PAD) {
            this.scrollNext = newViewArea - this.size - COLUMN_PAD;
            this.viewArea = this.size;
        } else if(newViewArea <= 0) {
            this.scrollNext = -newViewArea;
            this.viewArea = 0;
        } else {
            this.viewArea += size;
        }
        return size;
    } else {
        let notScrolled = 0;
        if (newViewArea > this.size) {
            notScrolled = newViewArea - this.size
        }
        this.scrollNext = 0;
        this.viewArea = newViewArea - notScrolled;
        // return the resized amount
        return size - notScrolled;
    }
}
*/

Balancer.prototype.getMargin = function() {
    return this.margin;
}

TopBalancer.prototype.isFixed = function() {
    return !this.source.top.isDataAvailable() && this.isFullView();
}

BottomBalancer.prototype.isFixed = function() {
    return !this.source.bottom.isDataAvailable() && this.isFullView();
}
