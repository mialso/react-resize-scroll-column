export const SCROLL_DOWN = 'SCROLL_DOWN';
export const SCROLL_UP = 'SCROLL_UP';
export const CONTAINER_READY = 'CONTAINER_READY';
export const CONTAINER_FIX = 'CONTAINER_FIX';
export const CHILD_READY = 'CHILD_READY';
export const REMOVE_CHILD = 'REMOVE_CHILD';

export const scrollDown = () => {
    return {
        type: SCROLL_DOWN,
    }
};

export const scrollUp = () => {
    return {
        type: SCROLL_UP,
    }
};

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
    scrollUp,
    scrollDown,
    containerReady,
    containerFix,
    childReady,
    removeChild,
};
