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
    this.inViewStorage.push(item);
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
    this.inViewStorage.push(item);
    return mutateInstance(item);
}

export function GridSetSource(dataArray) {
    this.inView = new Source([]);
    this.top = new TopSource([], this.inView);
    this.bottom = new BottomSource(dataArray, this.inView);
}
GridSetSource.prototype.addData = function(items) {
    this.bottom.pushArray(items);
}
