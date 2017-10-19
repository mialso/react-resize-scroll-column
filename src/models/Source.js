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
/*
TopSource.prototype.push = function(item) {
    this._data.unshift(item);
}
*/

export function BottomSource(dataArray) {
    Source.call(this, dataArray);
}

BottomSource.prototype = Object.create(Source.prototype);
BottomSource.prototype.constructor = BottomSource;

BottomSource.prototype.get = function() {
    return this._data.shift();
}
/*
BottomSource.prototype.push = function(item) {
    this._data.push(item);
}
*/
/*
function getGridSource(source, columns) {
    const bottomBuffer = source.slice();
    const topBuffer = [];

    const topIndex = 0;
    const bottomIndex = 0;

    const manager = {
        getDown() {
            return source.slice(inViewDown, inViewDown + 4);
        },
        getUp()  {
            return source.slice(inViewUp - 4, inViewUp);
        }
    }
    return manager;
}

function* getColumnBuffer(source) {
    let bufferData = source.next();
    while(!bufferData.done && Array.isArray(bufferData.value)) {
        const bufferArray = bufferData.value.sort((a, b) => a.size - b.size);
        while(bufferArray.length) {
            // return the largest item to consumer
            yield bufferArray.pop();
        }
        bufferData = source.next();
    }
}
*/

/*
function* getColumnSource(queue) {
    let index = 0;
    let goRight = true;

    while(queue[index]) {
        const reverse = yield queue[index];
        if (reverse < 0) throw new Error('reverse lower then Zero');
        if (reverse) {
            index = reverse;
            console.log('reverse: %s, index: %s', reverse, index);
            goRight = !goRight;
        }
        index += goRight ? 1 : -1 ;
    }
}
*/
