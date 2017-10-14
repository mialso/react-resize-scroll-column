import { GRID_DATA_READY } from '../actions/grid';
import { SCROLL_DOWN, SCROLL_UP } from '../actions/app';
import Column from '../models/Column';
import {
    COLUMN_WIDTH,
    COLUMN_PAD,
    GRID_WIDTH,
    GRID_HEIGHT,
} from '../constants/grid';

function getColumnSource(queue) {
    return function* () {
        let index = 0;
        let goRight = true;

        while (queue[index]) {
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
}

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
            return Object.assign({}, state, { columns: state.columns.map(column => new Column(getColumnSource(action.payload)())) });
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
