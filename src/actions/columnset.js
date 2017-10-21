export const COLUMNSET_SCROLL_DOWN = 'COLUMNSET_SCROLL_DOWN';
export const COLUMNSET_SCROLL_UP = 'COLUMNSET_SCROLL_UP';
export const COLUMNSET_RESIZE_DOWN = 'COLUMNSET_RESIZE_DOWN';
export const COLUMNSET_RESIZE_UP = 'COLUMNSET_RESIZE_UP';
export const COLUMNSET_DATA_UPDATE = 'COLUMNSET_DATA_UPDATE';
export const COLUMNSET_INIT_HEIGHT = 'COLUMNSET_INIT_HEIGHT';

export const columnsetInitHeight = (data) => {
    return {
        type: COLUMNSET_INIT_HEIGHT,
        payload: data,
    };
}

export const columnsetDataUpdate = (data) => {
    return {
        type: COLUMNSET_DATA_UPDATE,
        payload: data,
    };
};

export const columnsetResizeDown = (data) => {
    return {
        type: COLUMNSET_RESIZE_DOWN,
        payload: data,
    };
};

export const columnsetResizeUp = (data) => {
    return {
        type: COLUMNSET_RESIZE_UP,
        payload: data,
    };
};

export const columnsetScrollUp = (data) => {
    return {
        type: COLUMNSET_SCROLL_UP,
        payload: data,
    };
};

export const columnsetScrollDown = (data) => {
    return {
        type: COLUMNSET_SCROLL_DOWN,
        payload: data,
    };
};
