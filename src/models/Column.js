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
    this.moreData = true;

    while (this.getArea() < GRID_HEIGHT) {
        const itemData = this.getNextItem();
        if ((itemData.size + this.getArea()) < GRID_HEIGHT) {
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
    return this.source[this.dataDirection].pop();
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
    }
    this.moreData = this.source[this.dataDirection].isDataAvailable();
    // update top balancer
    this.balancer.top.resize(-GRID_SCROLL_HEIGHT);
    let scrollNext = this.balancer.top.scrollNext;
    if (scrollNext && this.moreData) {
        // move main to balancer
        this.moveMainToBalancer('top', scrollNext);
    }
    // update bottom balancer
    this.balancer.bottom.resize(GRID_SCROLL_HEIGHT);
    scrollNext = this.balancer.bottom.scrollNext;
    if (scrollNext && this.moreData) {
        this.moveBalancerToMain('bottom', scrollNext);
    }
    return this;
};

Column.prototype.moveUp = function() {
    if (this.dataDirection !== 'top') {
        this.dataDirection = 'top';
    }
    this.moreData = this.source[this.dataDirection].isDataAvailable();
    // update top balancer
    this.balancer.top.resize(GRID_SCROLL_HEIGHT);
    let scrollNext = this.balancer.top.scrollNext;
    if (scrollNext && this.moreData) {
        this.moveBalancerToMain('top', scrollNext);
    }
    // update bottom balancer
    this.balancer.bottom.resize(-GRID_SCROLL_HEIGHT);
    scrollNext = this.balancer.bottom.scrollNext;
    if (scrollNext && this.moreData) {
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
    if (!(this.balancer[type].size && this.source[this.dataDirection].isDataAvailable())) return;
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
