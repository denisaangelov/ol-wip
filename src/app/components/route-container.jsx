import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Route } from 'react-router';

import Home from './home';
import TLMap from './map-container';
import Sign from './sign';
import Login from './login';
import About from './about';
import Logout from './logout';

@withRouter
@connect()
export default class Container extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='container'>
                <div className='row'>
                    <Route exact path="/" component={Home} />
                    {/*<Route path="/post/:id?" component={Post} />*/}
                    <Route path="/map" component={TLMap} />
                    <Route path="/login" component={Login} />
                    <Route path="/signup" component={Sign} />
                    <Route path="/about" component={About} />
                    <Route path="/logout" component={Logout} />
                </div>
            </div>
        );
    }
};