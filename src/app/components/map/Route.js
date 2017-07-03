import ol from 'openlayers';

import _mapManager from './MapManager';
import { feature } from '../../data/MapData';

class Route {
    /**
     * @constructor
     * @param {ol.Map} map
     * @param {string=Polygon|LineString} typeSelect
     * @comment No help tooltips
     */
    constructor() {
        if (!Route.instance) {
            /**
             * Current map.
             * @type {ol.Map}
             */
            this._isSet = false;
            this._map = _mapManager.getMap();
            this._routeFeature = (new ol.format.GeoJSON()).readFeature(feature);
            this._routeGeometry = this._routeFeature.getGeometry();
            this._routeSource = new ol.source.Vector();
            this._routeSource.addFeature(this._routeFeature);
            this._routeLayer = new ol.layer.Vector({
                source: this._routeSource
            });

            Route.instance = this;
        }

        return Route.instance;
    }

    /**
     * 
     * @param {string=Polygon|LineString} aType 
     */
    init() {
        if (!this._map) {
            this._map = _mapManager.getMap();
            this._routeLayer.setMap(this._map);
        }

        let routeCoords = this._routeGeometry.getCoordinates();
        let routeLength = routeCoords.length;

        let routeFeature = new ol.Feature({
            type: 'route',
            geometry: this._routeGeometry
        });
        let geoMarker = new ol.Feature({
            type: 'geoMarker',
            geometry: new ol.geom.Point(routeCoords[0])
        });
        let startMarker = new ol.Feature({
            type: 'icon',
            geometry: new ol.geom.Point(routeCoords[0])
        });
        let endMarker = new ol.Feature({
            type: 'icon',
            geometry: new ol.geom.Point(routeCoords[routeLength - 1])
        });

        let styles = {
            'route': new ol.style.Style({
                stroke: new ol.style.Stroke({
                    width: 6, color: [237, 212, 0, 0.8]
                })
            }),
            'icon': new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 1],
                    src: 'https://openlayers.org/en/v4.2.0/examples/data/icon.png'
                })
            }),
            'geoMarker': new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 7,
                    snapToPixel: false,
                    fill: new ol.style.Fill({ color: 'black' }),
                    stroke: new ol.style.Stroke({
                        color: 'white', width: 2
                    })
                })
            })
        };

        let animating = false;
        let speed, now;

        let vectorLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [routeFeature, geoMarker, startMarker, endMarker]
            }),
            style: (feature) => {
                // hide geoMarker if animation is active
                if (animating && feature.get('type') === 'geoMarker') {
                    return null;
                }
                return styles[feature.get('type')];
            }
        });
        vectorLayer.setMap(this._map);
        let moveFeature = (event) => {
            let vectorContext = event.vectorContext;
            let frameState = event.frameState;

            if (animating) {
                let elapsedTime = frameState.time - now;
                // here the trick to increase speed is to jump some indexes
                // on lineString coordinates
                let index = Math.round(speed * elapsedTime / 1000);

                if (index >= routeLength) {
                    stopAnimation(true);
                    return;
                }

                let currentPoint = new ol.geom.Point(routeCoords[index]);
                let feature = new ol.Feature(currentPoint);
                vectorContext.drawFeature(feature, styles.geoMarker);
            }
            // tell OpenLayers to continue the postcompose animation
            this._map.render();
        };

        let startAnimation = () => {
            if (animating) {
                stopAnimation(false);
            } else {
                animating = true;
                now = new Date().getTime();
                speed = 40;
                // hide geoMarker
                geoMarker.setStyle(null);
                // just in case you pan somewhere else
                this._map.getView().fit(
                    this._routeGeometry.getExtent(),
                    {
                        duration: 1000
                    }
                );
                this._map.on('postcompose', moveFeature);
                this._map.render();
            }
        }


        /**
         * @param {boolean} ended end of animation.
         */
        let stopAnimation = (ended) => {
            animating = false;

            // if animation cancelled set the marker at the beginning
            let coord = ended ? routeCoords[routeLength - 1] : routeCoords[0];
        /** @type {ol.geom.Point} */ (geoMarker.getGeometry())
                .setCoordinates(coord);
            //remove listener
            this._map.un('postcompose', moveFeature);
        }
        if (this._isSet)
            startAnimation();

        this._isSet = !this._isSet;
    }

    clearSource() {
        this._source.clear();
    };

    removeInteraction() {
        if (this._map) {
            // this._map.removeInteraction(this._draw);
            // this._map.un('pointermove', this._pointerMoveHandler, this);
        }
    }

    remove() {
        this.clearSource();
        this.removeInteraction();
    }
}

const instance = new Route();

export default instance;