import {
    GRID_HEIGHT,
    GRID_SCROLL_HEIGHT,
    COLUMN_PAD,
} from '../constants/grid';
import { Item, Balancer, Buff } from './Balancer';

export default function Column(dataSource) {
    this.source = dataSource;
    this.main = [];
    this.switchDataDirection = false;
    this.dataDirection = 'bottom';
    this.buffer = {};
    this.balancer = {};
    this.replaceBuffer({ type: 'top' });
    this.addBalancer({ type: 'top' });

    while (this.getSize() < GRID_HEIGHT) {
        const itemData = dataSource.next().value;
        // TODO remove COLUMN_PAD from this logic
        if ((itemData.size + this.getSize() + COLUMN_PAD) < GRID_HEIGHT) {
            this.pushItem(itemData);
        } else {
            const viewArea = GRID_HEIGHT - this.getSize() - COLUMN_PAD;
            this.addBalancer({ type: 'bottom', itemData, viewArea });
        }
    }

    this.replaceBuffer({ type: 'bottom' });

    this.version = 0;
}

Column.prototype.getNextItem = function() {
    let source;
    if (this.switchDataDirection) {
        source = this.source.next(this.buffer[this.dataDirection].data.text);
        this.switchDataDirection = false;
    } else {
        source = this.source.next();
    }
    if (source.done) {
        return undefined;
    }
    console.log('got item: %s', source.value.data.text);
    return source.value;
}

Column.prototype.pushItem = function(data) {
    this.main.push(new Item(data));
}

Column.prototype.unshiftItem = function(data) {
    this.main.unshift(new Item(data));
}

Column.prototype.addBalancer = function({ type, itemData, viewArea }) {
    const dataToAdd = itemData || this.getNextItem();
    this.balancer[type] = new Balancer(dataToAdd, viewArea);
}

Column.prototype.replaceBuffer = function({ type, itemData }) {
    const dataToAdd = itemData || this.getNextItem();
    this.buffer[type] = new Buff(dataToAdd);
}

Column.prototype.moveDown = function() {
    if (this.dataDirection !== 'bottom') {
        this.dataDirection = 'bottom';
        this.switchDataDirection = true;
    }
    // update top balancer
    this.balancer.top.resize(-GRID_SCROLL_HEIGHT);
    if (this.balancer.top.scrollNext) {
        // move balancer to buffer
        this.moveBalancerToBuf('top');
    }
    // update bottom balancer
    this.balancer.bottom.resize(GRID_SCROLL_HEIGHT);
    const scrollNext = this.balancer.bottom.scrollNext;
    if (scrollNext) {
        this.moveBalancerToMain('bottom');
        this.moveBufToBalancer('bottom', scrollNext);
    }
    return this;
};

Column.prototype.moveUp = function() {
    if (this.dataDirection !== 'top') {
        this.dataDirection = 'top';
        this.switchDataDirection = true;
    }
    // update top balancer
    this.balancer.top.resize(GRID_SCROLL_HEIGHT);
    const scrollNext = this.balancer.top.scrollNext;
    if (scrollNext) {
        this.moveBalancerToMain('top');
        this.moveBufToBalancer('top', scrollNext);
    }
    // update bottom balancer
    this.balancer.bottom.resize(-GRID_SCROLL_HEIGHT);
    if (this.balancer.bottom.scrollNext) {
        // move balancer to buffer
        this.moveBalancerToBuf('bottom');
    }
    return this;
}

Column.prototype.moveBalancerToBuf = function(type) {
    if (!this.balancer[type].size) return;
    const oldBalancer = this.balancer[type];
    const scrollNext = oldBalancer.scrollNext;

    this.buffer[type] = new Buff(oldBalancer);
    let newBalancerItem;
    switch(type) {
        case 'top': newBalancerItem = this.main.shift(); break;
        case 'bottom': newBalancerItem = this.main.pop(); break;
        default: throw new Error('mvb: wrong balancer type');
    }
    if (!newBalancerItem) {
        this.balancer[type] = new Balancer();
        return;
    }
    let newViewArea = 0;
    if (scrollNext < COLUMN_PAD) {
        newViewArea = newBalancerItem.size + COLUMN_PAD - scrollNext;
    } else {
        newViewArea = newBalancerItem.size + COLUMN_PAD - scrollNext;
    }
    this.balancer[type] = new Balancer(newBalancerItem, newViewArea);
};

Column.prototype.moveBalancerToMain = function(type) {
    if (!this.balancer[type].size) return;
    const oldBalancer = this.balancer[type];
    switch (type) {
        case 'top': this.unshiftItem(oldBalancer); break;
        case 'bottom': this.pushItem(oldBalancer); break;
        default: throw new Error('mbm: wrong balancer type');
    }
    this.balancer[type] = new Balancer();
};

Column.prototype.moveBufToBalancer = function(type, scrollNext) {
    if (!this.buffer[type].size) return;
    const newBalancerItem = this.buffer[type];
    const newViewArea = scrollNext;
    this.balancer[type] = new Balancer(newBalancerItem, newViewArea);
    this.replaceBuffer({ type });
};

Column.prototype.getSize = function() {
    const buffers = Object.keys(this.buffer).map(key => this.buffer[key]).reduce(countSize, 0);
    const balancers = Object.keys(this.balancer).map(key => this.balancer[key]).reduce(countSize, 0);
    const main = this.main.reduce(countSize, 0);
    return buffers + balancers + main;
};

Column.prototype.getItemsCount = function() {
    const balancerItems = Object.keys(this.balancer)
        .map(key => this.balancer[key].size)
        .reduce((acc, size) => { return size > 0 ? ++acc : acc }, 0);

    return balancerItems + this.main.length;
};

function countSize(acc, item) {
    if (!item.size) {
        return acc;
    }
    return acc + item.size;
}
