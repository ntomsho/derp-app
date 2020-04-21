import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import { Link } from 'react-router-dom';
import SignUpForm from './signup_form';
import SignInForm from './login_form';

const Home = (props) => {

    const sessionForms = () => {
        return (
            <Row xs={1} md={2}>
                <Col>
                    <h3 className="text-center">Log In</h3>
                    <Row className="justify-content-center">
                        <SignInForm setLoggedIn={props.setLoggedInUser} />
                    </Row>
                </Col>
                <Col>
                    <h3 className="text-center">Create Account</h3>
                    <Row className="justify-content-center">
                    <SignUpForm setLoggedIn={props.setLoggedInUser} />
                    </Row>
                </Col>
            </Row>
        )
    }

    return (
        <Container fluid className="bg-light">
            <Container className="py-5 justify-content-center align-items-center">
                <Row className="justify-content-center">
                    <h1>The DERP</h1>
                </Row>
                <Row className="justify-content-center">
                    <h3 className="m-0">(Dangerously Eccentric Roleplaying)</h3>
                </Row>
                <Row className="justify-content-center">
                    <h1>System</h1>
                </Row>
            </Container>
            <Container>
                    {props.loggedInUser ? 
                    <>
                    <Row className="justify-content-center">
                        <h1>Select Game</h1>
                    </Row>
                    <CardGroup>
                        <Card className="ged-color mr-1">
                            <Link className="ged-color text-center" to="/ged">
                                <Card.Body>
                                    <Card.Title>
                                        <h1 className="display-3 mb-0">GED</h1><h2>Guild of <s>Expert</s> Expendable Dungeoneers</h2>
                                    </Card.Title>
                                    <h3>A game of dangerous idiots on fantasy adventures</h3>
                                </Card.Body>
                            </Link>
                        </Card>
                        <Card className="gps ml-1 border-left">
                            <Link disabled to="#" className="text-center">
                                <Card.Body>
                                    <Card.Title>
                                        <h1 className="gps display-3 mb-0">GPS</h1><h2 className="gps">Galactic Parcel Service</h2>
                                    </Card.Title>
                                    <h3 className="gps">Coming soon(ish)</h3>
                                </Card.Body>
                            </Link>
                        </Card>
                    </CardGroup>
                    </> :
                    <>
                    <Row className="row-reverse-sm">
                        <Col xs={12} md={6} className="mb-4 mb-md-0">
                            {sessionForms()}
                        </Col>
                        <Col xs={12} md={6}>
                            <p>Welcome to the official character generator and campaign tool for DERP System tabletop roleplaying games.</p>
                            <p>Use this app to create characters and manage campaigns in your favorite DERP System games.</p>
                            <p>Sign up today!</p>
                            <p>Or don't. I'm not your dad.</p>
                        </Col>
                    </Row>
                    </>}
            </Container>
        </Container>
    )
}

export default Home;
