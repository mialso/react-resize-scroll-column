import { combineReducers } from 'redux';
import items from './itemsReducer';
import gridSet from './gridSet';

export default combineReducers({
    items,
    gridSet,
});
