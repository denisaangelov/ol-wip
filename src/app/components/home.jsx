import React from 'react';
import { connect } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Grid, Row, Col, Jumbotron, Thumbnail, Button } from 'react-bootstrap';

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
            <Grid>
                <Row>
                    <Jumbotron>
                        <h3>Здравей, <b>{this.props.currentUser.name}</b></h3>
                        <p>Добре дошъл!</p>
                    </Jumbotron>
                </Row>
                <Row>
                    <Col sm={1} md={1} lg={1}></Col>
                    <Col sm={5} md={5} lg={5}>
                        <LinkContainer to="/login">
                            <Thumbnail src="src/app/assets/img/home/login.png" alt="200x200">
                                <h3>Login</h3>
                                <p>Вход в системата</p>
                            </Thumbnail>
                        </LinkContainer>
                    </Col>
                    <Col sm={5} md={5} lg={5}>
                        <LinkContainer to="/signup">
                            <Thumbnail src="src/app/assets/img/home/signup.png" alt="200x200">
                                <h3>Signup</h3>
                                <p>Регистрация</p>
                            </Thumbnail>
                        </LinkContainer>
                    </Col>
                    <Col sm={1} md={1} lg={1}></Col>
                </Row>
                <Row>
                    <Col sm={1} md={1} lg={1}></Col>
                    <Col sm={5} md={5} lg={5}>
                        <LinkContainer to="/map">
                            <Thumbnail src="src/app/assets/img/home/map.png" alt="200x200">
                                <h3>Map</h3>
                                <p>Карта</p>
                            </Thumbnail>
                        </LinkContainer>
                    </Col>
                    <Col sm={5} md={5} lg={5}>
                        <LinkContainer to="/about">
                            <Thumbnail src="src/app/assets/img/home/about.png" alt="200x200">
                                <h3>About</h3>
                                <p>За мен</p>
                            </Thumbnail>
                        </LinkContainer>
                    </Col>
                    <Col sm={1} md={1} lg={1}></Col>
                </Row>
            </Grid>
        );
    }
}