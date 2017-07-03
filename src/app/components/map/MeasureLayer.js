import ol from 'openlayers';

import _mapManager from './MapManager';

class MeasureLayer {
    /**
     * @constructor
     * @param {ol.Map} map
     * @param {string=Polygon|LineString} typeSelect
     * @comment No help tooltips
     */
    constructor() {
        if (!MeasureLayer.instance) {
            /**
             * Current map.
             * @type {ol.Map}
             */
            this._map = _mapManager.getMap();
            /**
             * Current drawn type.
             * @type {string=Polygon|LineString}
             */
            this._typeSelect = ''; // Polygon|LineString
            /**
             * Currently drawn feature.
             * @type {ol.Feature}
             */
            this._sketch = null;
            /**
             * All overlays
             * @type {Array[ol.Overlay]}
             */
            this._overlayTooltips = [];
            /**
             * Overlay to show the help messages.
             * @type {ol.Overlay}
             */
            this._helpTooltip = null;
            /**
             * Overlay to show the measurement.
             * @type {ol.Overlay}
             */
            this._measureTooltip = null;
            /**
             * The help tooltip element.
             * @type {Element}
             */
            this._helpTooltipElement = null;
            /**
             * The measure tooltip element.
             * @type {Element}
             */
            this._measureTooltipElement = null;
            /**
             * Message to show when the user is drawing a polygon.
             * @type {string}
             */
            this._continuePolygonMsg = 'Натиснете, за да продължите измерването на полигон.';
            /**
             * Message to show when the user is drawing a line.
             * @type {string}
             */
            this._continueLineMsg = 'Натиснете, за да продължите измерването на линия.';
            /**
             * Global so we can remove it later
             * @type {ol.interaction.Draw}
             */
            this._draw = null; // global so we can remove it later

            this._isGeodesy = false;

            this._source = new ol.source.Vector();
            this._measureLayer = new ol.layer.Vector({
                source: this._source,
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(0, 0, 0, 0.5)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#ffcc33',
                        width: 2
                    }),
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({
                            color: '#ffcc33'
                        })
                    })
                }),
                map: this._map
            });

            MeasureLayer.instance = this;
        }

        return MeasureLayer.instance;
    }

    /**
     * Handle pointer move.
     * @param {ol.MapBrowserEvent} evt The event.
     */
    _pointerMoveHandler(evt) {
        if (evt.dragging) {
            return;
        }
        /** @type {string} */
        let helpMsg = 'Натиснете, за да започнете чертаене.';

        if (this._sketch) {
            let geom = (this._sketch.getGeometry());
            if (geom instanceof ol.geom.Polygon) {
                helpMsg = this._continuePolygonMsg;
            } else if (geom instanceof ol.geom.LineString) {
                helpMsg = this._continueLineMsg;
            }
        }

        this._helpTooltipElement.innerHTML = helpMsg;
        this._helpTooltip.setPosition(evt.coordinate);

        this._helpTooltipElement.classList.remove('hidden');
    };

    /**
     * Creates a new help tooltip
     */
    _createHelpTooltip() {
        if (this._helpTooltipElement) {
            this._helpTooltipElement.parentNode.removeChild(this._helpTooltipElement);
        }
        this._helpTooltipElement = document.createElement('div');
        this._helpTooltipElement.className = 'tl-tooltip hidden';
        this._helpTooltip = new ol.Overlay({
            element: this._helpTooltipElement,
            offset: [15, 0],
            positioning: 'center-left'
        });
        this._map.addOverlay(this._helpTooltip);
        this._overlayTooltips.push(this._helpTooltip);
    }


    /**
     * Creates a new measure tooltip
     */
    _createMeasureTooltip() {
        if (this._measureTooltipElement) {
            this._measureTooltipElement.parentNode.removeChild(this._measureTooltipElement);
        }
        this._measureTooltipElement = document.createElement('div');
        this._measureTooltipElement.className = 'tl-tooltip tl-tooltip-measure';
        this._measureTooltip = new ol.Overlay({
            element: this._measureTooltipElement,
            offset: [0, -15],
            positioning: 'bottom-center'
        });
        if (this._map)
            this._map.addOverlay(this._measureTooltip);

        this._overlayTooltips.push(this._measureTooltip);
    }

    /**
     * Format length output.
     * @param {ol.geom.LineString} line The line.
     * @return {string} The formatted length.
     */
    _formatLength(line) {
        let length;
        if (this._isGeodesy.checked) {
            let coordinates = line.getCoordinates();
            length = 0;
            let sourceProj = map.getView().getProjection();
            for (let i = 0, ii = coordinates.length - 1; i < ii; ++i) {
                let c1 = ol.proj.transform(coordinates[i], sourceProj, MapProjection.getCode());
                let c2 = ol.proj.transform(coordinates[i + 1], sourceProj, MapProjection.getCode());
                length += wgs84Sphere.haversineDistance(c1, c2);
            }
        } else {
            length = Math.round(line.getLength() * 100) / 100;
        }
        let output;
        if (length > 1000) {
            output = (Math.round(length / 1000 * 100) / 100) +
                ' ' + 'км';
        } else {
            output = (Math.round(length * 100) / 100) +
                ' ' + 'м';
        }
        return output;
    }


    /**
     * Format area output.
     * @param {ol.geom.Polygon} polygon The polygon.
     * @return {string} Formatted area.
     */
    _formatArea(polygon) {
        let area;
        if (this._isGeodesy.checked) {
            let sourceProj = map.getView().getProjection();
            let geom = (polygon.clone().transform(sourceProj, MapProjection.getCode())); /** @type {ol.geom.Polygon} */
            let coordinates = geom.getLinearRing(0).getCoordinates();
            area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
        } else {
            area = polygon.getArea();
        }
        let output;
        if (area > 10000) {
            output = (Math.round(area / 1000000 * 100) / 100) +
                ' ' + 'км<sup>2</sup>';
        } else {
            output = (Math.round(area * 100) / 100) +
                ' ' + 'м<sup>2</sup>';
        }
        return output;
    }

    _addListeners() {
        let that = this;
        this._map.getViewport().addEventListener('mouseout', function () {
            that._helpTooltipElement.classList.add('hidden');
        });
    }
    /**
     * @param {string=Polygon|LineString} typeSelection 
     */
    _setTypeSelect(typeSelect) {
        this._typeSelect = typeSelect;
    }
    _addInteraction() {
        this._map.removeInteraction(this._draw);

        let type = this._typeSelect;
        this._draw = new ol.interaction.Draw({
            source: this._source,
            type: (type), /** @type {ol.geom.GeometryType} */
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgba(255, 0, 0, 0.5)',
                    lineDash: [10, 10],
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 5,
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0, 0, 0, 0.7)'
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(0, 0, 255, 0.2)'
                    })
                })
            })
        });
        this._map.addInteraction(this._draw);

        this._createMeasureTooltip();
        // this._createHelpTooltip();

        let listener;
        this._draw.on('drawstart',
            function (evt) {
                // _helpTooltip handler
                // this._map.on('pointermove', this._pointerMoveHandler, this);
                // set sketch
                this._sketch = evt.feature;

                /** @type {ol.Coordinate|undefined} */
                let tooltipCoord = evt.coordinate;

                listener = this._sketch.getGeometry().on('change', function (evt) {
                    let geom = evt.target;
                    let output;
                    if (geom instanceof ol.geom.Polygon) {
                        output = this._formatArea(geom);
                        tooltipCoord = geom.getInteriorPoint().getCoordinates();
                    } else if (geom instanceof ol.geom.LineString) {
                        output = this._formatLength(geom);
                        tooltipCoord = geom.getLastCoordinate();
                    }
                    this._measureTooltipElement.innerHTML = output;
                    this._measureTooltip.setPosition(tooltipCoord);
                }, this);
            }, this);

        this._draw.on('drawend',
            function () {
                this._measureTooltipElement.className = 'tl-tooltip tl-tooltip-static';
                this._measureTooltip.setOffset([0, -7]);
                // unset sketch
                this._sketch = null;
                // unset tooltip so that a new one can be created
                this._measureTooltipElement = null;
                this._createMeasureTooltip();
                ol.Observable.unByKey(listener);
            }, this);
    }

    _removeTooltipOverlays() {
        this._overlayTooltips.forEach((overlay) => {
            this._map.removeOverlay(overlay);
        });
    }


    // public methods    
    /**
     * 
     * @param {string=Polygon|LineString} aType 
     */
    init(type) {
        if (!this._map) {
            this._map = _mapManager.getMap();
            this._measureLayer.setMap(this._map);
        }
        // _helpTooltip listener
        // this._addListeners();
        this._setTypeSelect(type);
        this._addInteraction();
    }

    clearSource() {
        this._source.clear();
        this._removeTooltipOverlays();
        this._createMeasureTooltip();
        // this._createHelpTooltip();
    };

    removeInteraction() {
        if (this._map) {
            this._map.removeInteraction(this._draw);
            // this._map.un('pointermove', this._pointerMoveHandler, this);
        }
    }

    remove() {
        this.clearSource();
        this.removeInteraction();
    }
}

const instance = new MeasureLayer();
// Object.freeze(instance);

export default instance;