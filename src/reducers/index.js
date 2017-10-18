import { combineReducers } from 'redux';
import items from './itemsReducer';
import grid from './grid';

export default combineReducers({
    items,
    grid,
});
