export const GRID_DATA_READY = 'GRID_DATA_READY';
export const GRID_UPDATE_HEIGHT = 'GRID_UPDATE_HEIGHT';
export const GRID_RESIZE_DOWN = 'GRID_RESIZE_DOWN';
export const GRID_SCROLL_DOWN = 'GRID_SCROLL_DOWN';
export const GRID_SCROLL_UP = 'GRID_SCROLL_UP';

export const gridDataReady = (data) => {
    return {
        type: GRID_DATA_READY,
        payload: data,
    };
}

export const gridResizeDown = (data) => {
    return {
        type: GRID_RESIZE_DOWN,
        payload: data,
    };
}

export const gridScrollUp = (data) => {
    return {
        type: GRID_SCROLL_UP,
        payload: data,
    };
}

export const gridScrollDown = (data) => {
    return {
        type: GRID_SCROLL_DOWN,
        payload: data,
    };
}
