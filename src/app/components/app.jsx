import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import axios from 'axios';

import Header from './header';
import Container from './route-container';
import { getUsers } from '../actions';

@withRouter
@connect(
    state => ({
        currentUser: state.currentUser,
        users: state.users
    }),
    dispatch => ({
        getUsers: () => {
            return axios.get('/api/users')
                .then((response) => {
                    dispatch(getUsers(response.data));
                })
        }
    })
)
class App extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.getUsers();
    }

    render() {
        return (
            <div>
                <Header />
                <Container />
            </div>
        );
    }
}

export default App;
