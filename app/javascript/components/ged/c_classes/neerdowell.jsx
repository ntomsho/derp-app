import React, { useState, useEffect } from 'react';
import { ROGUE_TRICKS } from '../../../dndb-tables';
import ClassDescription from '../class_description';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function Neerdowell(props) {
    const { currentSpecials } = props;
    const [cunningUsed, setCunningUsed] = useState(props.trainedSkill.includes("Creepin'"))
    const input = React.createRef();

    useEffect(() => {
        if (!currentSpecials.tricks) {
            createTricks();
        }
    })

    function createTricks() {
        let tricks = [];
        for (let i = 0; i < 4; i++) {
            let newTrick = random(ROGUE_TRICKS)
            while (tricks.includes(newTrick)) {
                newTrick = random(ROGUE_TRICKS);
            }
            tricks.push(newTrick);
        };
        props.updateState('currentSpecials', { 'tricks': tricks }, { rest: true })
    }

    function consumeTrick(trickInd) {
        let newTricks = currentSpecials.trick;
        const lostTrick = newTricks.splice(trickInd, 1);
        props.updateState('currentSpecials', { 'tricks': newTricks }, { lose_resource: { ind: ["tricks"], string: lostTrick } });
    }

    function addCustomTrick(randomize) {
        let newTricks = currentSpecials.tricks;
        const newTrick = randomize ? randomMagicTrick() : input.current.value;
        newTricks.push(newTrick);
        props.updateState('currentSpecials', { 'tricks': newTricks }, { gain_resource: { category: "Rogue Trick", string: newItem } })
    }

    function cunningDisplay() {
        
    }

    function tricksDisp() {
        if (currentSpecials.tricks) {
            return (
                <>
                <div className="grenze">Rogue Tricks</div>
                {currentSpecials.tricks.map((trick, i) => {
                    return (
                        <InputGroup key={i} className="my-1">
                            <InputGroup.Text className="w-75"><strong>{trick}</strong></InputGroup.Text>
                            <InputGroup.Append>
                                <Button variant="outline-dark" onClick={() => consumeTrick(i)}>Use</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    )
                })}
                </>
            )
        }
    }
    
    return (
        <Container>
            <Row>
                <em>A roguish thief with a vast collection of sneaky tricks and devices.</em>
            </Row>
            <Row>
                <Col xs={12} md={5} className="mt-3">
                    <ClassDescription>
                        <div>Magic Ability:<br /><strong>Rogue Tricks</strong></div>
                        <div>The ne'erdowell never leaves home without a seemingly bottomless bag of equipment, magic items, and tricks of their illicit trade.</div>
                        <div>Each trick is good for a single use and is difficult to use for anyone but the ne'erdowell themselves. Whenever you rest, a new set of four tricks is available for use.</div>
                        <div>You also have a reserve of devious cunning to tap into. If you are not trained in Creepin', once per scene you can use your cunning to roll as if you are trained in it. If you are trained in Creepin', you get an extra rogue trick when you rest.</div>
                    </ClassDescription>
                </Col>
                <Col xs={12} md={5} className="mt-3">
                    {tricksDisp()}
                    <Form>
                        <InputGroup>
                            <InputGroup.Prepend><InputGroup.Text>Add Item</InputGroup.Text></InputGroup.Prepend>
                            <Form.Control ref={input} />
                        </InputGroup>
                        <Form.Group className="d-flex justify-content-around">
                            <Button size="lg" variant="dark" onClick={() => addCustomTrick(false)}>+</Button>
                            <Button size="lg" variant="dark" onClick={() => addCustomTrick(true)}>🎲</Button>
                        </Form.Group>
                        <Form.Group className="d-flex justify-content-center">
                            <Button variant="success" className="ability-randomize-button" onClick={createItems}>Rest<br/>Refresh Rogue Tricks</Button>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}