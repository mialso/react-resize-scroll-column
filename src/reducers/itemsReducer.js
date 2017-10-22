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

function generateCarItems(number) {
    const items = [];
    for (let i = 0; i < number; ++i) {
        const newItem = {
            photoHeight: Number.parseInt(Math.random() * 150, 10) + 50,
            year: Number.parseInt(Math.random() * 67, 10) + 1950,
            horsePower: Number.parseInt(Math.random() * 200, 10) + 80,
            id: i,
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
            state.items = generateItems(30, new Date(Date.now()).getDate().toString(), 50, 150);
            state.large = generateItems(5, new Date(Date.now()).getDate().toString(), 500, 1000);
            state.items.byDate = [
                generateItems(20, '10', 50, 150),
                generateItems(5, '11', 50, 200),
                generateItems(10, '12', 50, 170),
                generateItems(3, '13', 50, 200),
                generateItems(15, '14', 50, 200),
            ];
            state.cars = generateCarItems(100);
            state.yearCars = {
                '50s': state.cars.filter(car => car.year >= 1950 && car.year < 1960),
                '60s': state.cars.filter(car => car.year >= 1960 && car.year < 1970),
                '70s': state.cars.filter(car => car.year >= 1970 && car.year < 1980),
                '80s': state.cars.filter(car => car.year >= 1980 && car.year < 1990),
                '90s': state.cars.filter(car => car.year >= 1990 && car.year < 2000),
                '2000s': state.cars.filter(car => car.year >= 2000 && car.year < 2010),
                '2010s': state.cars.filter(car => car.year >= 2010 && car.year < 2020),
            };

            return Object.assign({}, state);
        }
        default: return state;
    }
}
