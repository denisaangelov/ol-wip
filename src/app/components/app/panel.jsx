import React from "react";
import { Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import FontAwesome from 'react-fontawesome';
import Sidebar from "react-sidebar";

import TLPanelContent from './panel-content';

const tooltipOpen = (
    <Tooltip id="tooltipOpen">Отвори</Tooltip>
);
const tooltipClose = (
    <Tooltip id="tooltipClose">Затвори</Tooltip>
);

export default class TLPanel extends React.Component {
    constructor(props) {
        const styles = {
            root: {
                top: 50,
            },
            sidebar: {
                width: '384px',
                height: '100%',
                opacity: '0.9',
                backgroundColor: 'white'
            },
            content: {
                display: 'inline-block',
                right: props.pullRight ? '0px' : '',
                bottom: '',
                left: props.pullRight ? '' : '0px',
                zIndex: 1,
                overflow: 'hidden'
            },
            buttonOpen: {
                opacity: '0.9',
                borderTopLeftRadius: '0px',
                borderTopRightRadius: '0px',
                borderBottomLeftRadius: props.pullRight ? '6px' : '0px',
                borderBottomRightRadius: props.pullRight ? '0px' : '6px',
                color: 'rgb(39, 91, 157)',
                borderTop: 0
            }
        };

        super(props);
        this.state = {
            docked: props.docked,
            pullRight: props.pullRight,
            sidebar: (<TLPanelContent position={props.pullRight ? "right" : "left"} handleToggleDocked={this.toggleDocked} {...props} />), //title={props.title} data={props.data} action={props.action}
            styles: styles,
            touchHandleWidth: 0,
            onSetOpen: this.handleSetOpen
        }
        this.id = props.id;
        this.styles = styles;
    }

    componentWillMount = () => {
        const mql = window.matchMedia(`(min-width: 768px)`);
        mql.addListener(this.mediaQueryChanged);
        this.setState({
            mql: mql
        });
    }

    componentDidMount = () => {
        this.mediaQueryChanged();
    }

    componentWillUnmount = () => {
        this.state.mql.removeListener(this.mediaQueryChanged);
    }

    mediaQueryChanged = () => {
        let styles = this.state.styles;
        let touchHandleWidth = 0;
        if (this.state.mql.matches) {
             styles.root = { top: 50 }
        } else {
             styles.root = { top: 100 }
             touchHandleWidth = 10;
        }
        this.setState({
            styles: styles,
            touchHandleWidth: touchHandleWidth
        });
    }

    toggleDocked = (ev) => {
        this.setState({
            docked: !this.state.docked
        });

        if (ev) {
            ev.preventDefault();
            let target = ev.currentTarget;
            target.blur();
        }
    }
    
    handleSetOpen = (ev) => {
        this.setState({
            docked: !this.state.docked
        });
    }

    render() {
        return (
            <div id={this.id}>
                <Sidebar {...this.state} sidebarClassName='tl-sidebar'>
                    <OverlayTrigger placement={this.state.pullRight ? 'left' : 'right'} overlay={this.state.docked ? tooltipClose : tooltipOpen}>
                        <Button className={`${this.state.pullRight ? 'pull-right' : ''} ${this.state.docked ? 'hidden' : ''}`} style={this.state.styles.buttonOpen} onClick={this.toggleDocked}>
                            <FontAwesome name={this.state.pullRight ? (this.state.docked ? 'chevron-right' : 'chevron-left') : (this.state.docked ? 'chevron-left' : 'chevron-right')} size='lg' />
                        </Button>
                    </OverlayTrigger>
                </Sidebar>
            </div>
        );
    }
}