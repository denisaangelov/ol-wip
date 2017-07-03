import { SELECT_LAYER } from '../actions';

const selectedLayer = (state = null, action) => {
    switch (action.type) {
        case SELECT_LAYER: {
            return action.layer;
        }
        default:
            return state;
    }
};

export default selectedLayer;