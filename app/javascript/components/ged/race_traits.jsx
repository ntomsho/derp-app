import React from 'react';
import { random, RACE_TRAITS } from '../../dndb-tables';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function RaceTraits(props) {
    
    function updateTraits(event) {
        let newTraits = props.raceTraits;
        newTraits[parseInt(event.target.name)] = event.target.value;
        props.updateState('raceTraits', newTraits);
    }
    
    if (props.raceString !== "Human") {
        return (
            <Container>
                <Row>
                    <h3>Race Traits</h3>
                </Row>
                <Row>
                <em>You gain Magic Advantage on any rolls where either of these is helpful.</em>
                </Row>
                <Row className="justify-content-center">
                    <Col>
                    <InputGroup>
                        <Form.Control name="0" onChange={updateTraits} value={props.raceTraits[0] || ""}></Form.Control>
                        <InputGroup.Append>
                            <Button variant="dark" onClick={() => props.updateState('raceTraits', [random(RACE_TRAITS), props.raceTraits[1] || ""])}>🎲</Button>
                        </InputGroup.Append>
                    </InputGroup>
                    </Col>
                    <Col>
                    <InputGroup>
                        <Form.Control name="1" onChange={updateTraits} value={props.raceTraits[1] || ""}></Form.Control>
                        <InputGroup.Append>
                            <Button variant="dark" onClick={() => props.updateState('raceTraits', [props.raceTraits[0] || "", random(RACE_TRAITS)])}>🎲</Button>
                        </InputGroup.Append>
                    </InputGroup>
                    </Col>
                </Row>
            </Container>
        )
    } else {
        return null
    }
}