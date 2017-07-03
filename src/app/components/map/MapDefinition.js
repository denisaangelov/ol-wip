/**
 *   MapDefinition.js
 *   Additional attribute properties for map definition.
 *
 *   @author     dangelov (Denis Angelov) - <a href="mailto = dangelov@technologica.com">dangelov@technologica.com</a>
 *   @version    1.0.0
 *   @since      02.2017
 */
class MapDefinition {
    /**
     *  @constructor
     *  @this {MapDefinition}
     */
    constructor() {
        if (!MapDefinition.instance) {
            this._id = null;
            this._name = '';
            this._layers = [];

            this._geoserverScheme = 'http://';
            this._geoserverHost = 'localhost'; // localhost /// 172.16.38.31 // giswmr
            this._geoserverPort = ':3001'; // :8888 /// :3001
            this._geoserverPath = '/geoserver/';
            this._geoserverURL = this._geoserverScheme + this._geoserverHost + this._geoserverPort + this._geoserverPath;
            this._geoserverStore = 'GISWMR';

            this._wmsFormat = 'image/png';
            this._wmsVersion = '1.3.0';
            this._wmsTileSize = [256, 256];

            this._wfsFormat = 'application/json';
            this._wfsVersion = '1.1.0';

            /**
             *  @todo Check purpose
             *  additional extent properties
             */
            
            /**
             * scale ratio coeff
             */
            this._translateScaleCoeff = 3571.4214285714274;
            this._imgExtent = [
                116000.00,
                4567999.99,
                632000.00,
                4908000.00
            ];
            this._origin = [
                116000.00,
                4567999.99
            ]

            MapDefinition.instance = this;
        }

        return MapDefinition.instance;
    }

    /**
     *  Getters
     *  
     *  @return {MapDOM}.{property}
     */
    getId() { return this._id; }
    getName() { return this._name; }
    getLayers() { return this._layers; }

    getGeoserverStore() { return this._geoserverStore; }
    getGeoserverURL() { return this._geoserverURL; }

    getWMSFormat() { return this._wmsFormat; }
    getWMSVersion() { return this._wmsVersion; }
    getWMSTileSize() { return this._wmsTileSize; }

    getWFSFormat() { return this._wfsFormat; }
    getWFSVersion() { return this._wfsVersion; }

    getTranslateScaleCoeff() { return this._translateScaleCoeff; }
    getImgExtent() { return this._imgExtent; }
    getOrigin() { return this._origin; }
}

const instance = new MapDefinition();
Object.freeze(instance);

export default instance;