export const APP_READY = 'APP_READY';
export const SCROLL_DOWN = 'SCROLL_DOWN';
export const SCROLL_UP = 'SCROLL_UP';

export const appReady = () => {
    return {
        type: APP_READY,
    };
}

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
