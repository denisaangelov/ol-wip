/**
 *   MapProjection.js
 *   Represents {ol.proj.Projection} object.
 *
 *   @author     dangelov (Denis Angelov) - <a href="mailto: dangelov@technologica.com">dangelov@technologica.com</a>
 *   @version    1.0.0
 *   @since      02.2017
 */
import proj4 from 'proj4';
let geoconv = require('../../assets/js/GeoConv/geoconv_custom');
class MapProjection {
    /**
     *  @constructor
     *  @this {MapProjection}
     */
    constructor() {
        if (!MapProjection.instance) {

            this._code = 'EPSG:32635'; // defaul extent: 166021.4431, 0.0000, 833978.5569, 9329005.1825 
            this._units = 'm';
            // refernce - https://epsg.io/map#srs=32635
            this._extent = [
                62101.0572519,          //86000.00,
                4506396.57438,        //4418522.00,
                682101.0572519,         //628081.00,
                4961396.57438         //4979894.00
            ];
            this._axisOrientation = 'enu';
            /**
             *  {proj4} properties
             */
            this._proj = 'utm';
            this._zone = '35';
            this._hemisphere = 'N';
            this._ellps = 'WGS84';
            this._datum = 'WGS84';

            proj4.defs(this._code, "+proj=" + this._proj + " +zone=" + this._zone + " +ellps=" + this._ellps + " +datum=" + this._datum + " +units=" + this._units + " +no_defs");

            MapProjection.instance = this;
        }

        return MapProjection.instance;
    }

    // TODO: logic, getters & setters
    // ...

    /**
     *  Getters
     *  
     *  @return {MapProjection}.{property}
     */
    getCode() { return this._code; }
    getUnits() { return this._units; }
    getExtent() { return this._extent; }
    getAxisOrientation() { return this._axisOrientation; }
    getProj() { return this._proj; }
    getZone() { return this._zone; }
    getHemisphere() { return this._hemisphere; }
    getEllps() { return this._ellps; }
    getDatum() { return this._datum; }


    /**
     *  Formats WGS84 coordinates in decimal format
     *
     *  @param {Array.<string>} coords   Array representation of coordinates (x, y)
     *  @return {string}        String representation of coordinates lon: XXX, lat: XXX
     */
    formatWGS84ToDec(coords) {
        let geoCoords = geoconv.utm2geo_dec(coords[0], coords[1], this.getZone() + this.getHemisphere());

        return geoCoords[0].toFixed(6) + ', ' + geoCoords[1].toFixed(6);
    }

    /**
     *  Formats WGS84 coordinates in degree(lon/lat) format
     *
     *  @param {Array} coords   Array representation of coordinates (x, y)
     *  @return {string}        String representation of coordinates lon: XXX, lat: XXX
     */
    formatWGS84ToDeg(coords) {
        let geoCoords = geoconv.utm2geo_deg(coords[0], coords[1], this._zone + this._hemisphere);

        return geoCoords[0] + ', ' + geoCoords[1];
    }

    /**
     *  Converts UTM35 coordinates to WGS84 coordinates
     *  
     *  @param {string} utmCoords   The UTM35 coordinates
     *  @return {string}            The WGS84 coordinates
     */
    convertUTM35ToWGS84(utmCoords) {
        return proj4(this._code).inverse(utmCoords);
    }

    /** 
     *  @todo
     *
     *  Converts WGS84 coordinates to UTM35 coordinates
     *
     *  @param {string} wgsCoords   The WGS84 coordinates
     *  @return {string}            The UTM35 coordinates
     */
    convertWGS84ToUTM35(wgsCoords) {
        return proj4(this._code).forward(wgsCoords);
    }
}

const instance = new MapProjection();
Object.freeze(instance);

export default instance;