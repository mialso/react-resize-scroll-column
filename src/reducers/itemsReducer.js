import { APP_READY } from '../actions/app';

function generateItems(number, date) {
    const dayTime = Number.parseInt(Math.random() * 1000 * 60 * 60 * 24, 10);
    const dayStart = new Date('2017', '10', date).getTime();
    const items = [];
    for (let i = 0; i < number; ++i) {

        const newItem = {
            size: Number.parseInt(Math.random() * 150, 10) + 50,
            date: dayStart + dayTime,
            data: {
                text: i,
            },
        };
        items.push(newItem);
    }

    return items;
}

const initialState = {
    position: 0,
    items: [],
}

export default (state = initialState, action) => {
    switch (action.type) {
        case APP_READY: {
            state.items = generateItems(20, new Date(Date.now()).getDate().toString());
            return Object.assign({}, state);
        }
        default: return state;
    }
}
