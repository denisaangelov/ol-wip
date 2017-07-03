import { combineReducers } from 'redux';
import map from './map';
import selectedLayer from './selected-layer';
import currentUser from './current-user';
import markers from './markers';
import users from './users';

const rootReducer = combineReducers({
    map,
    selectedLayer,
    currentUser,
    markers,
    users
});

export default rootReducer;