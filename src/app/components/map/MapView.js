/**
 *   MapView.js
 *   Defines main map view static properties.
 *   Represents {ol.View} object.
 *
 *   @author     dangelov (Denis Angelov) - <a href="mailto: dangelov@technologica.com">dangelov@technologica.com</a>
 *   @version    1.0.0
 *   @since      02.2017
 */
import ol from 'openlayers';
import MapProjection from './MapProjection';
class MapView {
    /**
     *  @constructor by default
     *  @this {MapView}
     */
    constructor(
        center = [
            367949.1468, // 354935.4981,  //354935.148739, 354943.580342
            4736271.5579 //4735692.5796, //4735692.811869 4724568.213763
        ],
        maxResolution = 742.1875,
        minResolution = 0.362396240234375,
        maxZoom = 11,
        minZoom = 0,
        projection = {
            code: MapProjection.getCode(),
            units: MapProjection.getUnits(),
            extent: MapProjection.getExtent(),
            axisOrientation: MapProjection.getAxisOrientation()
        },
        resolution = null,
        resolutions =
            [
                742.1875,
                371.09375,
                185.546875,
                92.7734375,
                46.38671875,
                23.193359375,
                11.5966796875,
                5.79833984375,
                2.899169921875,
                1.4495849609375,
                0.72479248046875,
                0.362396240234375
            ],
        rotation = null,
        zoom = 0.5,
        zoomFactor = 1
    ) {
        if (!MapView.instance) {
            // resoution calculation:
            // const res = new Array(10);
            // const startResolution = ol.extent.getWidth(MapProjection.getExtent()) / 1024;
            // for (let i = 0, ii = res.length; i < ii; ++i) {
            //     res[i] = startResolution / Math.pow(2, i);
            // }

            this._center = center;
            this._maxResolution = maxResolution;
            this._minResolution = minResolution;
            this._maxZoom = maxZoom;
            this._minZoom = minZoom;
            this._projection = projection;
            this._resolution = resolution;
            this._resolutions = resolutions;
            this._rotation = rotation;
            this._zoom = zoom;
            this._zoomFactor = zoomFactor;


            MapView.instance = this;

        }

        return MapView.instance;
    }

    // TODO: logic..


    /**
     *  Getters
     *  
     *  @return {MapView}.{property}
     */
    getCenter() { return this._center; }
    getMaxResolution() { return this._maxResolution; }
    getMinResolution() { return this._minResolution; }
    getMaxZoom() { return this._maxZoom; }
    getMinZoom() { return this._minZoom; }
    getProjection() { return this._projection; }
    getResolution() { return this._resolution; }
    getResolutions() { return this._resolutions; }
    getRotation() { return this._rotation; }
    getZoom() { return this._zoom; }
    getZoomFactor() { return this._zoomFactor; }

}

const instance = new MapView();
Object.freeze(instance);

export default instance;