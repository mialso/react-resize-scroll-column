import {
    COLUMNSET_SCROLL_DOWN,
    COLUMNSET_SCROLL_UP,
    COLUMNSET_RESIZE_DOWN,
    COLUMNSET_DATA_UPDATE,
    COLUMNSET_RESIZE_UP,
    COLUMNSET_INIT_HEIGHT,
} from '../actions/columnset';
import Column from '../models/Column';
import { GridSetSource } from '../models/Source';

function prepareGridSetData(dataArray) {
    return parseItems(dataArray);
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

const initialState = { 
    height: 0,
    width: 0,
    columnWidth: 150,
    source: new GridSetSource([]),
    columns: [],
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
            const { height, width, columnWidth } = action.payload;
            return Object.assign({}, state, {
                height: Number.isInteger(height) ? height : 0,
                width: Number.isInteger(width) ? width : 0,
                columnWidth: Number.isInteger(columnWidth) ? columnWidth : 0,
            });
        }
        case COLUMNSET_DATA_UPDATE: {
            const { dataArray } = action.payload;
            if (!Array.isArray(dataArray)) return state;
            // init new set with data
            // calculate columns number
            const columnsNumber = calculateSetColumns(state);
            if (!columnsNumber) return state;
            // init data source
            state.source.addData(prepareGridSetData(dataArray));
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
