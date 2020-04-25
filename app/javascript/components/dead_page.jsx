import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

const DeadPage = () => {
    return (
        <Container>
            <Row className="justify-content-center">
                <h1>The DERP</h1>
            </Row>
            <Row className="justify-content-center">
                <h3 className="m-0">(Dangerously Eccentric Roleplaying)</h3>
            </Row>
            <Row className="justify-content-center">
                <h1>System</h1>
            </Row>
            <Row className="justify-content-center"><h2>404 - Page Not Found</h2></Row>
            <Row className="justify-content-center">
                <p className="grenze">
                    Oh my--what did you do?! Look--Look at this. Look at this URL. Where even are we?
                </p>
                <p className="grenze">
                    I have no idea what page this is even supposed to be. A character page? Netflix? I don't have the slightest clue.
                </p>
                <p className="grenze">
                    What are you waiting for? Go back! Go back!
                </p>
            </Row>
        </Container>
    )
}

export default DeadPage;