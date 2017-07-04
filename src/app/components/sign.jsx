import React from 'react';
import { connect } from 'react-redux';

import { ButtonToolbar, Button, Form, FormGroup, Alert } from 'react-bootstrap';

import axios from 'axios';

import FieldGroup from './common/field-group';
import shallowEquals from '../common/utils/shallow-equals';
import { getUsers } from '../actions';

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
        getUsers: () => {
            axios.get('/api/users/')
                .then((response) => {
                    dispatch(getUsers(response.data));
                })
        }
    })
)
export default class Sign extends React.Component {
    static propTypes = {
    };

    constructor(props) {
        super(props);
        this.state = {
            user: {
                name: '',
                email: '',
                username: '',
                password: '',
                confirmPassword: '',
                role: 'PUBLIC'
            },
            requestType: 'post',
            message: '',
            showError: false,
            showSuccess: false
        };
    }

    componentDidMount() {
        if (this.props.currentUser.id) {
            this.setState({
                user: Object.assign({}, this.state.user, this.props.currentUser),
                requestType: 'put'
            });
        }
    }

    componentWillReceiveProps(nextProps) {
    }

    render() {
        return (
            <Form className="col-sm-5 col-md-5 col-lg-5" style={styles.form}>
                {<FieldGroup id='loginName' label='Name' type='text' placeholder="Enter name..." value={this.state.user.name} onChange={(e) => this._handleChange(e, 'name')} />}
                {<FieldGroup id='loginEmail' label='Email' type='email' placeholder="Enter email..." value={this.state.user.email} onChange={(e) => this._handleChange(e, 'email')} />}
                {<FieldGroup id='loginUsername' label='Username' type='text' placeholder="Enter username..." value={this.state.user.username} onChange={(e) => this._handleChange(e, 'username')} />}
                {<FieldGroup id='loginPassword' label='Password' type='password' placeholder="Enter password..." value={this.state.user.password} onChange={(e) => this._handleChange(e, 'password')} />}
                {<FieldGroup id='loginPasswordConfirm' label='Confirm password' type='password' placeholder="Confirm password..." value={this.state.user.confirmPassword} onChange={(e) => this._handleChange(e, 'confirmPassword')} />}

                <ButtonToolbar>
                    <Button type="submit" bsStyle="success" onClick={(e) => this._handleSubmit(e)}>
                        Submit
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
                        <p>{this.state.message}</p>
                    </Alert>
                    : null
                }
                {this.state.showSuccess
                    ?
                    <Alert bsStyle='success' style={styles.label} onDismiss={(e) => { this.setState({ showError: false }); }}>
                        <h4>Success!</h4>
                        <p>{this.state.message}</p>
                    </Alert>
                    : null
                }
            </Form>
        );
    }

    _handleChange = (e, field) => {
        this.setState({
            user: Object.assign({}, this.state.user, {
                [field]: e.target.value
            })
        });
    }

    _handleSubmit = (e, field) => {
        e.preventDefault();

        if (this.state.requestType === 'post')
            axios.post('/api/users', this.state.user)
                .then((response) => {
                    this._handleReset(e);
                    this.setState({
                        message: `You have sucessfuly creted user: ${response.data.username}`,
                        showSuccess: true
                    });
                    this.props.getUsers();
                })
                .catch((error) => {
                    this.setState({
                        message: error.response.data.message,
                        showError: true
                    });
                });
        else
            axios.put('/api/users/' + this.props.currentUser.id, this.state.user)
                .then((response) => {
                    // this._handleReset(e);
                    this.setState({
                        message: `You have sucessfuly updated your profile!`,
                        showSuccess: true
                    });
                    this.props.getUsers();
                })
                .catch((error) => {
                    this.setState({
                        message: error.response.data.message,
                        showError: true
                    });
                });
    }

    _handleReset = (e) => {
        this.setState({
            user: {
                name: '',
                email: '',
                username: '',
                password: '',
                confirmPassword: ''
            },
            message: '',
            showError: false,
            showSuccess: false
        });
    }
}