import React from 'react';
import { connect } from 'react-redux';

import { ButtonToolbar, Button, Form, FormGroup, Alert } from 'react-bootstrap';

import axios from 'axios';

import FieldGroup from './common/field-group';
import shallowEquals from '../common/utils/shallow-equals';

import { logout } from '../actions';

const styles = {
    form: {
        padding: 15
    },
    alert: {
        margin: 15
    }
}

@connect(
    state => ({
        currentUser: state.currentUser
    }),
    dispatch => ({
        logout: () => {
            dispatch(logout());
        }
    })
)
export default class Logout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount = () => {
        this.props.logout();
    }

    render() {
        return (
            <Alert bsStyle='success' style={styles.alert} onDismiss={(e) => { this.setState({ showError: false }); }}>
                <h4>Attention!</h4>
                <p>Успешно излязохте от системата!</p>
                <p>
                    <Button onClick={this._handleButton}>OK!</Button>
                </p>
            </Alert>
        );
    }

    _handleButton = (e) => {
        e.preventDefault();
    }
}