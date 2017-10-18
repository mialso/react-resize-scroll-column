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

export function Balancer({ itemData, initViewArea, topSource, bottomSource, margin }) {
    // inherit from item with default data in case no itemData provided
    Item.call(this, itemData);
    this.viewArea = initViewArea ? initViewArea : 0;
    this.source = {
        top: topSource,
        bottom: bottomSource,
    };
    this.margin = margin || 0;
    this.version = 0;
}

Balancer.prototype = Object.create(Item.prototype);
Balancer.prototype.constructor = Balancer;

export function TopBalancer({ itemData, initViewArea, topSource, bottomSource }) {
    Balancer.call(this, arguments[0]);
}

TopBalancer.prototype = Object.create(Balancer.prototype);
TopBalancer.prototype.constructor = TopBalancer;

export function BottomBalancer({ itemData, initViewArea, topSource, bottomSource }) {
    Balancer.call(this, arguments[0]);
}

BottomBalancer.prototype = Object.create(Balancer.prototype);
BottomBalancer.prototype.constructor = BottomBalancer;

/*
BottomBalancer.prototype.isResizable = function() {
    // if no more data available, resizable only if has area to expand
    return this.source.bottom.isDataAvailable() || this.viewArea < this.size;
}
*/

Balancer.prototype.getSize = function() {
    return this.viewArea + this.margin;
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
    if (this.source.top.isDataAvailable()) {
        // we have more data to pull from source
        const viewResizeAvailable = this.viewArea + this.margin;
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
        } else {
            // pull next item from source
            const nextItem = this.source.top.get();
            if (!nextItem) {
                // no more data - nothing to do
                return;
            }

            // push this item back to source
            this.size && this.source.bottom.push(new Item(this.getRaw()));
            // update this balancer with full item view
            this.update({ itemData: nextItem, initViewArea: nextItem.size, margin: COLUMN_PAD });
        }
    } else {
        // no more data available - resize any amount we have
        const viewResizeAvailable = this.viewArea;
        if (viewResizeAvailable > 0) {
            // shrink all available size or just current viewArea
            const toResize = viewResizeAvailable >= size ? size : viewResizeAvailable;
            this.viewArea -= toResize;
        }
    } 
    this.version += 1;
}

Balancer.prototype.expand = function(size) {
    if (!size || size < 0) throw new Error(`Balancer: resizeDown(): no size or lower then 0: ${size}`);

    if (this.source.bottom.isDataAvailable()) {
        // we have more data to pull from source
        const viewResizeAvailable = this.size - this.viewArea;
        if (viewResizeAvailable) {
            // expand item view
            const toResize = viewResizeAvailable > size ? size : viewResizeAvailable;
            this.viewArea += toResize;
        } else if (size < (COLUMN_PAD - this.margin) && this.source.bottom.isDataAvailable()) {
            // expand item margin
            this.margin += size;
        } else {
            // pull next item from source
            const nextItem = this.source.bottom.get();
            if (!nextItem) {
                // no more data - nothing to do
                return;
            }

            // check if item has size and push this item to source
            this.size && this.source.top.push(new Item(this.getRaw()));
            // update this balancer
            this.update({ itemData: nextItem });
        }
    } else {
        // no more data available - resize any amount we have
        const viewResizeAvailable = this.size - this.viewArea;
        if (viewResizeAvailable > 0) {
            const toResize = viewResizeAvailable >= size ? size : viewResizeAvailable;
            this.viewArea += toResize;
        }
    } 
    this.version += 1;
}

Balancer.prototype.update = function({ itemData, initViewArea }) {
    Balancer.call(
        this, 
        {
            initViewArea,
            itemData,
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
