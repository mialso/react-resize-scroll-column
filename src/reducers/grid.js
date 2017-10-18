import {
    GRID_SCROLL_DOWN,
    GRID_SCROLL_UP,
    GRID_DATA_READY,
    GRID_RESIZE_DOWN,
} from '../actions/grid';
import { TopSource, BottomSource } from '../models/Source';
import GridSet from '../models/GridSet';
import Column from '../models/Column';
import {
    COLUMN_WIDTH,
    GRID_WIDTH,
    GRID_HEIGHT,
    GRID_SCROLL_HEIGHT,
} from '../constants/grid';

const SCROLL_SPEED = 15;

function mutateInstance(obj) {
    return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
}

const initialState = { 
    height: 0,
    column: new Column({ topDataArray: [], bottomDataArray: [] }),
}

export default function gridReducer(state = initialState, action) {
    if (!action) return state;
    switch (action.type) {
        case GRID_RESIZE_DOWN: {
            if (!action.payload) return state;
            const newHeight = Number.parseInt(action.payload.height, 10);
            console.log('GRID_RESIZE_DOWN: newHeight: %s', newHeight);
            if (Number.isInteger(newHeight)) {
                if (state.height) {
                    return Object.assign({}, state, {
                        height: newHeight,
                        column: state.column.resizeBottom(newHeight),
                    });
                }
                // no height was available, just init
                // TODO sync height and data updates
                return Object.assign({}, state, { height: newHeight });
            }
            return state;
        }
        case GRID_DATA_READY: {
            if (!action.payload) return state;
            const { items } = action.payload;
            if (Array.isArray(items) && items.length > 0) {
                const updatedColumn = state.column
                    .addToSource(
                        {
                            type: 'bottom',
                            dataArray: items,
                            /*
                            dataArray: [
                                // TODO create item from data
                                { size: state.height, data: items }
                            ],
                            */
                        },
                    )
                    .resizeBottom(state.height);
                return Object.assign({}, state, { column: mutateInstance(updatedColumn) });
            }
            return state;
        }
        case GRID_SCROLL_DOWN: {
            if (!action.payload) return state;
            const scrollSize = Number.parseInt(action.payload, 10);
            if (Number.isInteger(scrollSize)) {
                return Object.assign({}, state, {
                    column: state.column.scrollDown(scrollSize),
                });
            }
            return state;
        }
        case GRID_SCROLL_UP: {
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
