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

    while (this.getArea() < GRID_HEIGHT) {
        const itemData = dataSource.next().value;
        if ((itemData.size + this.getArea()) < GRID_HEIGHT) {
            this.pushItem(itemData);
        } else {
            const viewArea = GRID_HEIGHT - this.getArea();
            this.addBalancer({ type: 'bottom', itemData, viewArea });
            break;
        }
    }

    this.version = 0;
}

Column.prototype.getNextItem = function() {
    let source;
    if (this.switchDataDirection) {
        source = this.source.next(this.balancer[this.dataDirection].data.text);
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

Column.prototype.moveDown = function() {
    if (this.dataDirection !== 'bottom') {
        this.dataDirection = 'bottom';
        this.switchDataDirection = true;
    }
    // update top balancer
    this.balancer.top.resize(-GRID_SCROLL_HEIGHT);
    let scrollNext = this.balancer.top.scrollNext;
    if (scrollNext) {
        // move main to balancer
        this.moveMainToBalancer('top', scrollNext);
    }
    // update bottom balancer
    this.balancer.bottom.resize(GRID_SCROLL_HEIGHT);
    scrollNext = this.balancer.bottom.scrollNext;
    if (scrollNext) {
        this.moveBalancerToMain('bottom', scrollNext);
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
    let scrollNext = this.balancer.top.scrollNext;
    if (scrollNext) {
        this.moveBalancerToMain('top', scrollNext);
    }
    // update bottom balancer
    this.balancer.bottom.resize(-GRID_SCROLL_HEIGHT);
    scrollNext = this.balancer.bottom.scrollNext;
    if (scrollNext) {
        // move balancer to buffer
        this.moveMainToBalancer('bottom', scrollNext);
    }
    return this;
}

Column.prototype.moveMainToBalancer = function(type, scrollNext) {
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
    newViewArea = newBalancerItem.size + COLUMN_PAD - scrollNext;
    this.balancer[type] = new Balancer(newBalancerItem, newViewArea);
}

Column.prototype.moveBalancerToMain = function(type, scrollNext) {
    if (!this.balancer[type].size) return;
    const oldBalancer = this.balancer[type];
    switch (type) {
        case 'top': this.unshiftItem(oldBalancer); break;
        case 'bottom': this.pushItem(oldBalancer); break;
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
