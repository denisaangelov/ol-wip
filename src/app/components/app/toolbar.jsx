import React from 'react';
import { connect } from 'react-redux';

import { ButtonToolbar, ButtonGroup, Button, OverlayTrigger, Tooltip, Glyphicon } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import axios from "axios";

import _mapManager from '../map/MapManager';
import _measureLayer from "../map/MeasureLayer";
import _geolocation from "../map/Geolocation";
import _route from "../map/Route";

import {
    markersInit, markersClearSource, markersObjects, markersRemoveInteraction, markersZoomToMarker
} from '../../actions';

const style = {
    div: {
        zIndex: 100,
        position: 'relative'
    },
    containerFluid: {
        height: '30px',
        backgroundColor: 'rgb(39, 91, 157)',
    },
    span: {
        color: '#ffffff',
        lineHeight: '30px'
    },
    navbar: {
        backgroundColor: 'transparent', // rgb(90, 152, 229)
        borderRadius: '0',
        // padding: '8px 0',
        margin: '0',
        border: '0',
        lineHeight: '50px'
        // lineHeight: '66px'
    },
    img: {
        marginRight: '4px'
    },
    a: {
        color: '#ffffff',
        textDecoration: 'none',
        fontSize: '16px'
    },
    toggle: {
        //marginTop: '16px'
        backgroundColor: 'transparent' // rgb(90, 152, 229)
    },
    buttonToolbar: {
        padding: '8px 0',
        display: 'inline-block',
        position: 'absolute',
        left: 'calc(50% - 158px)',
        zIndex: 1000
    }
}

const mapStateToProps = (state) => ({
    map: state.map,
    selectedLayer: state.selectedLayer,
    currentUser: state.currentUser
});

const mapDispatchToProps = (dispatch) => ({
    markers: {
        init: (flag) => {
            dispatch(markersInit(flag));
        },
        removeInteraction: (flag) => {
            dispatch(markersRemoveInteraction(flag));
        },
        clearSource: (flag) => {
            dispatch(markersClearSource(flag));
        },
        zoomToSelection: (flag) => {
            dispatch(markersZoomToSelection(flag));
        }
    }
});

@connect(
    mapStateToProps,
    mapDispatchToProps
)
export default class TLToolbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeButton: '',
            modalShow: false,
            html: ''
        };
    }

    _handleZoomToAll = (e) => {
        _mapManager.zoomToAll();
    }

    _handleMarker = (e, type) => {
        const isActive = (this.state.activeButton === type);
        this._handleButtonActive(e, !isActive, type);
        if (isActive) {
            this.props.markers.removeInteraction(true);
        } else {
            _measureLayer.removeInteraction();
            this.props.markers.init(true);
        }
    }

    _handleLocation = (e, type) => {
        _geolocation.init();
    }

    _handleClearLocation = (e, type) => {
        _geolocation.remove();
        this.props.markers.removeInteraction(true);
    }

    _handleMeasureLayer = (e, type) => {
        const isActive = (this.state.activeButton === type);
        this._handleButtonActive(e, !isActive, type);
        if (isActive) {
            _measureLayer.removeInteraction();
        } else {
            this.props.markers.removeInteraction(true);
            _measureLayer.init(type);
        }
    }

    _handleClearMeasure = (e, type) => {
        _measureLayer.clearSource();
    }

    _handleButtonActive = (e, flag, type) => {
        (flag) ? this.setState({ activeButton: type }) : this.setState({ activeButton: '' });
    }
    _handleButtonBlur = (e, flag) => {
        (flag) ? e.currentTarget.blur() : '';
    }
    _handleSimulation = (e, flag) => {
        _route.init();
    }

    render() {
        return (
            <div style={style.div} id='tl-header'>
                <ButtonToolbar style={style.buttonToolbar}>
                    <ButtonGroup>
                        <OverlayTrigger placement='bottom' overlay={<Tooltip id='tooltipMapInit'>Начална позиция</Tooltip>}>
                            <Button onClick={(e) => { this._handleZoomToAll(e); this._handleButtonBlur(e, true); }} onMouseUp={(e) => { this._handleButtonBlur(e, true); }}>
                                <FontAwesome name='globe' size='lg' />
                            </Button>
                        </OverlayTrigger>
                    </ButtonGroup>

                    <ButtonGroup>
                        {this.props.currentUser.id > 0 ?
                            <OverlayTrigger placement='bottom' overlay={<Tooltip id='tooltipMarkers'>Маркер</Tooltip>}>
                                <Button onClick={(e) => { this._handleMarker(e, 'Marker'); this._handleButtonBlur(e, true); }} active={this.state.activeButton === 'Marker'}>
                                    <Glyphicon glyph='pushpin' bsSize='large' />
                                </Button>
                            </OverlayTrigger>
                            : null
                        }
                        <OverlayTrigger placement='bottom' overlay={<Tooltip id='tooltipMarkers'>Симулация</Tooltip>}>
                            <Button onClick={(e) => { this._handleSimulation(e, 'simulation'); this._handleButtonBlur(e, true); }} active={this.state.activeButton === 'Simulation'}>
                                <FontAwesome name='location-arrow' size='lg' />
                            </Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement='bottom' overlay={<Tooltip id='tooltipMarkers'>Местоположение</Tooltip>}>
                            <Button onClick={(e) => { this._handleLocation(e, 'Location'); this._handleButtonBlur(e, true); }}>
                                <FontAwesome name='map-marker' size='lg' />
                            </Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement='bottom' overlay={<Tooltip id='tooltipClear'>Изчистване</Tooltip>}>
                            <Button onClick={(e) => { this._handleClearLocation(e); this._handleButtonBlur(e, true); }}>
                                <FontAwesome name='eraser' size='lg' />
                            </Button>
                        </OverlayTrigger>
                    </ButtonGroup>

                    <ButtonGroup>
                        <OverlayTrigger placement='bottom' overlay={<Tooltip id='tooltipMeasureLine'>Измерване на разстояние</Tooltip>}>
                            <Button onClick={(e) => { this._handleMeasureLayer(e, 'LineString'); this._handleButtonBlur(e, true); }} active={this.state.activeButton === 'LineString'}>
                                <FontAwesome name='arrows-h' size='lg' />
                            </Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement='bottom' overlay={<Tooltip id='tooltipMeasurePolygon'>Измерване на площ</Tooltip>}>
                            <Button onClick={(e) => { this._handleMeasureLayer(e, 'Polygon'); this._handleButtonBlur(e, true); }} active={this.state.activeButton === 'Polygon'}>
                                <FontAwesome name='object-group' size='lg' />
                            </Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement='bottom' overlay={<Tooltip id='tooltipClearMeasure'>Изчистване на Измерване</Tooltip>}>
                            <Button onClick={(e) => { this._handleClearMeasure(e); this._handleButtonBlur(e, true); }}>
                                <FontAwesome name='eraser' size='lg' />
                            </Button>
                        </OverlayTrigger>
                    </ButtonGroup>

                    {/*<ButtonGroup>
                        <OverlayTrigger placement='bottom' overlay={<Tooltip id='tooltipEditBasinDirectorate'>EditBasinDirectorate</Tooltip>}>
                            <Button onClick={(e) => { this.handleEditBasinDirectorate(e, 'static') }} style={style.button}>
                                <FontAwesome name='hand-o-up' size='lg' />
                            </Button>
                        </OverlayTrigger>
                    </ButtonGroup>*/}
                </ButtonToolbar>
            </div>
        )
    }
}