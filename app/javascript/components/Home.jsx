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
            <>
            <Col>
                <h3>Returning?</h3>
                <SignInForm setLoggedIn={props.setLoggedInUser} />
            </Col>
            <Col>
                <h3>Create Account</h3>
                <SignUpForm setLoggedIn={props.setLoggedInUser} />
            </Col>
            </>
        )
    }

    return (
        <Container fluid className="full-height bg-light">
            <Container className="py-5 justify-content-center align-items-center">
                <Row className="justify-content-center">
                    <h1>The DERP</h1>
                </Row>
                <Row className="justify-content-center">
                    <h3 className="m-0">(Dangerously <s>Erotic</s> Eccentric Roleplaying)</h3>
                </Row>
                <Row className="justify-content-center">
                    <h1>System</h1>
                </Row>
            </Container>
            <Container fluid>
                <Row>
                    {props.loggedInUser ? 
                        <Col>
                            <Link to="/ged">
                                <button className="button" id="dnd-button">
                                    <h2>GED</h2> <br /> <h3>Guild of Expendable Dungeoneers</h3>
                                </button>
                            </Link>
                        </Col> :
                        sessionForms()}
                </Row>
            </Container>
        </Container>
    )
}

export default Home;
