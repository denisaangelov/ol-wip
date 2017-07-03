/**
 *   MapManager.js
 *   Creates main map management functionality.
 *   Needs to be included at last from all map related files.
 *
 *   @author     dangelov (Denis Angelov) - <a href="mailto: dangelov@technologica.com">dangelov@technologica.com</a>
 *   @version    1.0.0
 *   @since      02.2017
 */
import ol from 'openlayers';
import proj4 from 'proj4';
ol.proj.setProj4(proj4);

import MapProjection from './MapProjection';
import MapView from './MapView';
import MapDom from './MapDOM';
import MapDefinition from "./MapDefinition";
import { overview_layers } from '../../data/MapData';

const apiKey = "5f9d70824316494aba8324b1084cb85e"; // "5f9d70824316494aba8324b1084cb85e"; "0e6fc415256d4fbb9b5166a718591d71";

class MapManager {
    /**
     *  @todo MapManager#mapInit method execution and ajax request to ServerProperties#getRestServiceURL()
     *  @constructor
     *  @this {MapManager}
     */
    constructor() {
        if (!MapManager.instance) {
            this._map = null;
            this._mapOverview = null;
            this._projection = new ol.proj.Projection(MapView.getProjection());

            // map definition properties
            this._geoserverURL = MapDefinition.getGeoserverURL();
            this._geoserverStore = MapDefinition.getGeoserverStore();
            this._wmsFormat = MapDefinition.getWMSFormat();
            this._wmsVersion = MapDefinition.getWMSVersion();
            this._wmsTileSize = MapDefinition.getWMSTileSize();
            this._wfsFormat = MapDefinition.getWFSFormat();
            this._wfsVersion = MapDefinition.getWFSVersion();

            // map layers
            this._layersOverview = []; //this.createLayersForMapOverview(overview_layers);
            this._layers = []; // this._createLayersForMap(layers);

            MapManager.instance = this;

            /**
             *  Map initialization
             */
            // this.mapInit();
        }

        return MapManager.instance;
    }

    mapInit() {
        // const olOverview = new ol.View({
        //     center: MapView.getCenter(),
        //     extent: MapProjection.getExtent(),
        //     maxResolution: MapView.getMaxResolution() * 5,
        //     minResolution: MapView.getMinResolution() * 5,
        //     // maxZoom: MapView.getMaxZoom(),
        //     // minZoom: MapView.getMinZoom(),
        //     projection: this._projection,
        //     // resolution: 700,
        //     zoom: MapView.getZoom()
        // });

        // this._mapOverview = new ol.control.OverviewMap({/*collapsed: true,collapseLabel: '<<',collapsible: true,label: '>>',layers: '',render: '',target: '',tipLabel: '',*/
        //     collapsed: false,
        //     className: `${MapDom.getOverviewMap()} ol-overviewmap`,
        //     view: olOverview,
        //     label: MapDom.getOverviewLabel(),
        //     collapseLabel: MapDom.getOverviewCollapseLabel(),
        //     tipLabel: MapDom.getOverviewTipLabel(),
        //     // target: MapDom.getOverviewTarget(),
        //     layers: this._layersOverview
        // });

        const olView = new ol.View({
            center: MapView.getCenter(),
            extent: MapProjection.getExtent(),
            maxResolution: MapView.getMaxResolution(),
            minResolution: MapView.getMinResolution(),
            maxZoom: MapView.getMaxZoom(),
            minZoom: MapView.getMinZoom(),
            projection: this._projection,
            resolutions: MapView.getResolutions(),
            zoom: MapView.getZoom(),
            zoomFactor: MapView.getZoomFactor()
        });

        this._map = new ol.Map({
            controls: ol.control
                .defaults({
                    attribution: false,
                    rotate: false,
                    zoom: false
                })
                .extend([
                    new ol.control.OverviewMap({/*collapsed: true,collapseLabel: '<<',collapsible: true,label: '>>',layers: '',render: '',target: '',tipLabel: '',*/
                        collapsed: false,
                        className: `${MapDom.getOverviewMap()} ol-overviewmap`,
                        view: new ol.View({
                            center: MapView.getCenter(),
                            extent: MapProjection.getExtent(),
                            maxResolution: MapView.getMaxResolution() * 5,
                            minResolution: MapView.getMinResolution() * 5,
                            // maxZoom: MapView.getMaxZoom(),
                            // minZoom: MapView.getMinZoom(),
                            projection: this._projection,
                            zoom: MapView.getZoom()
                        }),
                        label: MapDom.getOverviewLabel(),
                        collapseLabel: MapDom.getOverviewCollapseLabel(),
                        tipLabel: MapDom.getOverviewTipLabel(),
                        // target: MapDom.getOverviewTarget(),
                        // layers: this._layersOverview
                    }),
                    new ol.control.Zoom({
                        className: `${MapDom.getZoom()} ol-zoom`,
                        zoomInLabel: MapDom.getZoomInLabel(),
                        zoomOutLabel: MapDom.getZoomOutLabel(),
                        zoomInTipLabel: MapDom.getZoomInTipLabel(),
                        zoomOutTipLabel: MapDom.getZoomOutTipLabel()
                    }),
                    // new ol.control.ZoomSlider({
                    //     className: `${MapDom.getZoomSlider()} ol-zoomslider`/*,maxResolution,minResolution*/
                    // }),
                    new ol.control.ScaleLine({
                        className: `${MapDom.getScaleLine()} ol-scale-line`/*,minWidth,target,units*/
                    }),
                    new ol.control.MousePosition({
                        className: `${MapDom.getMousePosition()}`, /* Default is ol-mouse-position */
                        coordinateFormat: this._coordinatesFormater,
                        projection: this._projection,
                        //target: document.getElementById(_mapDOM.getCoordsContainer()),
                        undefinedHTML: ''
                    }), new ol.control.Control({
                        element: MapDom.getScaleRatio(),
                        render: () => {
                            if (this._map) {
                                const units = this._map.getView().getProjection().getUnits();
                                const dpi = 25.4 / 0.28;
                                const mpu = ol.proj.METERS_PER_UNIT[units];
                                const megicNumber = 39.37;
                                const scale = this._map.getView().getResolution() * (mpu * megicNumber * dpi);

                                let span = MapDom.getScaleRatio().childNodes[0];
                                span.innerHTML = `1:${Math.round(scale)}`;
                            }
                        }
                    }), new ol.control.Control({
                        element: MapDom.getLocation(),
                        render: () => {
                            // let span = MapDom.getLocation().childNodes[0];
                            // span.innerHTML = `No location information`;
                        }
                    })
                ]),
            layers: this._layers,
            renderer: 'canvas',
            target: MapDom.getMapContainer(),
            view: olView,
            loadTilesWhileAnimating: true,
            loadTilesWhileInteracting: true
        });
    }

    /**
     * @param {string} coords 
     */
    _coordinatesFormater(coords) {
        return MapProjection.formatWGS84ToDec(coords);
    }

    getLayer(id) {
        return this._map.getLayers().getArray().filter((layer) => {
            return layer.get('id') == id;
        });
    }

    setVisible(id, flag) {
        let layer = this.getLayer(id)[0];
        layer.setVisible(flag);
    }

    /**
     *  {MapDefinition._layers} filler
     */
    createLayersForMap(containers) {
        if (typeof containers === 'undefined')
            return null;

        return containers.map((container) => {
            if (container.name && container.name == "Other") {
                container.layers.forEach((l) => {
                    this._map.addLayer(this.createOSMLayer(l));
                })
            } else {
                this._map.addLayer(this.createOSMLayer(container));
            }
            // this._map.addLayer(this.createOSMLayer(container));
        });
    }

    /**
     *  {MapDefinition._layers} filler
     */
    createLayersForMapOverview(containers) {
        if (typeof containers === 'undefined')
            return null;

        return containers.map((container) => {
            if (container.name && container.name == "Other") {
                container.layers.forEach((l) => {
                    return this.createOSMLayer(l);
                })
            } else {
                return this.createOSMLayer(container);
            }
            // return this.createOSMLayer(container);
        });
    }

    /** 
     *  @todo
     *
     *  {ol.layer}.Tile
     *  {ol.source}.TileWMS
     *  {service} WMS
     */
    createTileWMSLayer(layer) {
        let style = layer.code;
        let layerName = layer.layer_name;
        if (layer.geom_type.toUpperCase() == 'GROUP') {
            style = '';
            // layerName = layer.code;
        }
        const tileLayer = new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: this._geoserverURL + this._geoserverStore + '/wms?',
                params: {
                    'LAYERS': layerName.toUpperCase(),
                    'VERSION': this._wmsVersion,
                    'FORMAT': this._wmsFormat,
                    'TILED': true,
                    'CQL_FILTER': layer.cql_filter,
                    'STYLES': style.toUpperCase()
                },
                serverType: 'geoserver',
                tileGrid: new ol.tilegrid.TileGrid({
                    tileSize: this._wmsTileSize,
                    extent: MapProjection.getExtent(),
                    resolutions: MapView.getResolutions()
                }),
                projection: this._projection
                // reprojectionErrorThreshold: 2
            })
        });
        tileLayer.set('id', layer.id);
        tileLayer.setVisible(layer.is_visible == 'true');
        tileLayer.setZIndex(Number(layer.z_order));
        return tileLayer;
    }

    /** 
     *  @todo
     *
     *  {ol.layer}.Tile
     *  {ol.source}.TileWMS
     *  {service} WMS
     */
    createImageWMSLayer(layer) {
        let style = layer.code;
        let layerName = layer.layer_name;
        if (layer.geom_type.toUpperCase() == 'GROUP') {
            style = '';
            // layerName = layer.code;
        }
        const imageLayer = new ol.layer.Image({
            source: new ol.source.ImageWMS({
                url: this._geoserverURL + this._geoserverStore + '/wms?',
                params: {
                    'LAYERS': layerName.toUpperCase(),
                    'VERSION': this._wmsVersion,
                    'FORMAT': this._wmsFormat,
                    'CQL_FILTER': layer.cql_filter,
                    'STYLES': style.toUpperCase()
                },
                serverType: 'geoserver',
                projection: this._projection,
                ratio: 1,
                resolutions: MapView.getResolutions()//.map(function (resolution) { return resolution * 5 }),                
            })
        });
        imageLayer.set('id', layer.id);
        imageLayer.setVisible(layer.is_visible == 'true');
        imageLayer.setZIndex(Number(layer.z_order));
        return imageLayer;
    }

    /** 
     *  @todo
     *
     *  {ol.layer}.Vector
     *  {ol.source}.TileWMS
     *  {service} WFS
     */
    createWFSLayer = (layer, extent) => {
        return new ol.layer.Vector({
            source: new ol.source.Vector({
                format: new ol.format.GeoJSON(),
                url: function (extent, resolution, projection) {
                    return this._geoserverURL + this._geoserverStore + '/ows?' +
                        '&service=wfs' +
                        '&version=' + this._wfsVersion +
                        '&request=GetFeature' +
                        '&typeNames=' + (layer.layer_name).toUpperCase() +
                        '&outputFormat=' + this._wfsFormat +
                        '&srsName=' + MapProjection.getCode() +
                        '&bbox=' + extent.join(',') +
                        '&maxFeatures=1000'
                },
                strategy: ol.loadingstrategy.bbox,
                overlaps: true
            })
        });
    }

    createImageLayer = (layer) => {
        const imageLayer = new ol.layer.Image({
            source: new ol.source.ImageStatic({
                crossOrigin: 'use-credetials',
                imageExtent: MapProjection.getExtent(),
                projection: this._projection,
                imageSize: 256,
                // url: 'https://tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey=' + apiKey
                url: 'https://tile.thunderforest.com/static/cycle/367949.1468,4736271.5579,1/256x256.png?apikey=' + apiKey
            })
        });

        imageLayer.set('id', layer.id);
        imageLayer.setVisible(layer.is_visible == 'true');
        imageLayer.setZIndex(Number(layer.z_order));

        return imageLayer;
    }

    createOSMLayer = (layer) => {
        const source = new ol.source.OSM();
        if (layer.url) {
            source.setUrl(layer.url + apiKey)
        }

        const osmLayer = new ol.layer.Tile({
            source: source
        });

        osmLayer.set('id', layer.id);
        osmLayer.setVisible(layer.is_visible == 'true');
        osmLayer.setZIndex(Number(layer.z_order));

        return osmLayer;
    }

    getLegendGraphic = (layer) => {
        // code in database = style in geoserver
        let style = layer.code;
        let layerName = layer.layer_name;
        if (layer.geom_type.toUpperCase() == 'GROUP') {
            style = '';
            layerName = layer.code;
        }

        return `${this._geoserverURL}${this._geoserverStore}/wms?REQUEST=GetLegendGraphic&VERSION=${this._wmsVersion}&LAYER=${layerName.toUpperCase()}&STYLE=${style.toUpperCase()}&FORMAT=${this._wmsFormat}&WIDTH=24&HEIGHT=24&DPI=96`;
    }

    getMap() {
        return this._map;
    }
    getProjection() {
        return this._projection;
    }

    zoomToAll() {
        this._map.getView().animate({
            center: MapView.getCenter(),
            zoom: MapView.getZoom()
        });
    }

}

const instance = new MapManager();
// Object.freeze(instance);

export default instance;