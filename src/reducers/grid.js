import { GRID_DATA_READY, GRID_UPDATE_HEIGHT } from '../actions/grid';
import { SCROLL_DOWN, SCROLL_UP } from '../actions/app';
import { TopSource, BottomSource } from '../models/Source';
import GridSet from '../models/GridSet';
import Column from '../models/Column';
import {
    COLUMN_WIDTH,
    GRID_WIDTH,
    GRID_HEIGHT,
    GRID_SCROLL_HEIGHT,
} from '../constants/grid';

function mutateInstance(obj) {
    const proto = obj.__proto__;
    return Object.assign(Object.create(proto), obj);
}

const initialState = { 
    height: 0,
    column: new Column({ topDataArray: [], bottomDataArray: [] }),
}

export default function gridReducer(state = initialState, action) {
    if (!action) return state;
    switch (action.type) {
        case GRID_UPDATE_HEIGHT: {
            if (!action.payload) return state;
            const height = Number.parseInt(action.payload.height, 10);
            if (Number.isInteger(height)) {
                return Object.assign({}, state, { height });
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
                            dataArray: [
                                // TODO create item from data
                                { size: state.height, data: items }
                            ],
                        },
                    )
                    .resizeBottom(state.height);
                return Object.assign({}, state, { column: mutateInstance(updatedColumn) });
            }
            return state;
        }
        case SCROLL_DOWN: {
            return state;
        }
        case SCROLL_UP: {
            return state;
        }
        default: return state;
    }
}
