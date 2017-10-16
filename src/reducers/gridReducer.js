import { GRID_DATA_READY } from '../actions/grid';
import { SCROLL_DOWN, SCROLL_UP } from '../actions/app';
import Column from '../models/Column';
import ColumnSource from '../models/ColumnSource';
import {
    COLUMN_WIDTH,
    GRID_WIDTH,
    GRID_HEIGHT,
    GRID_SCROLL_HEIGHT,
} from '../constants/grid';

function getColumnsNumber(gridWidth, columnWidth) {
    return Math.round(gridWidth / columnWidth);
}

function isMaxHeight(height) {
    return height >= window.innerHeight;
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
            let newState = {};
            if (isMaxHeight(state.height)) {
                const columnsAtBottom = state.columns.reduce((acc, col) => col.isAtBottom() ? ++acc : acc, 0);
                if (columnsAtBottom === state.columns.length) {
                    console.log('col at bottom');
                    newState = {
                        height: state.height - GRID_SCROLL_HEIGHT,
                        columns: state.columns.map(column => column.resizeBottom(true)),
                    }
                } else {
                    newState = {
                        columns: state.columns.map(column => column.moveDown()),
                    };
                }
            } else {
                newState = {
                    height: state.height + GRID_SCROLL_HEIGHT,
                    columns: state.columns.map(column => column.resizeTop()),
                };
            }
            return Object.assign({}, state, newState);
        }
        case SCROLL_UP: {
            let newState = {};
            if (isMaxHeight(state.height)) {
                const columnsAtTop = state.columns.reduce((acc, col) => col.isAtTop() ? ++acc : acc, 0);
                if (columnsAtTop === state.columns.length) {
                    console.log('col at top');
                    newState = {
                        height: state.height - GRID_SCROLL_HEIGHT,
                        columns: state.columns.map(column => column.resizeBottom()),
                    }
                } else {
                    newState = {
                        columns: state.columns.map(column => column.moveUp()),
                    };
                }
            } else {
                newState = {
                    height: state.height - GRID_SCROLL_HEIGHT,
                    columns: state.columns.map(column => column.resizeBottom()),
                };
            }
            return Object.assign({}, state, newState);
        }
        default: return state;
    }
}
