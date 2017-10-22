const emptyItem = {
    size: 0,
    data: { text: '' },
    type: 'empty',
};

export function Item(data = emptyItem) {
    if (!Number.isInteger(data.size)) throw new Error(`Item(): wrong size: ${data.size}`);
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

export function Balancer({ itemData, initViewArea, topSource, bottomSource, version, dividerSource }) {
    // inherit from item with default data in case no itemData provided
    Item.call(this, itemData);
    this.viewArea = initViewArea ? initViewArea : 0;
    this.source = {
        top: topSource,
        bottom: bottomSource,
        divider: dividerSource,
    };
    this.contentPosition = 0;
    this.version = Number.isInteger(version) ? version : 0;
}

Balancer.prototype = Object.create(Item.prototype);
Balancer.prototype.constructor = Balancer;

export function TopBalancer() {
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
    });
}
TopBalancer.prototype.updateFromData = function() {
    //this.moveItemToMain();
    // in case no more data available - set balancer to empty item
    if (!this.source.top.isDataAvailable()) return this.update(emptyItem);
    const nextItem = (this.type === 'item' || this.type === 'scrollable') ? this.source.divider.get() : this.source.top.get();
    this.update({ itemData: nextItem });
}
TopBalancer.prototype.moveItemToData = function() {
    if (this.type === 'divider') return;
    this.size && this.source.top.push(this.getRaw());
}
TopBalancer.prototype.moveItemToMain = function() {
    // move item to main
    this.size && this.source.bottom.prepend(this.getRaw());
}

export function BottomBalancer() {
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
    if (this.type === 'divider') return;
    this.size && this.source.bottom.push(this.getRaw());
}
BottomBalancer.prototype.moveItemToMain = function() {
    // move item to main
    this.size && this.source.top.append(this.getRaw());
}
BottomBalancer.prototype.updateFromMain = function(addMargin = true) {
    const nextItem = this.source.top.get();
    this.update({
        itemData: nextItem,
        initViewArea: nextItem && nextItem.size,
        version: this.version + 1,
    });
}
BottomBalancer.prototype.updateFromData = function() {
    //this.moveItemToMain();
    // in case no more data available - set balancer to empty item
    if (!this.source.bottom.isDataAvailable()) return this.update(emptyItem);
    const nextItem = (this.type === 'item' || this.type === 'scrollable') ? this.source.divider.get() : this.source.bottom.get();
    //if (this.type === nextItem.type) debugger;
    //const nextItem = this.source.bottom.get();
    this.update({ itemData: nextItem, version: this.version + 1 });
}

// TODO refactor getSize and getViewSize
Balancer.prototype.getSize = function() {
    return this.viewArea;
}

Balancer.prototype.getViewSize = function() {
    return this.viewArea < this.size ? this.viewArea : this.size;
}

Balancer.prototype.isFullView = function() {
    return this.size === this.viewArea;
}

Balancer.prototype.shrink = function(size) {
    if (!size || size < 0) throw new Error(`Balancer: resizeDown(): no size or lower then 0: ${size}`);
    const viewResizeAvailable = this.viewArea;
    // first - resize if available
    if (viewResizeAvailable) {
        // shrink item view
        let toResize = viewResizeAvailable > size ? size : viewResizeAvailable;
        // shrink viewArea
        this.viewArea -= toResize;
        this.version += 1;
    }
    // no more resize available - try to push item to and get new item from source
    if (this.viewArea === 0) {
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
        } else {
            this.moveItemToMain();
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

Balancer.prototype.update = function({ itemData, initViewArea }) {
    Balancer.call(
        this, 
        {
            initViewArea,
            itemData,
            version: this.version += 1,
            topSource: this.source.top,
            bottomSource: this.source.bottom,
            dividerSource: this.source.divider,
        },
    );
}

TopBalancer.prototype.isFixed = function() {
    return !this.source.top.isDataAvailable() && this.isFullView();
}

BottomBalancer.prototype.isFixed = function() {
    return !this.source.bottom.isDataAvailable() && this.isFullView();
}
