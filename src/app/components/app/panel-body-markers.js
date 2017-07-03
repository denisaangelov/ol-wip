import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import dateFormat from 'dateformat';

import { Form, Tooltip, OverlayTrigger, Accordion, Panel, ListGroup, ListGroupItem, Badge, Button, ButtonToolbar, Modal, Table, Image, FormGroup } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import ol from 'openlayers';
import _mapManager from '../map/MapManager';
import _mapDefinition from '../map/MapDefinition';
import _mapProjection from '../map/MapProjection';

import { markersInit, markersRemoveInteraction, markersClearSource, markersZoomToSelection, markersObjects, selectObject } from '../../actions';
import shallowEquals from '../../common/utils/shallow-equals';

import TLPanelListItem from './panel-list-item-markers';
import TLPanelItem from './panel-item';
import TLPanelBadge from './panel-badge';
import FieldGroup from '../common/field-group';

const styles = {
    div: {
        padding: '4px'
    },
    listGroup: {
        marginBottom: 0
    },
    listDiv: {
        width: '100%',
        minHeight: '20px',
        cursor: 'pointer'
    }
};

const mapStateToProps = (state) => ({
    currentUser: state.currentUser,
    map: state.map,
    markers: state.markers,
    users: state.users
});

const mapDispatchToProps = (dispatch) => ({
    markersInit: (flag) => {
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
    },
    markersObjects: (user) => {
        return axios.get('/api/markers', user.id ? { params: { userId: user.id } } : {})
            .then((response) => {
                dispatch(markersObjects(response.data));
            });
    },
    selectObject: (selectedMarker) => {
        dispatch(selectObject(selectedMarker));
    },
    deleteMarker: (markerId, userId) => {
        axios.delete('/api/markers/' + markerId)
            .then((r) => {
                axios.get('/api/markers', userId ? { params: { userId: userId } } : {})
                    .then((response) => {
                        dispatch(markersObjects(response.data));
                    });
            });
    },
    postMarker: (marker, userId) => {
        axios.post('/api/markers/', marker)
            .then((r) => {
                axios.get('/api/markers', userId ? { params: { userId: userId } } : {})
                    .then((response) => {
                        dispatch(markersObjects(response.data));
                    });
            })
            .catch((error) => {
                console.log(error.response.data);
            });
    },
    putMarker: (marker, userId) => {
        axios.put('/api/markers/' + marker.id, marker)
            .then((r) => {
                axios.get('/api/markers', userId ? { params: { userId: userId } } : {})
                    .then((response) => {
                        dispatch(markersObjects(response.data));
                    });
            })
            .catch((error) => {
                console.log(error.response.data);
            });
    }
});

@connect(
    mapStateToProps,
    mapDispatchToProps
)
export default class TLPanelBody extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            layers: [],
            markersObjects: [],
            selectedMarker: null,
            users: [],
            currentUser: null,
            // doScroll: false,
            // defaultExpanded: '',
            modalShow: false,
            // modalBody: {},
            marker: {
                id: 0,
                text: '',
                title: '',
                coordinates: '',
                date: Date.now(),
                image: ''
            },
            requestType: 'post'
        }
        this._map = _mapManager.getMap();
        this._projection = _mapManager.getProjection();
        this._isMapSet = true;

        this._features = new ol.Collection();
        this._source = new ol.source.Vector({
            features: this._features
        });
        this._markersLayer = new ol.layer.Vector({
            source: this._source,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgba(255, 0, 0, 0.5)',
                    lineDash: [10, 10],
                    width: 2
                }),
                image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
                    anchor: [0.3, 0.7],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'fraction',
                    // opacity: 0.95,
                    src: 'src/app/assets/img/pin.png'
                }))
            })
        });

        this._draw = null;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.map.layers && !shallowEquals(nextProps.map.layers, this.state.layers)) {
            this.setState({
                layers: nextProps.map.layers
            });
        }
        if (!shallowEquals(nextProps.markers.markersObjects, this.state.markersObjects)) {
            this.setState({
                markersObjects: nextProps.markers.markersObjects
            });

            if (!this._map) {
                this._map = _mapManager.getMap();
                this._markersLayer.setMap(this._map);
                this.addOverlays(nextProps.markers.markersObjects);
            } else {
                // this._source.clear();
                this._markersLayer.setMap(this._map);
                this.addOverlays(nextProps.markers.markersObjects);
            }
        }
        if (!shallowEquals(nextProps.users, this.state.users)) {
            this.setState({
                users: nextProps.users
            });
        }
        if (!shallowEquals(nextProps.currentUser, this.state.currentUser)) {
            this.setState({
                currentUser: nextProps.currentUser
            });
            this.props.markersObjects(nextProps.currentUser);
        }
        if (nextProps.markers.init) {
            this.init();
            this.props.markersInit(false);
        }
        if (nextProps.markers.removeInteraction) {
            this.removeInteraction();
            this.props.removeInteraction(false);
        }
        if (nextProps.markers.clearSource) {
            this.clearSource();
            this.props.clearSource(false);
        }
        if (nextProps.markers.zoomToSelection) {
            this.zoomToSelection();
            this.props.zoomToSelection(false);
        }
    }

    componentDidUpdate() {
        this._map = _mapManager.getMap();
    }

    render() {
        return (
            <div style={styles.div}>
                <Accordion>
                    {this.createAccordion(this.state.markersObjects)}
                </Accordion>
                <Modal
                    autoFocus
                    aria-labelledby='contained-modal-title-lg'
                    backdrop='static'
                    bsSize='lg'
                    enforceFocus
                    keyboard
                    show={this.state.modalShow}
                    onHide={(e) => { this._handleModalExit(e); }}
                >
                    <Modal.Header closeButton closeLabel='Затвори' onHide={(e) => { this._handleCancel(e); }}>
                        <Modal.Title id='contained-modal-title-lg'>Въвеждане на нов маркер</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <FieldGroup id='formTitle' label='Title' type='text' placeholder="Enter title" value={this.state.marker.title} onChange={(e) => this._handleOnChange(e, 'title')} />
                            <FieldGroup id='formText' label='Text' type='text' placeholder="Enter text" componentClass="textarea" value={this.state.marker.text} onChange={(e) => this._handleOnChange(e, 'text')} />
                            <FieldGroup id='formFile' label='File' type='file' placeholder="Choose file" onChange={(e) => this._handleImageOnChange(e, 'image')} />
                            <FormGroup controlId='formImage'>
                                <Image id='formImage' src={this.state.marker.image} />
                            </FormGroup>
                            <ButtonToolbar>
                                <Button type="submit" bsStyle="success" onClick={(e) => this._handleOnSubmit(e)}>
                                    Submit
                                </Button>
                                <Button type="reset" bsStyle="warning" onClick={(e) => this._handleCancel(e)}>
                                    Reset
                                </Button>
                                {(this.state.currentUser && this.state.currentUser.id)
                                    ?
                                    <Button type="reset" bsStyle="danger" onClick={(e) => this._handleDelete(e)}>
                                        Delete
                                    </Button>
                                    : null
                                }
                            </ButtonToolbar>

                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }

    _handleOnChange = (e, field) => {
        this.setState({
            marker: Object.assign({}, this.state.marker, {
                [field]: e.target.value
            })
        })
    }

    _handleImageOnChange = (e, field) => {
        var preview = document.getElementById('formImage');
        var file = document.getElementById('formFile').files[0];
        var reader = new FileReader();

        if (file) {
            reader.readAsDataURL(file);
        }

        reader.addEventListener("load", () => {
            // console.log(reader.result);
            preview.src = reader.result;
            this.setState({
                marker: Object.assign({}, this.state.marker, {
                    image: reader.result
                })
            });
        }, false);

    }
    _handleOnSubmit = (e) => {
        e.preventDefault();
        let marker = {
            id: this.state.marker.id,
            user_id: this.state.currentUser.id,
            title: this.state.marker.title,
            text: this.state.marker.text,
            coordinates: this.state.marker.coordinates,
            date: Date.now(),
            image: this.state.marker.image
        }

        if (this.state.requestType === 'post')
            this.props.postMarker(marker, this.state.currentUser.id);
        else if (this.state.requestType === 'put')
            this.props.putMarker(marker, this.state.currentUser.id);

        this._handleCancel(e);

    }
    _handleZoomToMarker = (e, coordinates) => {
        e.preventDefault();
        e.stopPropagation();
        let coords = coordinates.split(',');
        let positionUTM35 = _mapProjection.convertWGS84ToUTM35([coords[1], coords[0]]);

        let extent = [positionUTM35[0] - 10, positionUTM35[1] - 10, positionUTM35[0] + 10, positionUTM35[1] + 10];
        this._map.getView().fit(
            extent,
            {
                duration: 1000
            }
        );

    }

    _handleEditMarker = (e, marker) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(marker);
        this.setState({
            modalShow: true,
            requestType: 'put',
            marker: Object.assign({}, this.state.marker, marker)
        });
    }
    _handleCancel = (e) => {
        e.preventDefault();
        this._source.clear();
        // this._draw.getFeatures().clear();
        this.setState({
            marker: Object.assign({}, this.state.marker, {
                title: '',
                text: '',
                coordinates: '',
                date: Date.now(),
                image: ''
            }),
            modalShow: false
        });
    }
    _handleDelete = (e) => {
        e.preventDefault();

        console.log(this.state.marker.id);

        this.props.deleteMarker(this.state.marker.id, this.state.currentUser.id);

        this.setState({
            marker: Object.assign({}, this.state.marker, {
                title: '',
                text: '',
                coordinates: '',
                date: Date.now(),
                image: ''
            }),
            modalShow: false
        });
    }

    addOverlays = (objects) => {
        if (!objects.length)
            return null;
        else {
            if (this._map) {
                this._map.getOverlays().forEach((overlay) => {
                    this._map.removeOverlay(overlay);
                });

                objects.forEach((object, idx) => {
                    const coordinates = object.coordinates.split(',');

                    let positionUTM35 = _mapProjection.convertWGS84ToUTM35([coordinates[1], coordinates[0]]);
                    let id = 'markers-img' + idx;

                    if (this._map.getOverlayById(id)) {
                        this._map.removeOverlay(this._map.getOverlayById(id));
                    }

                    let element = document.getElementById(id);
                    if (!element) {
                        element = document.createElement('div');
                        element.id = id;
                        element.style.cursor = 'pointer';
                        let img = document.createElement('img');
                        img.src = 'src/app/assets/img/pin.png';
                        element.appendChild(img);
                    }

                    const marker = new ol.Overlay({
                        id: id,
                        position: positionUTM35,
                        positioning: 'center-center',
                        element: element
                        // stopEvent: false,
                        // autoPan: true,
                        // autoPanAnimation: 'easing',
                        // insertFirst: false
                    });
                    this._map.addOverlay(marker);

                    this._map.on('click', (evt) => {
                        let popElements = document.getElementsByClassName('tl-popup');
                        Array.prototype.forEach.call(popElements, function (elem) {
                            $(elem).popover('hide');
                        });
                    });

                    element.onclick = (evt) => {
                        let popElements = document.getElementsByClassName('tl-popup');
                        Array.prototype.forEach.call(popElements, function (elem) {
                            $(elem).popover('hide');
                        });

                        let popElement = document.getElementById('tl-popup' + idx);
                        if (!popElement) {
                            popElement = document.createElement('div');
                            popElement.id = 'tl-popup' + idx;
                            popElement.className = 'tl-popup';
                        }
                        let popup = new ol.Overlay({
                            element: popElement,
                            position: positionUTM35,
                            positioning: 'center-center',
                        });
                        this._map.addOverlay(popup);

                        let user = this.state.users.filter((user) => { return user.id === object.user_id })[0];
                        // $(popElement).popover('destroy');
                        // the keys are quoted to prevent renaming in ADVANCED mode.
                        $(popElement).popover({
                            'delay': 100,
                            'placement': 'auto',
                            'animation': true,
                            'html': true,
                            'title': `<span class="fa fa-user-circle" aria-hidden="true"></span> <span>${user.username}</span>`,
                            'content': object.title
                        });
                        $(popElement).popover('toggle');
                        // setTimeout(() => {
                        // }, 100);
                    };
                });
            }
        }
    }

    createAccordion = (objects) => {
        if (!objects.length)
            return null;

        const accordion = objects.map((object, idx) => {
            const key = object.title + idx;

            const title = (<span className='tl-toc' title={object.title}>{object.title}</span>);
            const children = this.createAccordionObjects(object);

            const badge = this.state.currentUser.id
                ? <OverlayTrigger placement='top' overlay={<Tooltip id='tooltipEdit'>Редакция</Tooltip>}>
                    <FontAwesome
                        className='pull-right featuresInfoBtn'
                        name="edit"
                        size='lg'
                        inverse
                        onClick={(e) => { this._handleEditMarker(e, object); }}
                    />
                </OverlayTrigger>
                : null
                ;
            const info = (
                <OverlayTrigger placement='top' overlay={<Tooltip id='tooltipBadge'>Местоположение</Tooltip>}>
                    <FontAwesome
                        className='pull-right featuresInfoBtn'
                        name="map-marker"
                        size='lg'
                        inverse
                        onClick={(e) => { this._handleZoomToMarker(e, object.coordinates); }}
                    />
                </OverlayTrigger>
            );

            return (
                <TLPanelItem key={key} title={title} info={info} badge={badge} bsStyle='primary' defaultExpanded={this.state.defaultExpanded === key}>
                    {children}
                </TLPanelItem>
            )
        });

        return accordion;
    }

    // @todo
    createAccordionObjects = (object) => {
        const { text, user_id } = object;
        let key = user_id;
        let user = this.state.users.filter((user) => { return user.id === user_id })[0];
        let date = dateFormat(object.date, 'HH:MM dd.mm.yyyy');
        return (
            <div style={styles.div}>
                <FontAwesome name='user-circle' size='lg' /> <span>{user.username}</span>
                <br />
                <FontAwesome name='clock-o' size='lg' /> <span>{date}</span>
                <br />
                <p>{text}</p>
                {object.image ?
                    <Image src={object.image} responsive thumbnail />
                    : null
                }
            </div>
        );
    }


    // @todo
    _handleSelection = (evt) => {
        if (evt.selected.length) {
            this.setState({
                selectedMarker: evt.selected[0].getId()
            });
        }
    }

    _handleModalExit = (e) => {
        this.setState({ modalShow: false });
    }

    _addInteractions = () => {
        if (this._map) {
            this._map.removeInteraction(this._draw);

            this._draw = new ol.interaction.Draw({
                features: this._features,
                // source: this._source,
                type: 'Point', /** @type {ol.geom.GeometryType} */
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(255, 0, 0, 0.5)',
                        lineDash: [10, 10],
                        width: 2
                    }),
                    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
                        anchor: [0.3, 0.7],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        // opacity: 0.95,
                        src: 'src/app/assets/img/pin_move.png'
                    }))
                })
            });
            this._map.addInteraction(this._draw);

            let listener;
            this._draw.on('drawstart',
                function (evt) {

                }, this);

            this._draw.on('drawend', (evt) => {
                let coordinates = evt.feature.getGeometry().getCoordinates();
                let positionWGS84 = _mapProjection.convertUTM35ToWGS84(coordinates);
                this.setState({
                    modalShow: true,
                    marker: Object.assign({}, this.state.marker, {
                        coordinates: positionWGS84[1].toFixed(6) + ',' + positionWGS84[0].toFixed(6)
                    }),
                    requestType: 'post'
                });
            });
        }
    }

    _removeInteractions = () => {
        if (this._map) {
            this._map.removeInteraction(this._draw);
        }
    }

    /**
     *
     * @param {ol.Map} map
     */
    init = () => {
        if (!this._map) {
            this._map = _mapManager.getMap();
        }
        this._addInteractions(this._draw);
    }

    zoomToSelection = () => {
        if (this._map) {
            if (this._source.getFeatures().length)
                this._map.getView().fit(
                    this._source.getExtent(),
                    {
                        duration: 1000
                    }
                );
            else {
                // @todo message
            }
        }
    }

    clearSource = () => {
        this._source.clear();
        this._draw.getFeatures().clear();
    }

    removeInteraction = () => {
        if (this._map) {
            this._removeInteractions();
            // this._draw.un('select');
            // this._draw.setActive(false);
            // this._map.un('singleclick', this._handleSelection, this);
        }
    }

    remove = () => {
        this.clearSource();
        this.removeInteraction();
    }
}