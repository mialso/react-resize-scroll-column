function Source(dataArray) {
    this._data = dataArray;
}

Source.prototype.push = function(item) {
    this._data.push(item);
    this._data.sort((a, b) => a.index - b.index)
}

Source.prototype.isDataAvailable = function() {
    return this._data.length > 0;
}

Source.prototype.concat = function(dataArray) {
    if (!(Array.isArray(dataArray))) {
        throw new Error(`Source: concat(): item is not array, but ${typeof dataArray}`);
    }
    this._data = this._data.concat(dataArray);
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
