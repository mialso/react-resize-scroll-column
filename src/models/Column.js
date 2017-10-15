import {
    GRID_HEIGHT,
    GRID_SCROLL_HEIGHT,
    COLUMN_PAD,
} from '../constants/grid';
import { Item, Balancer } from './Balancer';

export default function Column(dataSource) {
    this.source = dataSource;
    this.main = [];
    this.switchDataDirection = false;
    this.dataDirection = 'bottom';
    this.balancer = {};
    this.addBalancer({ type: 'top' });
    this.nextItem = null;

    while (this.getArea() < GRID_HEIGHT) {
        const itemData = this.getNextItem();
        if ((itemData.size + this.getArea() + COLUMN_PAD) < GRID_HEIGHT) {
            this.main.push(new Item(itemData));
        } else {
            const viewArea = GRID_HEIGHT - this.getArea();
            this.addBalancer({ type: 'bottom', itemData, viewArea });
            break;
        }
    }

    this.version = 0;
}

Column.prototype.getNextItem = function() {
    let nextItem;
    if (this.nextItem) {
        nextItem = this.nextItem;
        this.nextItem = null;
    } else {
        nextItem = this.source[this.dataDirection].pop();
    }
    return nextItem;
}

Column.prototype.pushBackToSource = function(type) {
    if (this.balancer[type].type === 'normal') {
        this.source[type].push(this.balancer[type].getRaw());
    }
}

Column.prototype.addBalancer = function({ type, itemData, viewArea }) {
    const dataToAdd = itemData || this.getNextItem();
    this.balancer[type] = new Balancer(dataToAdd, viewArea);
}

Column.prototype.moveDown = function() {
    if (this.dataDirection !== 'bottom') {
        this.dataDirection = 'bottom';
        if (this.nextItem) {
            // get next item back to source
            this.source.top.push(this.nextItem);
            this.nextItem = null;
        }
    }
    if (!this.nextItem && this.source.bottom.isDataAvailable()) {
        this.nextItem = this.source.bottom.pop();
    }
    // update bottom balancer
    const scrollTop = this.balancer.bottom.resize(GRID_SCROLL_HEIGHT, !!this.nextItem);
    let scrollNext = this.balancer.bottom.scrollNext;
    if (scrollNext && !!this.nextItem) {
        this.moveBalancerToMain('bottom', scrollNext);
    }
    if (!scrollTop) return this;
    // update top balancer
    this.balancer.top.resize(-scrollTop);
    scrollNext = this.balancer.top.scrollNext;
    if (scrollNext) {
        // move main to balancer
        this.moveMainToBalancer('top', scrollNext);
    }
    return this;
};

Column.prototype.moveUp = function() {
    if (this.dataDirection !== 'top') {
        this.dataDirection = 'top';
        if (this.nextItem) {
            // get next item back to source
            this.source.bottom.push(this.nextItem);
            this.nextItem = null;
        }
    }
    // get next item in advance
    if (!this.nextItem && this.source.top.isDataAvailable()) {
        this.nextItem = this.source.top.pop();
    }
    // update top balancer
    const scrollBottom = this.balancer.top.resize(GRID_SCROLL_HEIGHT, !!this.nextItem);
    let scrollNext = this.balancer.top.scrollNext;
    if (scrollNext && !!this.nextItem) {
        this.moveBalancerToMain('top', scrollNext);
    }
    if (!scrollBottom) return this;
    // update bottom balancer
    this.balancer.bottom.resize(-scrollBottom);
    scrollNext = this.balancer.bottom.scrollNext;
    if (scrollNext) {
        this.moveMainToBalancer('bottom', scrollNext);
    }
    return this;
}

Column.prototype.moveMainToBalancer = function(type, scrollNext) {
    // move balancer item back to source in case it is normal
    this.pushBackToSource(type);
    // create new balancer from main
    let newBalancerData;
    switch(type) {
        case 'top': newBalancerData = this.main.shift().getRaw(); break;
        case 'bottom': newBalancerData = this.main.pop().getRaw(); break;
        default: throw new Error('mvb: wrong balancer type');
    }
    if (!newBalancerData) {
        // if no main item available - create empty balancer
        this.balancer[type] = new Balancer();
        return;
    }
    const newViewArea = newBalancerData.size + COLUMN_PAD - scrollNext;
    this.balancer[type] = new Balancer(newBalancerData, newViewArea);
}

Column.prototype.moveBalancerToMain = function(type, scrollNext) {
    const oldBalancer = this.balancer[type];
    switch (type) {
        case 'top': this.main.unshift(new Item(oldBalancer.getRaw())); break;
        case 'bottom': this.main.push(new Item(oldBalancer.getRaw())); break;
        default: throw new Error('mbm: wrong balancer type');
    }
    this.balancer[type] = new Balancer(this.getNextItem(), scrollNext);
};

Column.prototype.getArea = function() {
    const balancers = Object.keys(this.balancer).map(key => this.balancer[key]).reduce(countArea, 0);
    const main = this.main.reduce(countArea, 0);
    const padding = (this.main.length + 1) * COLUMN_PAD;
    return balancers + main + padding;
};

Column.prototype.getItemsCount = function() {
    const balancerItems = Object.keys(this.balancer)
        .map(key => this.balancer[key].size)
        .reduce((acc, size) => { return size > 0 ? ++acc : acc }, 0);

    return balancerItems + this.main.length;
};

function countArea(acc, item) {
    const viewArea = item.viewArea || item.size;
    if (!viewArea) {
        return acc;
    }
    return acc + viewArea;
}
