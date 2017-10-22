import {
    COLUMNSET_SCROLL_DOWN,
    COLUMNSET_SCROLL_UP,
    COLUMNSET_RESIZE_DOWN,
    COLUMNSET_DATA_UPDATE,
    COLUMNSET_RESIZE_UP,
    COLUMNSET_INIT_HEIGHT,
    COLUMNSET_SCROLL,
} from '../actions/columnset';
import Column from '../models/Column';
import { GridSetSource } from '../models/Source';

function prepareFromArray(dataArray) {
    return parseItems(dataArray);
}

function scrollableStateUpdateHander(scrollableState) {
    this.height = scrollableState.height;
    this.isScrollableDown = scrollableState.isScrollableDown;
    this.isScrollableUp = scrollableState.isScrollableUp;
}


function prepareFromObject(dataObject) {
    return Object.keys(dataObject).map((key, index) => {
        const scrollableItem = {
            size: 10000,
            data: Array.isArray(dataObject[key]) ? dataObject[key] : [],
            renderClass: `Car_${key}`,
            index,
            type: 'scrollable',
            height: 0,
            isScrollableUp: false,
            isScrollableDown: false,
        };
        scrollableItem.scrollableStateUpdateHander = scrollableStateUpdateHander.bind(scrollableItem);

        return scrollableItem;
    });
}
function parseItems(items) {
    return items.map((item, index) => {
        return {
            size: calculateCarSize(item),
            data: item,
            renderClass: 'G-Item',
            index,
            type: 'item',
        };
    });
}

function fixHandler(size) {
    console.log('fix handler: %s', size);
}

function calculateSetColumns(state) {
    const { width, columnWidth } = state;
    const columnsNumber = Number.parseInt(width / columnWidth, 10);
    if (!Number.isInteger(columnsNumber)) return 0;
    return columnsNumber;
}

function calculateCarSize(car) {
    return 30 + 30 + car.photoHeight;
}

const initialState = { 
    id: '',
    height: 0,
    width: 0,
    columnWidth: 150,
    source: {},
    columns: [],
    contentPosition: 0,
    initialized: false,
}
export default function reducer(state = {}, action) {
    if (!(action && action.meta)) return state;
    switch (action.type) {
        case COLUMNSET_INIT_HEIGHT: {
            const { id } = action.meta;
            const newState = {};
            newState[id] = columnsetReducer(undefined, action);
            return Object.assign({}, state, newState); 
        }
        default: {
            const { id } = action.meta;
            if (!state[id]) return state;
            const newState = columnsetReducer(state[id], action);
            if (newState === state[id]) return state;
            state[id] = newState;
            return Object.assign({}, state);
        }
    }
}
function columnsetReducer(state = initialState, action) {
    if (!action) return state;
    switch (action.type) {
        case COLUMNSET_INIT_HEIGHT: {
            if (!action.payload) return state;
            const { height, width, columnWidth, id } = action.payload;
            if (state.initialized) {
                return Object.assign({}, state, { height });
            }
            return Object.assign({}, state, {
                id,
                height: Number.isInteger(height) ? height : 0,
                width: Number.isInteger(width) ? width : 0,
                columnWidth: Number.isInteger(columnWidth) ? columnWidth : 0,
                source: new GridSetSource([]),
                initialized: true,
            });
        }
        case COLUMNSET_DATA_UPDATE: {
            const { data, isSet = false } = action.payload;

            if(typeof state.source.isDataAvailable() === 'function') return state;

            if (!Array.isArray(data) && !isSet) return state;
            // init new set with data
            // calculate columns number
            const columnsNumber = calculateSetColumns(state);
            if (!columnsNumber) return state;
            // init data source
            //debugger;
            state.source.addData(isSet ? prepareFromObject(data) : prepareFromArray(data));
            // create columns
            const columns = [];
            for (let i = 0; i < columnsNumber; ++i) {
                const newColumn = new Column({
                    topDataSource: state.source.top,
                    bottomDataSource: state.source.bottom,
                    fixHandler,
                });
                columns.push(newColumn);
            }
            if (state.height) {
                // resize columns if height available
                columns.forEach(column => column.resizeBottom(state.height));
            }
            return Object.assign({}, state, { columns });
        }
        case COLUMNSET_RESIZE_DOWN: {
            if (!action.payload) return state;
            const newHeight = Number.parseInt(action.payload.height, 10);
            if (Number.isInteger(newHeight)) {
                if (state.height !== newHeight) {
                    return Object.assign({}, state, {
                        height: newHeight,
                        columns: state.columns.map(column => column.resizeBottom(newHeight)),
                    });
                }
                // no height was available, just init
                // TODO sync height and data updates
                return Object.assign({}, state, { height: newHeight });
            }
            return state;
        }
        case COLUMNSET_RESIZE_UP: {
            if (!action.payload) return state;
            const newHeight = Number.parseInt(action.payload.height, 10);
            if (Number.isInteger(newHeight)) {
                if (state.height !== newHeight) {
                    return Object.assign({}, state, {
                        height: newHeight,
                        columns: state.columns.map(column => column.resizeTop(newHeight)),
                    });
                }
                // no height was available, just init
                // TODO sync height and data updates
                return Object.assign({}, state, { height: newHeight });
            }
            return state;
        }
        case COLUMNSET_SCROLL: {
            if (!(action.payload && typeof action.payload === 'object')) return state;
            const newContentPosition = Number.parseInt(action.payload.contentPosition, 10);
            if (!Number.isInteger(newContentPosition)) return state;
            const scrollAmount = newContentPosition - state.contentPosition;
            if (scrollAmount > 0) {
                return Object.assign({}, state, {
                    columns: state.columns.map(column => column.scrollDown(scrollAmount)),
                    contentPosition: newContentPosition,
                });
            } else {
                return Object.assign({}, state, {
                    columns: state.columns.map(column => column.scrollUp(-scrollAmount)),
                    contentPosition: newContentPosition,
                });
            }
        }
        case COLUMNSET_SCROLL_DOWN: {
            if (!action.payload) return state;
            const scrollSize = Number.parseInt(action.payload, 10);
            if (Number.isInteger(scrollSize)) {
                return Object.assign({}, state, {
                    columns: state.columns.map(column => column.scrollDown(scrollSize)),
                });
            }
            return state;
        }
        case COLUMNSET_SCROLL_UP: {
            if (!action.payload) return state;
            const scrollSize = Number.parseInt(action.payload, 10);
            if (Number.isInteger(scrollSize)) {
                return Object.assign({}, state, {
                    columns: state.columns.map(column => column.scrollUp(scrollSize)),
                });
            }
            return state;
        }
        default: return state;
    }
}
