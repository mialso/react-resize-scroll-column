import { combineReducers } from 'redux';
import items from './itemsReducer';
import columnset from './columnset';

export default combineReducers({
    items,
    columnset,
});
