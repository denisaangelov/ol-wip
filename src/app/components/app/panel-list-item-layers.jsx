import React from 'react';
import { ListGroupItem, Image, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import shallowEquals from '../../common/utils/shallow-equals';

import _mapDefinition from "../map/MapDefinition";
import _mapManager from "../map/MapManager";

import TLPanelBadge from './panel-badge';

const styles = {
    image: {
        display: 'inline-block',
        padding: 1,
        backgroundColor: '', // #ccc
        borderRadius: 3,
        maxWidth: 50
    },
    imageHovered: {
        display: 'inline-block',
        padding: 1,
        backgroundColor: '#adadad',
        borderRadius: 3,
        maxWidth: 50
    },
    badge: {
        backgroundColor: '#333'
    },
    div: {
        cursor: 'pointer',
        // margin: '5px 0'
    }
}
export default class TLPanelListItem extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            layer: props.layer,
            showGraphic: false,
            isHovered: false,
            isClicked: false
        };

        this._geoserverURL = _mapDefinition.getGeoserverURL();
        this._geoserverStore = _mapDefinition.getGeoserverStore();
        this._wmsFormat = _mapDefinition.getWMSFormat();
        this._wmsVersion = _mapDefinition.getWMSVersion();
        this._wmsTileSize = _mapDefinition.getWMSTileSize();
        this._wfsFormat = _mapDefinition.getWFSFormat();
        this._wfsVersion = _mapDefinition.getWFSVersion();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.layer && !shallowEquals(nextProps.layer, this.state.layer)) {
            this.setState({
                layer: nextProps.layer
            });
        }
    }

    render() {
        return (
            <ListGroupItem active={this.props.active}>
                <div onClick={this.props.onClick} style={styles.div}>
                    <OverlayTrigger placement='top' overlay={<Tooltip id='toggleGraphic'>Символ</Tooltip>}>
                        <Image src={this._getLegendGraphic(this.state.layer)}
                            style={(this.state.isHovered || this.state.isClicked) ? styles.imageHovered : styles.image}
                        />
                    </OverlayTrigger>
                    &nbsp;
                    <span className='tl-toc' title={this.state.layer.descr}>{this.state.layer.descr}</span>
                    {this.state.layer.url
                        ? <OverlayTrigger placement='top' overlay={<Tooltip id='toggleVisibility'>Покажи/скрий слой</Tooltip>}>
                            <Button bsSize='xs' className='pull-right' onClick={(e) => { this._handleToggleVisibility(e) }}>
                                <FontAwesome name={this.state.layer.is_visible == 'true' ? 'eye' : 'eye-slash'} size='lg' />
                            </Button>
                        </OverlayTrigger>
                        : null
                    }
                </div>

                {this.state.showGraphic
                    ? <Image src={this._getLegendGraphic(this.state.layer)} responsive thumbnail />
                    : null
                }
            </ListGroupItem>
        )
    }

    _onMouseEnter = (e) => {
        this.setState({
            isHovered: !this.state.isHovered
        });
    }
    _onMouseLeave = (e) => {
        this.setState({
            isHovered: !this.state.isHovered
        });
    }

    _handleToggleVisibility = (e) => {
        e.preventDefault();
        e.stopPropagation();

        this.props.handleToggleVisibility(e, this.state.layer, (this.state.layer.is_visible == 'true' ? 'false' : 'true'));

        this._handleButtonBlur(e, true);
    }

    _handleToggleGraphic = (e, layer) => {
        e.preventDefault();
        e.stopPropagation();

        this.setState({
            showGraphic: !this.state.showGraphic,
            isClicked: !this.state.isClicked
        });
        this._handleButtonBlur(e, this.state.showGraphic);
    }

    _handleButtonBlur = (e, flag) => {
        (flag) ? e.currentTarget.blur() : '';
    }

    _getLegendGraphic = (layer) => {
        return `src/app/assets/img/${layer.table_name}/${layer.code}.png`;
        // return _mapManager.getLegendGraphic(layer);
        // const style = (String(layer.cql_filter) == 'null') ? '' : (layer.table_name + '_' + layer.cql_filter.split(' = ')[1]).toUpperCase();

        // return `${this._geoserverURL}${this._geoserverStore}/wms?REQUEST=GetLegendGraphic&VERSION=${this._wmsVersion}&LAYER=${layer.layer_name.toUpperCase()}&STYLE=${style}&FORMAT=${this._wmsFormat}&WIDTH=24&HEIGHT=24&DPI=96`;
    }
}