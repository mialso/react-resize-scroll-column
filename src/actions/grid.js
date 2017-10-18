export const GRID_DATA_READY = 'GRID_DATA_READY';
export const GRID_UPDATE_HEIGHT = 'GRID_UPDATE_HEIGHT';

export const gridDataReady = (data) => {
    return {
        type: GRID_DATA_READY,
        payload: data,
    };
}

export const gridUpdateHeight = (data) => {
    return {
        type: GRID_UPDATE_HEIGHT,
        payload: data,
    };
}
