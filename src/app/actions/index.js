export const GET_USERS = 'GET_USERS';
export const CURRENT_USER = 'CURRENT_USER';
export const LOGOUT = 'LOGOUT';

export const SELECT_LAYER = 'SELECT_LAYER';

export const TOGGLE_VISIBILITY = 'TOGGLE_VISIBILITY';
export const REQUEST_CONTAINERS = 'REQUEST_CONTAINERS';
export const RECEIVE_CONTAINERS = 'RECEIVE_CONTAINERS';

export const MARKERS_INIT = 'MARKERS_INIT';
export const MARKERS_REMOVE_INTERACTION = 'MARKERS_REMOVE_INTERACTION';
export const MARKERS_CLEAR_SOURCE = 'MARKERS_CLEAR_SOURCE';
export const MARKERS_ZOOM_TO_SELECTION = 'MARKERS_ZOOM_TO_SELECTION';
export const MARKERS_OBJECTS = 'MARKERS_OBJECTS';
export const SELECT_MARKER = 'SELECT_MARKER';

/**
 * Select user
 * @param {Object} user 
 */
export const getUsers = (users) => ({
    type: GET_USERS,
    users
});

/**
 * Select user
 * @param {Object} user 
 */
export const currentUser = (user) => ({
    type: CURRENT_USER,
    user
});

/**
 */
export const logout = () => ({
    type: LOGOUT
});


/**
 * Select layer
 * @param {Object} layer 
 */
export const selectLayer = (layer) => ({
    type: SELECT_LAYER,
    layer
});


/**
 * Map
 * @param {String} node
 * @param {String} type =  layer | group | container
 * @param {Boolean} status 
 */
export const toggleVisibility = (container, visibility) => ({
    type: TOGGLE_VISIBILITY,
    container,
    visibility
});

export const requestContainers = (state) => ({
    type: REQUEST_CONTAINERS
});

export const receiveContainers = (json) => ({
    type: RECEIVE_CONTAINERS,
    containers: json.containers
});

/**
 * Markers 
 * 
 */

export const markersInit = (flag) => ({
    type: MARKERS_INIT,
    flag
});

export const markersRemoveInteraction = (flag) => ({
    type: MARKERS_REMOVE_INTERACTION,
    flag
});

export const markersClearSource = (flag) => ({
    type: MARKERS_CLEAR_SOURCE,
    flag
});

export const markersZoomToMarker = (flag, id) => ({
    type: MARKERS_ZOOM_TO_SELECTION,
    flag,
    id
});

export const markersObjects = (markersObjects) => ({
    type: MARKERS_OBJECTS,
    markersObjects
});

export const selectMarker = (selectedMarker) => ({
    type: SELECT_MARKER,
    selectedMarker
});
