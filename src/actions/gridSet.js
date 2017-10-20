export const GRIDSET_SCROLL_DOWN = 'GRIDSET_SCROLL_DOWN';
export const GRIDSET_SCROLL_UP = 'GRIDSET_SCROLL_UP';
export const GRIDSET_RESIZE_DOWN = 'GRIDSET_RESIZE_DOWN';
export const GRIDSET_DATA_UPDATE = 'GRIDSET_DATA_UPDATE';

export const gridSetDataUpdate = (data) => {
    return {
        type: GRIDSET_DATA_UPDATE,
        payload: data,
    };
};

export const gridSetResizeDown = (data) => {
    return {
        type: GRIDSET_RESIZE_DOWN,
        payload: data,
    };
};

export const gridSetScrollUp = (data) => {
    return {
        type: GRIDSET_SCROLL_UP,
        payload: data,
    };
};

export const gridSetScrollDown = (data) => {
    return {
        type: GRIDSET_SCROLL_DOWN,
        payload: data,
    };
};
