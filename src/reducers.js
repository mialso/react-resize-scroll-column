import { combineReducers } from 'redux';
import items from './itemsReducer';
import grid from './gridReducer';

export default combineReducers({
    items,
    grid,
});
