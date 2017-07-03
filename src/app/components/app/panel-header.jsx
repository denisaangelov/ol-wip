import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

const styles = {
    header: {
        backgroundColor: '#ffffff',
        color: 'rgb(39, 91, 157)',
        padding: '4px',
        fontSize: '16px',
        textAlign: 'center'
    },
    title: {
        padding: '0 8px 0 8px'
    },
    span: {
        cursor: 'pointer'
    }
};

const TLPanelHeader = (props) => {
    const rootStyle = props.style ? { ...styles.root, ...props.style } : styles.root;

    return (
        <div style={styles.header}>
            <h4 style={styles.title}>
                <span id={props.position == 'right' ? 'markersHeader' : ''}>{props.title}</span>
                <OverlayTrigger placement={props.position} overlay={<Tooltip id='closePanel'>Затвори</Tooltip>}>
                    <span className={`pull-${props.position == "left" ? "right" : "left"}`} style={styles.span} role="button" onClick={props.handleToggleDocked}>
                        <FontAwesome name={`chevron-${props.position}`} size='lg' />
                    </span>
                </OverlayTrigger>
            </h4>
        </div>
    );
};

// PanelHeader.propTypes = {
//     style: React.PropTypes.object,
//     title: React.PropTypes.oneOfType([
//         React.PropTypes.string,
//         React.PropTypes.object,
//     ]),
//     children: React.PropTypes.object,
// };

export default TLPanelHeader;