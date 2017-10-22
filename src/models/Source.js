function mutateInstance(obj) {
    return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
}

const sourceSortPredicate = (a, b) => {
    return a.index - b.index;
}

function Source(dataArray) {
    this._data = dataArray;
}

Source.prototype.push = function(item) {
    this._data.push(item);
    this._data.sort(sourceSortPredicate);
}

Source.prototype.pushArray = function(itemsArray) {
    // TODO - this mutates the inner data array - avoid it with splice or mutate everything
    this._data = this._data.concat(itemsArray);
    this._data.sort(sourceSortPredicate);
}

Source.prototype.isDataAvailable = function() {
    return this._data.length > 0;
}

Source.prototype.concat = function(dataArray) {
    if (!(Array.isArray(dataArray))) {
        throw new Error(`Source: concat(): item is not array, but ${typeof dataArray}`);
    }
    this._data = this._data.concat(dataArray);
    // TODO this._data.sort((a, b) => a.index - b.index)
}

Source.prototype.append = function(item) {
    this._data.push(item);
}

Source.prototype.prepend = function(item) {
    this._data.unshift(item);
}

Source.prototype.removeByIndex = function(index) {
    const itemToRemove = this._data.find(item => item.index === index);
    this._data = this._data.filter(item => item.index !== index);
    return itemToRemove;
}

export function TopSource(dataArray) {
    Source.call(this, dataArray);
}


TopSource.prototype = Object.create(Source.prototype);
TopSource.prototype.constructor = TopSource;

TopSource.prototype.get = function() {
    return this._data.pop();
}

export function BottomSource(dataArray) {
    Source.call(this, dataArray);
}

BottomSource.prototype = Object.create(Source.prototype);
BottomSource.prototype.constructor = BottomSource;

BottomSource.prototype.get = function() {
    return this._data.shift();
}

export function GridSetTopSource(dataArray, inViewSource) {
    TopSource.call(this, dataArray);
    this.inViewSource = inViewSource;
}
GridSetTopSource.prototype = Object.create(TopSource.prototype);
GridSetTopSource.prototype.constructor = GridSetTopSource;
GridSetTopSource.prototype.get = function() {
    const item = this._data.pop();
    this.inViewSource.push(item);
    return mutateInstance(item);
}

export function GridSetBottomSource(dataArray, inViewSource) {
    BottomSource.call(this, dataArray);
    this.inViewSource = inViewSource;
}
GridSetBottomSource.prototype = Object.create(TopSource.prototype);
GridSetBottomSource.prototype.constructor = GridSetBottomSource;
GridSetBottomSource.prototype.get = function() {
    const item = this._data.shift();
    if (!item) return undefined;
    this.inViewSource.push(item);
    return mutateInstance(item);
}

export function GridSetSource(dataArray) {
    this.inView = new Source([]);
    this.top = new GridSetTopSource([], this.inView);
    this.bottom = new GridSetBottomSource(dataArray, this.inView);
}
GridSetSource.prototype.addData = function(items) {
    this.bottom.pushArray(items);
}
GridSetSource.prototype.isDataAvailable = function() {
    return Object.keys(this).reduce((acc, key) => this[key].isDataAvailable() || acc, false);
}
GridSetTopSource.prototype.push = function(item) {
    if (!(item && Number.isInteger(item.index))) throw new Error(`GridSetTopSource: push(): item.index is not integer: ${typeof item.index}`);
    // remove item from inView
    const inViewItem = this.inViewSource.removeByIndex(item.index);
    this._data.push(inViewItem);
    this._data.sort(sourceSortPredicate);
}
GridSetBottomSource.prototype.push = function(item) {
    if (!(item && Number.isInteger(item.index))) throw new Error(`GridSetTopSource: push(): item.index is not integer: ${typeof item.index}`);
    // remove item from inView
    const inViewItem = this.inViewSource.removeByIndex(item.index);
    this._data.push(item);
    this._data.sort(sourceSortPredicate);
}
