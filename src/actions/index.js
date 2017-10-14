export const CONTAINER_READY = 'CONTAINER_READY';
export const CONTAINER_FIX = 'CONTAINER_FIX';
export const CHILD_READY = 'CHILD_READY';
export const REMOVE_CHILD = 'REMOVE_CHILD';

export const containerReady = (pos, minHeight, height) => {
    return {
        type: CONTAINER_READY,
        payload: { pos, minHeight, height },
    };
}

export const containerFix = (pos) => {
    return {
        type: CONTAINER_FIX,
        payload: { pos },
    };
}

export const childReady = (cont, pos, height) => {
    return {
        type: CHILD_READY,
        payload: { cont, pos, height },
    };
};

export const removeChild = (cont, pos, height) => {
    return {
        type: REMOVE_CHILD,
        payload: { cont, pos, height },
    };
};

export default {
    containerReady,
    containerFix,
    childReady,
    removeChild,
};
