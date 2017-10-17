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
    this.balancer = {
        top: new Balancer(this.getNextItem('bottom')),
    };
    this.nextItem = null;

    while (this.getArea() < GRID_HEIGHT) {
        const itemData = this.getNextItem('bottom');
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

Column.prototype.getNextItem = function(direction) {
    let nextItem;
    if (this.nextItem) {
        nextItem = this.nextItem;
        this.nextItem = null;
    } else {
        nextItem = this.source[direction].pop();
    }
    return nextItem;
}

Column.prototype.pushBackToSource = function(type) {
    if (this.balancer[type].type === 'normal') {
        this.source[type].push(this.balancer[type].getRaw());
    }
}

Column.prototype.addBalancer = function({ type, itemData, viewArea }) {
    const dataToAdd = itemData || this.getNextItem(type);
    this.balancer[type] = new Balancer(dataToAdd, viewArea);
}

Column.prototype.resizeTop = function() {
    console.log('resizeTop');
    this.moveDown(GRID_SCROLL_HEIGHT, true);
    return this;
}

Column.prototype.resizeBottom = function(reverse = false, reverseScroll = false) {
    console.log('resizeBottom');
    let scroll = reverse ? GRID_SCROLL_HEIGHT : -GRID_SCROLL_HEIGHT;
    scroll = reverseScroll ? -scroll : scroll;
    reverse ? this.moveDown(scroll, true, true) : this.moveDown(scroll, true);
    return this;
}

Column.prototype.isAtTop = function() {
    return !this.nextItem && this.balancer.top.isFullView();
}

Column.prototype.isAtBottom = function() {
    return !this.nextItem && this.balancer.bottom.isFullView();
}

Column.prototype.moveDown = function(scroll = GRID_SCROLL_HEIGHT, noTopUpdate = false, botUpdate = false) {
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
    let scrollTop = scroll;
    let scrollNext;
    // update bottom balancer
    if (!botUpdate) {
        scrollTop = this.balancer.bottom.resize(scroll, !!this.nextItem);
        scrollNext = this.balancer.bottom.scrollNext;
        if (scrollNext && !!this.nextItem) {
            if (scroll > 0 ) {
                this.moveBalancerToMain('bottom', scrollNext);
            } else {
                this.moveMainToBalancer('bottom', scrollNext);
            }
        }
    }
    if (!botUpdate && (!scrollTop || noTopUpdate)) return this;
    // update top balancer
    this.balancer.top.resize(-scrollTop);
    scrollNext = this.balancer.top.scrollNext;
    if (scrollNext) {
        // move main to balancer
        if (scroll > 0) {
            this.moveMainToBalancer('top', scrollNext);
        } else {
            this.moveBalancerToMain('top', scrollNext);
        }
    }
    return this;
};

Column.prototype.moveUp = function(scroll = GRID_SCROLL_HEIGHT, noBottomUpdate = false) {
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
    const scrollBottom = this.balancer.top.resize(scroll, !!this.nextItem);
    let scrollNext = this.balancer.top.scrollNext;
    if (scrollNext && !!this.nextItem) {
        if (scroll > 0) {
            this.moveBalancerToMain('top', scrollNext);
        } else {
            this.moveMainToBalancer('top', scrollNext);
        }
    }
    if (!scrollBottom || noBottomUpdate) return this;
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
    // push balancer to main
    switch (type) {
        case 'top': this.main.unshift(new Item(oldBalancer.getRaw())); break;
        case 'bottom': this.main.push(new Item(oldBalancer.getRaw())); break;
        default: throw new Error('mbm: wrong balancer type');
    }
    // get new balancer from source
    this.balancer[type] = new Balancer(this.getNextItem(type), scrollNext);
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
