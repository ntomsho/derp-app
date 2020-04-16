import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import SignUpForm from './signup_form';
import SignInForm from './login_form';

const Home = (props) => {
    // This loggedIn setup doesn't rerender the navbar, needs to be a single solution
    // const [loggedInUser, setLoggedInUser] = useState(window.currentUser || null);

    const sessionForms = () => {
        return (
            <Row>
                <Col>
                    <h3>Log In</h3>
                    <Row>
                        <SignInForm setLoggedIn={props.setLoggedInUser} />
                    </Row>
                    <br/>
                    <h3>Create Account</h3>
                    <Row>
                    <SignUpForm setLoggedIn={props.setLoggedInUser} />
                    </Row>
                </Col>
            </Row>
        )
    }

    return (
        <Container fluid className="full-height bg-light">
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
                    <Row>
                        <h3>Select Game</h3>
                    </Row>
                    <Row>
                        <Col>
                            <Link to="/ged">
                                <button className="button" id="dnd-button">
                                    <h2>GED</h2> <br /> <h3>Guild of Expendable Dungeoneers</h3>
                                </button>
                            </Link>
                        </Col>
                    </Row>
                    </> :
                    <>
                    <Row className="row-reverse-sm">
                        <Col xs={12} md={6} className="mb-4 mb-md-0">
                            {sessionForms()}
                        </Col>
                        <Col xs={12} md={6}>
                            <p>Welcome to the official character generator and campaign tool for the DERP System.</p>
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
