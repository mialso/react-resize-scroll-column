import { APP_READY } from '../actions/app';

const divider = {
    size: 20,
    renderClass: 'divider',
};

function generateItems(number, date, sizeMin, sizeDiff) {
    const dayTime = Number.parseInt(Math.random() * 1000 * 60 * 60 * 24, 10);
    const dayStart = new Date('2017', '10', date).getTime();
    const items = [];
    for (let i = 0; i < number; ++i) {
        const newItem = {
            size: Number.parseInt(Math.random() * sizeDiff, 10) + sizeMin,
            date: dayStart + dayTime,
            data: {},
            renderClass: 'item',
            type: 'item',
        };
        items.push(newItem);
    }
    items.forEach((item, index) => item.index = index);
    return items;
}

const initialState = {
    position: 0,
    items: [],
}

export default (state = initialState, action) => {
    switch (action.type) {
        case APP_READY: {
            state.items = generateItems(30, new Date(Date.now()).getDate().toString(), 50, 150);
            state.largeItems = generateItems(5, new Date(Date.now()).getDate().toString(), 500, 1000);
            return Object.assign({}, state);
        }
        default: return state;
    }
}
