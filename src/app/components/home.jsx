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
    }
    render() {
        const result = this.props.currentUser.id
            ?
            (
                <Grid>
                    <Row>
                        <Jumbotron>
                            <h3>Здравейте, <b>{this.props.currentUser.name}</b></h3>
                            <p>Добре дошли!</p>
                        </Jumbotron>
                    </Row>
                    <Row>
                        <Col sm={1} md={1} lg={1}></Col>
                        <Col sm={5} md={5} lg={5}>
                            <LinkContainer to="/map">
                                <Thumbnail src="src/app/assets/img/home/map.png" alt="128x128">
                                    <h3>Map</h3>
                                    <p>Карта</p>
                                </Thumbnail>
                            </LinkContainer>
                        </Col>
                        <Col sm={5} md={5} lg={5}>
                            <LinkContainer to="/about">
                                <Thumbnail src="src/app/assets/img/home/about.png" alt="128x128">
                                    <h3>About</h3>
                                    <p>За мен</p>
                                </Thumbnail>
                            </LinkContainer>
                        </Col>
                        <Col sm={1} md={1} lg={1}></Col>
                    </Row>
                    <Row>
                        <Col sm={1} md={1} lg={1}></Col>
                        <Col sm={5} md={5} lg={5}>
                            <LinkContainer to="/profile">
                                <Thumbnail src="src/app/assets/img/home/edit.png" alt="128x128">
                                    <h3>Profile</h3>
                                    <p>Редакция на профил</p>
                                </Thumbnail>
                            </LinkContainer>
                        </Col>
                        <Col sm={5} md={5} lg={5}>
                            <LinkContainer to="/logout">
                                <Thumbnail src="src/app/assets/img/home/logout.png" alt="128x128">
                                    <h3>Logout</h3>
                                    <p>Изход от системата</p>
                                </Thumbnail>
                            </LinkContainer>
                        </Col>
                        <Col sm={1} md={1} lg={1}></Col>
                    </Row>
                </Grid >
            )
            :
            (
                <Grid>
                    <Row>
                        <Jumbotron>
                            <h3><b>Welcome!</b></h3>
                        </Jumbotron>
                    </Row>
                    <Row>
                        <Col sm={1} md={1} lg={1}></Col>
                        <Col sm={5} md={5} lg={5}>
                            <LinkContainer to="/login">
                                <Thumbnail src="src/app/assets/img/home/login1.png" alt="128x128">
                                    <h3>Login</h3>
                                    <p>Вход в системата</p>
                                </Thumbnail>
                            </LinkContainer>
                        </Col>
                        <Col sm={5} md={5} lg={5}>
                            <LinkContainer to="/signup">
                                <Thumbnail src="src/app/assets/img/home/signup.png" alt="128x128">
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
                                <Thumbnail src="src/app/assets/img/home/map.png" alt="128x128">
                                    <h3>Map</h3>
                                    <p>Карта</p>
                                </Thumbnail>
                            </LinkContainer>
                        </Col>
                        <Col sm={5} md={5} lg={5}>
                            <LinkContainer to="/about">
                                <Thumbnail src="src/app/assets/img/home/about.png" alt="128x128">
                                    <h3>About</h3>
                                    <p>За мен</p>
                                </Thumbnail>
                            </LinkContainer>
                        </Col>
                        <Col sm={1} md={1} lg={1}></Col>
                    </Row>
                </Grid>
            )
        return (result);
    }
}