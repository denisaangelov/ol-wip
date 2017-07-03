import { CURRENT_USER, LOGOUT } from '../actions';

const currentUser = (state = { id: 0, name: 'Anonymous', username: 'Anonymous', password: '', email: '' }, action) => {
    switch (action.type) {
        case CURRENT_USER: {
            return action.user;
        }
        case LOGOUT: {
            return Object.assign({}, { id: 0, name: 'Anonymous', username: 'Anonymous', password: '', email: '' }, {});
        }
        default:
            return state;
    }
};

export default currentUser;