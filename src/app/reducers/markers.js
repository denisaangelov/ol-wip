import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import { MARKERS_INIT, MARKERS_REMOVE_INTERACTION, MARKERS_CLEAR_SOURCE, MARKERS_ZOOM_TO_SELECTION, MARKERS_OBJECTS, SELECT_MARKER } from '../actions';

import markers from "../components/map/Markers";

import { Accordion, Panel } from 'react-bootstrap';

export const markersReducer = (state = { markersObjects: [] }, action) => {
    switch (action.type) {
        case MARKERS_INIT:
            return Object.assign({}, state, { init: action.flag });
        case MARKERS_REMOVE_INTERACTION:
            return Object.assign({}, state, { removeInteraction: action.flag });
        case MARKERS_CLEAR_SOURCE:
            return Object.assign({}, state, { clearSource: action.flag, markersObjects: [] });
        case MARKERS_ZOOM_TO_SELECTION:
            return Object.assign({}, state, { zoomToSelection: action.flag });
        case MARKERS_OBJECTS:
            return Object.assign({}, state, { markersObjects: action.markersObjects });
        case SELECT_MARKER:
            return Object.assign({}, state, { selectedObject: action.selectedObject });
        default: {
            return state
        }
        // return state;
    }
}

export default markersReducer;