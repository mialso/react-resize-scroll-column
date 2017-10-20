import {
    GRIDSET_SCROLL_DOWN,
    GRIDSET_SCROLL_UP,
    GRIDSET_RESIZE_DOWN,
    GRIDSET_DATA_UPDATE,
} from '../actions/gridSet';
import Column from '../models/Column';
import { GridSetSource } from '../models/Source';

function prepareGridSetData(dataArray) {
    return dataArray;
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

const initialState = { 
    height: 0,
    width: 500,
    columnWidth: 150,
    source: new GridSetSource([]),
    columns: [],
}

export default function gridSetReducer(state = initialState, action) {
    if (!action) return state;
    switch (action.type) {
        case GRIDSET_DATA_UPDATE: {
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
                columns.push(new Column({
                    topDataSource: state.source.top,
                    bottomDataSource: state.source.bottom,
                    fixHandler,
                }));
            }
            state.columns = columns;
            return state;
        }
        case GRIDSET_RESIZE_DOWN: {
            if (!action.payload) return state;
            const newHeight = Number.parseInt(action.payload.height, 10);
            if (Number.isInteger(newHeight)) {
                if (state.height) {
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
            /*
        case GRID_SET_DATA_READY: {
            if (!action.payload) return state;
            const { items } = action.payload;
            if (Array.isArray(items) && items.length > 0) {
                const updatedColumn = state.column
                    .addToSource(
                        {
                            type: 'bottom',
                            dataArray: items,
                        },
                    )
                    .resizeBottom(state.height);
                return Object.assign({}, state, { column: mutateInstance(updatedColumn) });
            }
            return state;
        }
        */
        case GRIDSET_SCROLL_DOWN: {
            if (!action.payload) return state;
            const scrollSize = Number.parseInt(action.payload, 10);
            if (Number.isInteger(scrollSize)) {
                return Object.assign({}, state, {
                    column: state.column.scrollDown(scrollSize),
                });
            }
            return state;
        }
        case GRIDSET_SCROLL_UP: {
            if (!action.payload) return state;
            const scrollSize = Number.parseInt(action.payload, 10);
            if (Number.isInteger(scrollSize)) {
                return Object.assign({}, state, {
                    column: state.column.scrollUp(scrollSize),
                });
            }
            return state;
        }
        default: return state;
    }
}
