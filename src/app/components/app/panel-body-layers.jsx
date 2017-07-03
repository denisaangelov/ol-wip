import React from 'react';
import { connect } from 'react-redux';

import { Tooltip, OverlayTrigger, Accordion, Panel, ListGroup, ListGroupItem, Badge } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import { selectLayer, toggleVisibility } from '../../actions';
import shallowEquals from '../../common/utils/shallow-equals';

import TLPanelListItem from './panel-list-item-layers';
import TLPanelItem from './panel-item';
import TLPanelBadge from './panel-badge';

const styles = {
    div: {
        padding: '4px'
    },
    listGroup: {
        marginBottom: 0
    }
};

const mapStateToProps = (state) => ({
    map: state.map,
    selectedLayer: state.selectedLayer
});

const mapDispatchToProps = (dispatch) => ({
    selectLayer: (layer) => {
        dispatch(selectLayer(layer));
    },
    toggleVisibility: (container, visibility) => {
        dispatch(toggleVisibility(container, visibility));
    }
});

@connect(
    mapStateToProps,
    mapDispatchToProps
)
export default class TLPanelBody extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            containers: this.props.map.containers,
            selectedLayer: null,
            isBadgeHovered: false
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.map.containers && !shallowEquals(nextProps.map.containers, this.state.containers)) {
            this.setState({
                containers: nextProps.map.containers
            });
        }
    }

    render() {
        return this.layersAction(this.state.containers);
    }

    layersAction = (containers) => {
        if (typeof containers === 'undefined' || shallowEquals(containers, null))
            return null;

        let accordion = this.createAccordionContainers(containers);

        return (
            <div style={styles.div}>
                <Accordion>
                    {accordion}
                </Accordion>
            </div>
        );
    }

    createAccordionContainers = (containers) => {
        let that = this;
        let accordionContainers = containers.sort(this._compare).map((container, idx) => {
            let { groups, layers, ...properties } = container;

            let accordionGroups = this.createAccordionGroups(groups);

            let accordionLayers = this.createAccordionLayers(layers);

            let key = properties.id + properties.name;

            let title = (<span className='tl-toc' title={properties.descr}>{properties.descr}</span>);
            let badge = this.createBadge(key, container, layers, properties);
            return (
                <TLPanelItem key={key} idx={idx} title={title} badge={badge} bsStyle='primary' defaultExpanded={false}>
                    {accordionGroups}
                    {accordionLayers}
                </TLPanelItem>
            )
        });

        return accordionContainers;
    }

    createAccordionGroups = (groups) => {
        let that = this;
        let accordionGroups = groups.sort(this._compare).map((group, idx) => {
            let { layers, ...properties } = group;

            let accordionLayers = layers.filter(this._filterIsLegendLayer).sort((a, b) => { return this._compare(a, b); }).map((layer, idx) => {
                let key = layer.id;
                return (
                    <TLPanelListItem key={key} active={this.state.selectedLayer === layer} onClick={(e) => this._handleLayerClick(e, key, layer)} layer={layer} handleToggleVisibility={this._handleToggleVisibility} />
                )
            });

            let key = properties.id + properties.name;

            accordionLayers = (
                <ListGroup fill style={styles.listGroup}>
                    {accordionLayers}
                </ListGroup>
            );

            let title = (<span className='tl-toc' title={properties.descr}>{properties.descr}</span>);
            let badge = this.createBadge(key, [], layers, properties);
            return (
                <TLPanelItem key={key} idx={idx} title={title} badge={badge} bsStyle='info' defaultExpanded={false}>
                    {accordionLayers}
                </TLPanelItem>
            );
        });
        return accordionGroups
    }

    createAccordionLayers = (layers) => {
        let that = this;
        let accordionLayers = layers.filter(this._filterIsLegendLayer).sort((a, b) => { return this._compare(a, b); }).map((layer, idx) => {
            let key = layer.id;
            return (
                <Panel key={key} header={null} bsStyle='info'>
                    <ListGroup fill style={styles.listGroup}>
                        <TLPanelListItem key={key} active={this.state.selectedLayer === layer} onClick={(e) => this._handleLayerClick(e, key, layer)} layer={layer} handleToggleVisibility={this._handleToggleVisibility} />
                    </ListGroup>
                </Panel >
            );
        });

        return accordionLayers;
    }

    createBadge = (key, container, layers, properties) => {
        const layersCount = layers.length;
        const isVisible = container.is_visible == 'true';
        const isOther = container.name == 'Other'
        return (
            <TLPanelBadge handleBadgeClick={(e) => { !isOther ? this._handleToggleVisibility(e, container, isVisible) : е.preventDefault() }} tooltipText={isOther ? 'Брой слоеве' : 'Видимост (брой слоеве)'} right={true}>
                {isOther
                    ? null
                    : <span><FontAwesome name={(isVisible) ? 'eye' : 'eye-slash'} />&nbsp;</span>
                }
                {layersCount}
            </TLPanelBadge>
        );
    }

    _handleToggleVisibility = (e, container, visibility) => {
        e.preventDefault();
        e.stopPropagation();

        this.props.toggleVisibility(container, visibility);
    }

    _handleLayerClick = (e, key, layer) => {
        const isActive = (this.state.selectedLayer === layer);
        let selectedLayer = null;
        if (!isActive) {
            selectedLayer = layer;
        }

        this.setState({
            selectedLayer: selectedLayer
        });
        this.props.selectLayer(selectedLayer);
    }

    _layersCount = (layers, groups, filter) => {
        let layersCount = (layers) ? layers.filter(this._filterIsLegendLayer).filter(filter).length : 0;
        if (groups && groups.length) {
            groups.forEach((group) => {
                layersCount += group.layers.filter(this._filterIsLegendLayer).filter(filter).length;
            });
        }
        return layersCount;
    }

    _filterIsVisible = (layer) => {
        return layer.is_visible == 'true';
    }


    _filterIsLegendLayer = (layer) => {
        return layer.is_legend_layer == 'true';
    }

    _compareLayers = (a, b) => {
        return parseInt(b.z_order) - parseInt(a.z_order);
    }

    _compare = (a, b) => {
        return parseInt(a.z_order) - parseInt(b.z_order);
    }

    _handleBadgeEnter = (e) => {
        this.setState({
            isBadgeHovered: !this.state.isBadgeHovered
        })
    }
    _handleBadgeLeave = (e) => {
        this.setState({
            isBadgeHovered: !this.state.isBadgeHovered
        })
    }
};