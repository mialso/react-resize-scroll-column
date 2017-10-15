import { GRID_DATA_READY } from '../actions/grid';
import { SCROLL_DOWN, SCROLL_UP } from '../actions/app';
import Column from '../models/Column';
import ColumnSource from '../models/ColumnSource';
import {
    COLUMN_WIDTH,
    GRID_WIDTH,
    GRID_HEIGHT,
} from '../constants/grid';

function getColumnsNumber(gridWidth, columnWidth) {
    return Math.round(gridWidth / columnWidth);
}

function calculateColumns() {
    const columnsNumber = getColumnsNumber(GRID_WIDTH, COLUMN_WIDTH);
    const columns = [];
    for (let i = 0; i < columnsNumber; ++i) {
        columns.push({});
    }
    return columns;
}

const initialState = {
    width: GRID_WIDTH,
    height: GRID_HEIGHT,
    columns: calculateColumns(),
};

export default function gridReducer(state = initialState, action) {
    switch (action.type) {
        case GRID_DATA_READY: {
            const topData = [];
            const bottomData = action.payload || [];
            return Object.assign(
                {},
                state,
                {
                    topData,
                    bottomData,
                    columns: state.columns.map(column => new Column(new ColumnSource({ topData, bottomData }))),
                },
            );
        }
        case SCROLL_DOWN: {
            const columns = state.columns.map(column => column.moveDown());
            return Object.assign({}, state, { columns });
        }
        case SCROLL_UP: {
            const columns = state.columns.map(column => column.moveUp());
            return Object.assign({}, state, { columns });
        }
        default: return state;
    }
}
