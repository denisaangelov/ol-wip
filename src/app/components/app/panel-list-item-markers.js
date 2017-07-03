import React from 'react';
import ReactDOM from 'react-dom'
import { ListGroupItem, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import shallowEquals from '../../common/utils/shallow-equals';

const styles = {
    div: {
        width: '100%',
        minHeight: '20px',
        cursor: 'pointer'
    }
}
export default class TLPanelListItem extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            active: this.props.active
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!shallowEquals(nextProps.doScroll, this.state.doScroll) && nextProps.doScroll && nextProps.active) {
            let container = $('#tl-panel-right').find('.tl-sidebar');
            let scrollTo = $(ReactDOM.findDOMNode(this.item));

            setTimeout(() => {
                container.animate({
                    scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
                });
            }, 200);
        }
    }

    render() {
        const propertyKeys = Object.keys(this.props.feature.properties);
        const fieldList = (this.props.layer.label_field_list).replace(/\s+/g, '').split(',');

        let title = new String("");
        const items = fieldList.map((field, idx) => {
            const key = field + idx;
            title = title.concat(this.props.feature.properties[field]).concat(" ");
            return (<span key={key}>{this.props.feature.properties[field]}&nbsp;</span>);
        });
        return (
            <ListGroupItem active={this.props.active} ref={(item) => { this.item = item; }}>
                <div onClick={this.props.handleObjectClick} style={styles.div}>
                    <span className='tl-toc' title={title}>{items}</span>
                    <OverlayTrigger placement='top' overlay={<Tooltip id='zoomToObject'>Приближи към обект</Tooltip>}>
                        <Button bsSize='xs' className='pull-right' onClick={this.props.handleZoomToObject}>
                            <FontAwesome name="expand" size='lg' />
                        </Button>
                    </OverlayTrigger>
                    &nbsp;
                    <OverlayTrigger placement='top' overlay={<Tooltip id='info'>Информация</Tooltip>}>
                        <Button bsSize='xs' className='pull-right' onClick={this.props.handleFeatureInfo}>
                            <FontAwesome name="info-circle" size='lg' />
                        </Button>
                    </OverlayTrigger>
                </div>
            </ListGroupItem >
        )
    }
}