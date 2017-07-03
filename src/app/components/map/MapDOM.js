/**
 *   tl_mapDOM.js
 *   Creates map DOM representation.
 *
 *   @author     dangelov (Denis Angelov) - <a href="mailto: dangelov@technologica.com">dangelov@technologica.com</a>
 *   @version    1.0.0
 *   @since      02.2017
 */
class MapDOM {
    /**
     *  @constructor
     *  @this {MapDOM}
     */
    constructor() {
        if (!MapDOM.instance) {
            this.classes = {
                _mapContainer: 'tl-map-container',
                _overviewMap: 'tl-overviewmap',
                _mousePosition: 'tl-mouse-position',
                _zoom: 'tl-zoom',
                _zoomSlider: 'tl-zoomslider',
                _scaleLine: 'tl-scale-line',
                _scaleRatio: 'tl-scale-ratio',
                _location: 'tl-location',
                _legendContainer: 'tl-legend-container',
                _leftPanel: 'tl-left-panel',
                _rightPanel: 'tl-right-panel'
            }
            this.ids = {

            }
            this.labels = {
                _zoomInLabel: '&#43',
                _zoomOutLabel: '&#45',
                _zoomInTipLabel: 'Приближи',
                _zoomOutTipLabel: 'Отдалечи',
                _overviewLabel: '&#187',
                _overviewCollapseLabel: '&#171',
                _overviewTipLabel: 'Мини-карта'
            }

            MapDOM.instance = this;
        }

        return MapDOM.instance;
    }

    /**
     *  Getters
     *  
     *  @return {MapDOM}.{property}
     */
    // classes
    getMapContainer() { return this.classes._mapContainer; }
    getOverviewMap() { return this.classes._overviewMap; }
    getMousePosition() { return this.classes._mousePosition; }
    getZoom() { return this.classes._zoom; }
    getZoomSlider() { return this.classes._zoomSlider; }
    getScaleLine() { return this.classes._scaleLine; }
    getScaleRatio() {
        let div = document.getElementsByClassName('tl-scale-ratio')[0];
        if (!div) {
            div = document.createElement('div');
            div.className = `tl-scale-ratio ol-unselectable`;
            let span = document.createElement('span');
            div.appendChild(span);
        }
        return div;
    }
    getLocation() {
        let div = document.getElementsByClassName('tl-location')[0];
        if (!div) {
            div = document.createElement('div');
            div.className = `tl-location ol-unselectable`;
            let span = document.createElement('span');
            div.appendChild(span);
        }
        return div;
    }
    getLegendContainer() { return this.classes._legendContainer; }
    getLeftPanel() { return this.classes._leftPanel; }
    getRightPanel() { return this.classes._rightPanel; }
    // labels
    getZoomInLabel() {
        let span = document.createElement('span');
        span.innerHTML = this.labels._zoomInLabel;
        return span;
    }
    getZoomOutLabel() {
        let span = document.createElement('span');
        span.innerHTML = this.labels._zoomOutLabel;
        return span;
    }
    getZoomInTipLabel() {
        return this.labels._zoomInTipLabel;
    }
    getZoomOutTipLabel() {
        return this.labels._zoomOutTipLabel;
    }
    getOverviewTarget() {
        let div = document.createElement('div');
        let container = document.getElementById('container');
        container.appendChild(div);
        return div;
    }
    getOverviewLabel() {
        let span = document.createElement('span');
        span.innerHTML = this.labels._overviewLabel;
        return span;
    }
    getOverviewCollapseLabel() {
        let span = document.createElement('span');
        span.innerHTML = this.labels._overviewCollapseLabel;
        return span;
    }
    getOverviewTipLabel() {
        return this.labels._overviewTipLabel;
    }

    /**
     *  Legend element filler
     */
    fillLayerStructure() {

    }
}

const instance = new MapDOM();
Object.freeze(instance);

export default instance;