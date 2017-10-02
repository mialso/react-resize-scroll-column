import {
    SCROLL_UP,
    SCROLL_DOWN,
    CONTAINER_READY,
    CONTAINER_FIX,
    REMOVE_CHILD,
    CHILD_READY,
} from './actions';

const initialState = {
    position: 0,
    containers: [],
    active: 0,
    data: [
        generateDataArray(5),
        generateDataArray(9),
        generateDataArray(15),
    ],
    dataToDisplay: [
        generateDataArray(5),
        generateDataArray(9),
        generateDataArray(15),
    ],
}

function generateDataArray(number) {
    const array = []; 
    for (let i = 0; i < number; ++i) {
                array.push({ id: i, data: `${number}-${i}` }); 
            }   
    return array;
}

export default (state = initialState, action) => {
    switch (action.type) {
        case SCROLL_DOWN: {
            state.position += 15;
            const activeElem = state.containers[state.active]
            activeElem.position += 15;
            /*
            if (activeElem.minHeight >= (activeElem.height - activeElem.position)) {
                if (state.active < state.containers.length - 1) {
                    state.active += 1;
                }
            }
            */
            return Object.assign({}, state);
        }
        case SCROLL_UP: {
            if (state.position === 0) return state;
            state.position -= 15;
            const activeElem = state.containers[state.active]
            activeElem.position -= 15;
            if (activeElem.position <= 0) {
                // check if there are items to display available
                const itemId = state.dataToDisplay[state.active][0].id;
                if (itemId > 0) {
                    // push new items to display
                    const itemToDisplay = state.data[state.active].find(item => item.id === itemId - 1);
                    state.dataToDisplay[state.active] = [ itemToDisplay ].concat(state.dataToDisplay[state.active]);
                } else {
                    // no items to display, show previous container
                    if (state.active) {
                        state.active -= 1;
                        state.dataToDisplay[state.active].push(state.data[state.active].slice(-1)[0]);
                        state.containers[state.active].position = - activeElem.position;
                    }
                }
            }
            return Object.assign({}, state);
        }
        case CONTAINER_READY: {
            const { pos, minHeight = 0, height } = action.payload;
            if (!state.containers[pos]) {
                state.containers[pos] = { minHeight, height, position: height };
            } else {
                state.containers[pos].minHeight = minHeight;
                state.containers[pos].height = height;
                state.containers[pos].position = 0;
            }
            return Object.assign({}, state);
        }
        case CONTAINER_FIX: {
            state.containers[state.active].position = 0;
            state.active += 1;
            return Object.assign({}, state);
        }
        case REMOVE_CHILD: {
            const { cont, height } = action.payload;
            state.dataToDisplay[cont] = state.dataToDisplay[cont].slice(1);
            state.containers[cont].position -= height;
            return Object.assign({}, state);
        }
        case CHILD_READY: {
            const { cont, height } = action.payload;
            const container = state.containers[cont] || {position: 0};
            container.position += height;
            state.containers[cont] = container;
            return Object.assign({}, state);
        }
        default:
            return state;
    }
}
