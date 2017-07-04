import React from 'react';
import { Panel } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import shallowEquals from '../../common/utils/shallow-equals';
const styles = {
    div: {
        padding: '4px'
    },
    h4: {
        cursor: 'pointer'
    },
    arrow: {
        float: 'right'
    },
    listGroup: {
        marginBottom: 0
    },
    inverse: {
        color: '#444'
    }
};
export default class TLPanelItem extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            expanded: this.props.defaultExpanded,
            isIconHovered: false
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ expanded: nextProps.defaultExpanded });
    }

    render() {
        let header = (
            <h4 style={styles.h4} onMouseOver={(e) => { this._onMouseOver(e); }} onMouseLeave={(e) => { this._onMouseLeave(e); }}>
                <div style={{ width: '100%' }}>
                    {this.props.title}
                    <FontAwesome name={`angle-double-${this.state.expanded ? 'up' : 'down'}`} size='lg' className='pull-right' style={(this.state.isIconHovered && this.props.bsStyle === 'primary') ? styles.inverse : {}} inverse={this.state.isIconHovered} />
                    {this.props.badge}
                    {this.props.info}
                </div>
            </h4>
        );
        return (
            <Panel header={header} eventKey={this.props.idx} bsStyle={this.props.bsStyle} collapsible={true} defaultExpanded={this.state.expanded} expanded={this.state.expanded} onSelect={(e) => this._handleOnClick(e)}>
                {this.props.children}
            </Panel>
        )
    }

    _isVisible = (layer) => {
        return layer.is_visible == 'true';
    }

    _handleOnClick = (e) => {
        this.setState({
            expanded: !this.state.expanded
        });
    }

    _onMouseOver = (e) => {
        if (e.target.className.indexOf('badge') > -1
            || e.target.parentElement.className.indexOf('badge') > -1
            || e.target.className.indexOf('featuresInfoBtn') > -1
            || e.target.parentElement.className.indexOf('featuresInfoBtn') > -1) {
            this.setState({
                isIconHovered: false
            });
            $(e.currentTarget).find('.tl-toc').css({ 'text-decoration-line': '' });
            return;
        }
        $(e.currentTarget).find('.tl-toc').css({ 'text-decoration-line': 'underline' });
        this.setState({
            isIconHovered: true
        });
    }

    _onMouseLeave = (e) => {
        $(e.currentTarget).find('.tl-toc').css({ 'text-decoration-line': '' });
        this.setState({
            isIconHovered: false
        });
    }
}