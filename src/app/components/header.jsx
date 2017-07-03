import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import shallowEquals from '../common/utils/shallow-equals';
const styles = {
    navbar: {
        marginBottom: 0
    },
    nav: {
        width: '100%'
    }
}
@connect(
    state => ({
        currentUser: state.currentUser
    }),
    dispatch => ({
    })
)
export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: this.props.currentUser
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.currentUser && !shallowEquals(nextProps.currentUser, this.state.currentUser)) {
            this.setState({
                currentUser: nextProps.currentUser
            });
        }
    }

    render() {
        return (
            <Navbar inverse collapseOnSelect staticTop style={styles.navbar}>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to="/">Home</Link>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <LinkContainer to="/map">
                            <NavItem eventKey={2}>Map</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/about">
                            <NavItem eventKey={3}>About</NavItem>
                        </LinkContainer>
                    </Nav>
                    {this.state.currentUser.id === 0
                        ?
                        <Nav pullRight>
                            <LinkContainer to="/login">
                                <NavItem eventKey={5}>Log in</NavItem>
                            </LinkContainer>
                            <LinkContainer to="/signup">
                                <NavItem eventKey={6}>Sign up</NavItem>
                            </LinkContainer>
                        </Nav>
                        : null
                    }
                    {this.state.currentUser.id !== 0
                        ?
                        <Nav pullRight>
                            <NavItem><FontAwesome name='user-circle' /> <b>{this.props.currentUser.name}</b></NavItem>
                            <LinkContainer to="/logout">
                                <NavItem eventKey={7}>Logout</NavItem>
                            </LinkContainer>
                        </Nav>
                        : null
                    }
                </Navbar.Collapse>
            </Navbar>
        );
    }
};