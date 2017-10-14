export const GRID_DATA_READY = 'GRID_DATA_READY';

export const gridDataReady = (data) => {
    return {
        type: GRID_DATA_READY,
        payload: data,
    };
}
