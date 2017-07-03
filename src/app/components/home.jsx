import React from 'react';
import { connect } from 'react-redux';

@connect(
    state => ({
        currentUser: state.currentUser
    }),
    dispatch => ({
    })
)
export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
    }
    render() {
        return (
            <div>
                <h2>Здравей, <b>{this.props.currentUser.name}</b></h2>
            </div>);
    }
}