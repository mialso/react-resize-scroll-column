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

export default function ColumnSource({ topData, bottomData }) {
    this.top = {
        data: topData,
        pop() {
            return this.data.pop();
        },
        push(item) {
            console.log('top push: %s', item.index);
            this.data.push(item);
            this.data.sort((a, b) => a.index - b.index)
            /*
            for (let i = this.data.length - 1; i >= 0; --i) {
                if (this.data[i].index < item.index) {
                    this.data.splice(i, 0, item);
                }
            }
            */
            console.log('topArr = %s', JSON.stringify(this.data.map(i => i.index)));
        },
        isDataAvailable() {
            return this.data.length > 0;
        }
    };
    this.bottom = {
        data: bottomData,
        pop() {
            return this.data.shift();
        },
        push(item) {
            console.log('bottom push: %s', item.index);
            this.data.unshift(item);
            this.data.sort((a, b) => a.index - b.index)
            /*
            for (let i = 0; i < this.data.length; ++i) {
                if (this.data[i].index > item.index) {
                    this.data.splice(i, 0, item);
                }
            }
            */
            console.log('botArr = %s', JSON.stringify(this.data.map(i => i.index)));
            //this.data[item.index] = item;
        },
        isDataAvailable() {
            return this.data.length > 0;
        }
    };
}

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
