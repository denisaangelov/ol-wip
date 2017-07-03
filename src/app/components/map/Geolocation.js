import ol from 'openlayers';

import _mapManager from './MapManager';
import _mapProjection from './MapProjection';
import MapDom from './MapDOM';

class Geolocation {
    /**
     * @constructor
     * @param {ol.Map} map
     * @param {string=Polygon|LineString} typeSelect
     * @comment No help tooltips
     */
    constructor() {
        if (!Geolocation.instance) {
            /**
             * Current map.
             * @type {ol.Map}
             */
            this._map = _mapManager.getMap();


            // LineString to store the different geolocation positions. This LineString is time aware.
            // The Z dimension is actually used to store the rotation (heading).
            this._positions = new ol.geom.LineString(
                [],
                /** @type {ol.geom.GeometryLayout} */
                ('XYZM')
            );

            this._geolocation = new ol.Geolocation(/** @type {olx.GeolocationOptions} */({
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

            this._accuracyFeature = new ol.Feature();
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

            Geolocation.instance = this;
        }

        return Geolocation.instance;
    }

    _onChange = () => {
        let position = this._geolocation.getPosition();
        let accuracy = this._geolocation.getAccuracy();
        let heading = this._geolocation.getHeading() || 0;
        let speed = this._geolocation.getSpeed() || 0;
        let m = Date.now();

        this._addPosition(position, heading, m, speed);

        let coords = this._positions.getCoordinates();
        let len = coords.length;
        if (len >= 2) {
            this._deltaMean = (coords[len - 1][3] - coords[0][3]) / (len - 1);
        }

        let positionWGS84 = _mapProjection.convertUTM35ToWGS84(position);
        let html = [
            'Position: ' + positionWGS84[1].toFixed(6) + ', ' + positionWGS84[0].toFixed(6),
            'Accuracy: ' + accuracy + 'm',
            'Heading: ' + Math.round(this._radToDeg(heading)) + '&deg;',
            'Speed: ' + (speed * 3.6).toFixed(1) + ' km/h',
            'Delta: ' + Math.round(this._deltaMean) + 'ms'
        ].join('; ');

        let span = MapDom.getLocation().childNodes[0];
        span.innerHTML = `${html}`;
    }

    _onChangeAccuracy = () => {
        this._accuracyFeature.setGeometry(this._geolocation.getAccuracyGeometry());
    }

    _onError = () => {
        console.log('geolocation error');
    }

    // convert radians to degrees
    _radToDeg = (rad) => {
        return rad * 360 / (Math.PI * 2);
    }
    // convert degrees to radians
    _degToRad = (deg) => {
        return deg * Math.PI * 2 / 360;
    }
    // modulo for negative values
    _mod = (n) => {
        return ((n % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
    }

    _addPosition = (position, heading, m, speed) => {
        let x = position[0];
        let y = position[1];
        let fCoords = this._positions.getCoordinates();
        let previous = fCoords[fCoords.length - 1];
        let prevHeading = previous && previous[2];
        if (prevHeading) {
            let headingDiff = heading - this._mod(prevHeading);

            // force the rotation change to be less than 180°
            if (Math.abs(headingDiff) > Math.PI) {
                let sign = (headingDiff >= 0) ? 1 : -1;
                headingDiff = -sign * (2 * Math.PI - Math.abs(headingDiff));
            }
            heading = prevHeading + headingDiff;
        }
        this._positions.appendCoordinate([x, y, heading, m]);

        // only keep the 20 last coordinates
        this._positions.setCoordinates(this._positions.getCoordinates().slice(-20));

        // FIXME use speed instead
        if (heading && speed) {
            this._overlayElem.src = 'src/app/assets/img/geolocation_overlay_heading.png';
        } else {
            this._overlayElem.src = 'src/app/assets/img/geolocation_overlay.png';
        }
    }


    // recenters the view by putting the given coordinates at 3/4 from the top or
    // the screen
    _getCenterWithHeading = (position, rotation, resolution) => {
        let size = this._map.getSize();
        let height = size[1];

        return [
            position[0] - Math.sin(rotation) * height * resolution * 1 / 4,
            position[1] + Math.cos(rotation) * height * resolution * 1 / 4
        ];
    }

    // let previousM = 0;
    _updateView = () => {
        // use sampling period to get a smooth transition
        let m = Date.now() - this._deltaMean * 1.5;
        m = Math.max(m, this._previousM);
        this._previousM = m;
        // interpolate position along positions LineString
        let c = this._positions.getCoordinateAtM(m, true);
        if (c) {
            // this._map.getView().setCenter(this._getCenterWithHeading(c, -c[2], this._map.getView().getResolution()));
            // this._map.getView().setRotation(-c[2]);
            this._overlay.setPosition(c);
        }
    }

    _zoomToLocation = () => {
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

    _removeOverlay() {
        if (this._map)
            this._map.removeOverlay(this._overlay);
    }

    // public methods    
    /**
     * 
     * @param {string=Polygon|LineString} aType 
     */
    init(type) {
        if (!this._map) {
            this._map = _mapManager.getMap();
            this._accuracyLayer.setMap(this._map);
        }
        this._map.addOverlay(this._overlay);
        this._source.addFeature(this._accuracyFeature);
        this._accuracyLayer.setSource(this._source);

        this._geolocation.setTracking(true); // Start position tracking

        this._map.on('postcompose', this._updateView);
        this._map.render();
        setTimeout(() => {
            this._zoomToLocation();
        }, 200);
    }

    clearSource() {
        this._source.clear();
        this._removeOverlay();
    };

    removeInteraction() {
        if (this._map) {
            this._map.removeInteraction(this._draw);
        }
    }

    remove() {
        this.clearSource();
    }
}

const instance = new Geolocation();
// Object.freeze(instance);

export default instance;