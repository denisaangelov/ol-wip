import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { ButtonToolbar, Button, Form, FormGroup, Alert } from 'react-bootstrap';

import axios from 'axios';

import FieldGroup from './common/field-group';
import shallowEquals from '../common/utils/shallow-equals';

import { currentUser } from '../actions';

const styles = {
    form: {
        padding: 15
    },
    label: {
        margin: 10
    }

}

@connect(
    state => ({
        currentUser: state.currentUser
    }),
    dispatch => ({
        loginUser: (user) => {
            dispatch(currentUser(user));
            dispatch(push('/'));
        }
    })
)
export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            errorMessage: '',
            showError: false
        };
    }

    render() {
        return (
            <Form className="col-sm-5 col-md-5 col-lg-5" style={styles.form}>
                {<FieldGroup id='loginUsername' label='Username' type='text' placeholder="Enter username..." value={this.state.username} onChange={(e) => this._handleChange(e, 'username')} />}
                {<FieldGroup id='loginPassword' label='Password' type='password' placeholder="Enter password..." value={this.state.password} onChange={(e) => this._handleChange(e, 'password')} />}

                <ButtonToolbar>
                    <Button type="submit" bsStyle="success" onClick={(e) => this._handleSubmit(e)}>
                        Log in
                    </Button>
                    <Button type="reset" bsStyle="warning" onClick={(e) => this._handleReset(e)}>
                        Reset
                    </Button>
                    {/*<Button type="button" bsStyle="danger" onClick={(e) => this.props.handleCancel(e)}>
                        Cancel
                    </Button>*/}
                </ButtonToolbar>

                {this.state.showError
                    ?
                    <Alert bsStyle='danger' style={styles.label} onDismiss={(e) => { this.setState({ showError: false }); }}>
                        <h4>Attention!</h4>
                        <p>{this.state.errorMessage}</p>
                    </Alert>
                    : null
                }
            </Form>
        );
    }

    _handleChange = (e, field) => {
        this.setState({
            [field]: e.target.value
        });
    }

    _handleSubmit = (e) => {
        e.preventDefault();
        axios.get('/api/users', { params: { username: this.state.username } })
            .then((response) => {
                let params = Object.assign({}, response.data, { confirmPassword: this.state.password });
                axios.post('/api/users/login', params)
                    .then((response) => {
                        this._handleReset(e);
                        this.props.loginUser(response.data);
                    }).catch((error) => {
                        this.setState({
                            errorMessage: error.response.data.message,
                            showError: true
                        });
                    });
            })
            .catch((error) => {
                this.setState({
                    errorMessage: error.response.data.message,
                    showError: true
                });
            });
    }

    _handleReset = (e) => {
        this.setState({
            username: '',
            password: '',
            showError: false
        });
    }
}