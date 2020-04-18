import React, {useState} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { random, BACKGROUNDS, APPEARANCES, DERPS } from '../../dndb-tables';

export default function CharGenDetails(props) {

    function handleChange(event) {
        props.updateSelection(event.target.name, event.target.value, false);
    }

    function randomizeField(field, table) {
        if (props.rerolls > 0) {
            props.updateSelection(field, random(table), true);
        }
    }
    
    return (
        <Container className="mt-3">
            <Row className="my-1">
                <InputGroup>
                    <InputGroup.Prepend><InputGroup.Text>Background</InputGroup.Text></InputGroup.Prepend>
                    <Form.Control onChange={handleChange} type="text" name="background" value={props.background} placeholder="Background"></Form.Control>
                    <InputGroup.Append>
                        <Button variant="outline-dark" onClick={() => randomizeField('background', BACKGROUNDS)}>Reroll</Button>
                    </InputGroup.Append>
                </InputGroup>
                <Form.Label>What you did before adventuring</Form.Label>
            </Row>
            <Row className="my-1">
                <InputGroup>
                    <InputGroup.Prepend><InputGroup.Text>Appearance</InputGroup.Text></InputGroup.Prepend>
                    <Form.Control onChange={handleChange} type="text" name="appearance" value={props.appearance} placeholder="Appearance"></Form.Control>
                    <InputGroup.Append>
                        <Button variant="outline-dark" onClick={() => randomizeField('appearance', APPEARANCES)}>Reroll</Button>
                    </InputGroup.Append>
                </InputGroup>
                <Form.Label>What you look like</Form.Label>
            </Row>
            <Row className="my-1">
                <InputGroup>
                    <InputGroup.Prepend><InputGroup.Text>Derp</InputGroup.Text></InputGroup.Prepend>
                    <Form.Control onChange={handleChange} type="text" name="derp" value={props.derp} placeholder="Derp"></Form.Control>
                    <InputGroup.Append>
                        <Button variant="outline-dark" onClick={() => randomizeField('derp', DERPS)}>Reroll</Button>
                    </InputGroup.Append>
                </InputGroup>
                <Form.Label>Why you should never have been trusted to do this job</Form.Label>
            </Row>
        </Container>
    )
}