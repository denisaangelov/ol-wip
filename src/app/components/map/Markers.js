import ol from 'openlayers';

import _mapManager from './MapManager';

class Markers {
    /**
     * @constructor
     * @param {ol.Map} map
     * @param {string=Polygon|LineString} typeSelect
     * @comment No help tooltips
     */
    constructor() {
        if (!Markers.instance) {
            /**
             * Current map.
             * @type {ol.Map}
             */
            this._map = _mapManager.getMap();

            this._geolocation = new ol.Markers(/** @type {olx.GeolocationOptions} */({
                projection: _mapManager.getProjection(),
                trackingOptions: {
                    enableHighAccuracy: true,
                    timeout: 600000,
                    maximumAge: 10000
                }
            }));

            this._overlayElem = document.createElement('img');
            this._overlayElem.setAttribute('id', 'geolocation_overlay');

            this._overlay = new ol.Overlay({
                positioning: 'center-center',
                element: this._overlayElem,
                stopEvent: false
            });

            // this._accuracyFeature = new ol.Feature();
            this._source = new ol.source.Vector();
            this._accuracyLayer = new ol.layer.Vector({
                map: this._map,
                source: this._source
            });

            this._geolocation.on('change', this._onChange, this);
            this._geolocation.on('error', this._onError, this);
            this._geolocation.on('change:accuracyGeometry', this._onChangeAccuracy, this);

            this._deltaMean = 500;
            this._previousM = 0;

            Markers.instance = this;
        }

        return Markers.instance;
    }
    
    // public methods    
    /**
     * 
     * @param {string=Polygon|LineString} aType 
     */
    init(type) {
        if (!this._map) {
            this._map = _mapManager.getMap();
        }
        this._map.addOverlay(this._overlay);
        // this._accuracyLayer.setSource(this._source);
        // this._source.addFeature(this._accuracyFeature);
        this._accuracyLayer.setSource(this._source);

        this._geolocation.setTracking(true); // Start position tracking

        this._map.on('postcompose', this._updateView);
        this._map.render();
    }
}