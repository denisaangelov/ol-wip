import React from 'react';
import { Tooltip, OverlayTrigger, Badge } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

const styles = {
    badge: {
        border: '1px solid transparent'
    },
    badgeHovered: {
        border: '1px solid #adadad'
    }
};

export default class TLPanelBadge extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isBadgeHovered: false
        }
    }

    render() {
        return (
            <OverlayTrigger placement='top' overlay={<Tooltip id='tooltipBadge'>{this.props.tooltipText}</Tooltip>}>
                <Badge style={(this.state.isBadgeHovered) ? styles.badgeHovered : styles.badge} onClick={this.props.handleBadgeClick} onMouseEnter={(e) => { this._handleBadgeEnter(e); }} onMouseLeave={(e) => { this._handleBadgeLeave(e); }} pullRight={this.props.right} >
                    {this.props.children}
                </Badge>
            </OverlayTrigger>
        )
    }

    _handleBadgeEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();

        $(e.currentTarget).siblings('.tl-toc').css('text-decoration-line', '');
        this.setState({
            isBadgeHovered: !this.state.isBadgeHovered
        });
    }
    _handleBadgeLeave = (e) => {
        this.setState({
            isBadgeHovered: !this.state.isBadgeHovered
        });
    }
}