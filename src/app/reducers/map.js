import _mapManager from "../components/map/MapManager";

import { TOGGLE_VISIBILITY, REQUEST_CONTAINERS, RECEIVE_CONTAINERS } from '../actions';

const layersReducer = (state = {}, action) => {
    switch (action.type) {
        case TOGGLE_VISIBILITY:
            return toggleVisibility(state, action);
        case REQUEST_CONTAINERS:
            return Object.assign({}, state, {});
        case RECEIVE_CONTAINERS:
            return receiveContainers(state, action);
        default:
            return state;
    }
}

const receiveContainers = (state, action) => {
    const containers = action.containers;
    // let groups = [];
    let layers = [];
    containers.forEach((container) => {
        const containerGroups = container.groups;
        // groups = groups.concat(containerGroups);
        layers = layers.concat(container.layers);

        containerGroups.forEach((group) => {
            layers = layers.concat(group.layers);
        });
    });

    return Object.assign({}, state, {
        containers: containers.sort(compare),
        // groups: groups.sort(compare),
        layers: layers.sort(compare)
    });
}

const compare = (a, b) => {
    return parseInt(b.z_order) - parseInt(a.z_order);
}

const toggleVisibility = (state, action) => {
    let container = action.container;
    let visibility = action.visibility;

    state.containers.forEach((c, idx) => {
        if (c.name != 'Other') {
            if (container.id == c.id) {
                c.is_visible = "true";
                Object.assign({}, state.containers[idx], c); // new containers
                _mapManager.setVisible(c.id, true);
            } else {
                c.is_visible = "false";
                Object.assign({}, state.containers[idx], c); // new containers
                _mapManager.setVisible(c.id, false);
            }
        } else {
            c.layers.forEach((l) => {
                if (l.id == container.id) {
                    l.is_visible = "true";
                    _mapManager.setVisible(l.id, true);
                } else {
                    l.is_visible = "false";
                    _mapManager.setVisible(l.id, false);
                }
            });
        }
    });

    return Object.assign({}, state, {});
}
const handleVisibility = (state, action, container) => {
    let cont = action.cont;
    let visibility = action.visibility;

    state.containers.forEach((container, cIdx) => {

    });

}
const handleLayerVisibility = (state, action) => {
    let layer = action.layer;
    let visibility = action.visibility;

    state.containers.some((container, cIdx) => {
        let isFound = false;

        container.layers.some((containerLayer, lIdx) => {
            if (containerLayer.id == layer.id) {
                layer.is_visible = visibility.toString();
                Object.assign({}, state.containers[cIdx].layers[lIdx], layer); // new containers

                _mapManager.setVisible(layer.id, visibility == 'true');
                isFound = true;
                return true;
            }
        });
        if (isFound)
            return true;

        container.groups.some((group, gIdx) => {
            group.layers.some((containerLayer, lIdx) => {
                if (containerLayer.id == layer.id) {
                    layer.is_visible = visibility.toString();
                    Object.assign({}, state.containers[cIdx].groups[gIdx].layers[lIdx], layer); // new containers

                    _mapManager.setVisible(layer.id, visibility == 'true');
                    isFound = true;
                    return true;
                }
            });
        });
        if (isFound)
            return true;
    });

    return Object.assign({}, state, {});
}

export default layersReducer;