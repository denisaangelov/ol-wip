import React from 'react';

import mapManager from '../map/MapManager';

import shallowEquals from '../../common/utils/shallow-equals';

export default class TLMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            layers: {}
        }

        // this.map = MapManager.getMap();
        this.mapManager = null;
        this.id = 'tl-map-container';
        this.className = 'map';

        // map layers
        this.layersOverview = []; // this._createLayersForMap(overview_layers);
        this.layers = []; // this._createLayersForMap(layers);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.map.layers && !shallowEquals(nextProps.map.layers, this.state.layers) && mapManager) {
            this.setState({
                layers: nextProps.map.layers
            });

            this.layers = mapManager.createLayersForMap(nextProps.map.containers);
        }
    }

    componentDidMount = () => {
        mapManager.mapInit();
    }

    render() {
        return (
            <div id={this.id} className={this.className}></div>
        )
    };
}