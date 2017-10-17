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

function isMinHeight(state) {
    return state.height < state.minHeight;
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
    minHeight: GRID_HEIGHT,
    columnHeight: GRID_HEIGHT,
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
                console.log('DOWN: maxHeight');
                const columnsAtBottom = state.columns.reduce((acc, col) => col.isAtBottom() ? ++acc : acc, 0);
                if (columnsAtBottom === state.columns.length) {
                    console.log('DOWN: col at bottom');
                    newState = {
                        columnHeight: state.columnHeight - GRID_SCROLL_HEIGHT,
                        columns: state.columns.map(column => column.resizeBottom(true)),
                    }
                } else {
                    console.log('DOWN: col not at bottom');
                    newState = {
                        //columnHeight: state.columnHeight + GRID_SCROLL_HEIGHT,
                        columns: state.columns.map(column => column.moveDown()),
                    };
                }
            } else {
                console.log('DOWN: not maxHeight');
                newState = {
                    height: state.height + GRID_SCROLL_HEIGHT,
                    columnHeight: state.height + GRID_SCROLL_HEIGHT,
                    columns: state.columns.map(column => column.resizeTop()),
                };
            }

            return Object.assign({}, state, newState);
        }
        case SCROLL_UP: {
            let newState = {};
            if (isMaxHeight(state.height)) {
                console.log('UP: maxHeight');
                const columnsAtTop = state.columns.reduce((acc, col) => col.isAtTop() ? ++acc : acc, 0);
                if (columnsAtTop === state.columns.length) {
                    console.log('UP: col at top');
                    newState = {
                        height: state.height - GRID_SCROLL_HEIGHT,
                        columnHeight: state.columnHeight - GRID_SCROLL_HEIGHT,
                        columns: state.columns.map(column => column.resizeBottom()),
                    }
                } else {
                    if (state.columnHeight < state.height) {
                        console.log('UP: col not at top: column less grid');
                        newState = {
                            columnHeight: state.columnHeight + GRID_SCROLL_HEIGHT,
                            columns: state.columns.map(column => column.resizeBottom(true, true)),
                        };
                    } else {
                        console.log('UP: col not at top: column eq grid');
                        newState = {
                            columns: state.columns.map(column => column.moveUp()),
                        };
                    }
                }
            } else if (isMinHeight(state)) {
                console.log('UP: minHeight');
                newState = {
                    columns: state.columns.map(column => column.moveUp()),
                };
            } else {
                console.log('UP: else');
                newState = {
                    height: state.height - GRID_SCROLL_HEIGHT,
                    columnHeight: state.columnHeight - GRID_SCROLL_HEIGHT,
                    columns: state.columns.map(column => column.resizeBottom()),
                };
            }
            return Object.assign({}, state, newState);
        }
        default: return state;
    }
}
