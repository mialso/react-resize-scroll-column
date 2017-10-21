export const COLUMNSET_SCROLL_DOWN = 'COLUMNSET_SCROLL_DOWN';
export const COLUMNSET_SCROLL_UP = 'COLUMNSET_SCROLL_UP';
export const COLUMNSET_RESIZE_DOWN = 'COLUMNSET_RESIZE_DOWN';
export const COLUMNSET_RESIZE_UP = 'COLUMNSET_RESIZE_UP';
export const COLUMNSET_DATA_UPDATE = 'COLUMNSET_DATA_UPDATE';
export const COLUMNSET_INIT_HEIGHT = 'COLUMNSET_INIT_HEIGHT';

export const columnsetInitHeight = (data, meta) => {
    return {
        type: COLUMNSET_INIT_HEIGHT,
        payload: data,
        meta,
    };
}

export const columnsetDataUpdate = (data, meta) => {
    return {
        type: COLUMNSET_DATA_UPDATE,
        payload: data,
        meta,
    };
};

export const columnsetResizeDown = (data, meta) => {
    return {
        type: COLUMNSET_RESIZE_DOWN,
        payload: data,
        meta,
    };
};

export const columnsetResizeUp = (data, meta) => {
    return {
        type: COLUMNSET_RESIZE_UP,
        payload: data,
        meta,
    };
};

export const columnsetScrollUp = (data, meta) => {
    return {
        type: COLUMNSET_SCROLL_UP,
        payload: data,
        meta,
    };
};

export const columnsetScrollDown = (data, meta) => {
    return {
        type: COLUMNSET_SCROLL_DOWN,
        payload: data,
        meta,
    };
};
