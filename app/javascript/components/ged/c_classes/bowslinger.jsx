import React, { useState, useEffect } from 'react';
import { ELEMENTS, GERUNDS, random } from '../../../dndb-tables';
import ClassDescription from '../class_description';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function Bowslinger(props) {
    const { currentSpecials } = props;
    const [savableAmmo, setSavableAmmo] = useState([])
    const input = React.createRef();

    useEffect(() => {
        if (!currentSpecials.ammo) {
            props.updateState('currentSpecials', { 'ammo': [] })
        }
    })

    function randomAmmo() {
        let wordCat = random([ELEMENTS, GERUNDS]);
        return random(wordCat);
    }

    function createAmmo() {
        let ammo = [];
        for(let i = 0; i < 3; i++) {
            ammo.push(randomAmmo());
        };
        setSavableAmmo([]);
        props.updateState('currentSpecials', {'ammo': ammo})
    }

    function consumeAmmo(ammoInd) {    
        if (Math.random() >= 0.5) {
            const newSavable = savableAmmo
            newSavable.push(currentSpecials.ammo[ammoInd])
            setSavableAmmo(newSavable);
        }
        let newAmmo = currentSpecials.ammo;
        newAmmo.splice(ammoInd, 1);
        props.updateState('currentSpecials', {'ammo': newAmmo});
    }

    function recoverAmmo(ammo, ind) {
        let newAmmo = currentSpecials.ammo;
        newAmmo.push(ammo);
        props.updateState(newAmmo);
        loseAmmo(ind);
    }

    function loseAmmo(ind) {
        let newSavable = savableAmmo;
        newSavable.splice(ind, 1);
        setSavableAmmo([...newSavable]);
    }

    function addCustomAmmo(randomize) {
        //Regex to remove "ammo" from end of input if present?
        if (randomize) {
            let newAmmo = currentSpecials.ammo;
            newAmmo.push(randomAmmo());
            props.updateState('currentSpecials', { 'ammo': newAmmo })
        } else if (input.current.value) {
            let newAmmo = currentSpecials.ammo;
            newAmmo.push(input.current.value);
            props.updateState('currentSpecials', { 'ammo': newAmmo });
        }
    }

    function ammoDisp() {
        if (currentSpecials.ammo) {
            return (
                <>
                <div className="grenze">Special Ammo</div>
                {currentSpecials.ammo.map((shot, i) => {
                    return (
                        <InputGroup key={i} className="my-1">
                            <InputGroup.Text><strong>{shot + " Ammo"}</strong></InputGroup.Text>
                            <InputGroup.Append>
                                <Button variant="outline-secondary" onClick={() => consumeAmmo(i)}>Use</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    )
                })}
                </>
            )
        }
    }

    function savableAmmoDisp() {
        if (savableAmmo.length > 0) {
            return (
                <>
                <div className="grenze">Recoverable Ammo</div>
                {savableAmmo.map((shot, i) => {
                    return (
                        <InputGroup key={i} className="my-1">
                            <InputGroup.Text><strong>{shot + " Ammo"}</strong></InputGroup.Text>
                            <InputGroup.Append>
                                <Button variant="success" onClick={() => recoverAmmo(shot, i)}>+</Button>
                                <Button variant="danger" onClick={() => loseAmmo(i)}>-</Button>
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
                <em>A sharpshooting bounty hunter who constructs special ammunition for their ranged weapon.</em>
            </Row>
            <Row>
                <Col xs={12} md={5} className="mt-3">
                    <ClassDescription>
                        <div>Magic Ability:<br /><strong>Magic Ammo</strong></div>
                        <div>You are skilled in adding magical properties to arrows, bullets, and throwing weapons. Whenever you rest, you construct three shots of magic ammo, each with a magical property that activates when fired.</div>
                        <div>After firing a piece of ammo, there is a 50% chance it remains intact and can be recovered, but any unused ammo becomes inert when you rest.</div>
                        <br/>
                        <div>Resource Item:<br/><strong>Weapon Oil</strong></div>
                        <div>Spend a Weapon Oil to create ammo with the oil's property.</div>
                        <br/>
                    </ClassDescription>
                </Col>
                <Col xs={12} md={7} className="mt-3">
                    {ammoDisp()}
                    {savableAmmoDisp()}
                <Form>
                    <InputGroup>
                        <InputGroup.Prepend><InputGroup.Text>Add Ammo</InputGroup.Text></InputGroup.Prepend>
                        <Form.Control ref={input} />
                    </InputGroup>
                    <Form.Group className="d-flex justify-content-around">
                        <Button size="lg" variant="dark" onClick={() => addCustomAmmo(false)}>+</Button>
                        <Button size="lg" variant="dark" onClick={() => addCustomAmmo(true)}>🎲</Button>
                    </Form.Group>
                    <Form.Group className="d-flex justify-content-center">
                        <Button variant="dark" className="ability-randomize-button" onClick={createAmmo}>Create Ammo<br/>(On rest)</Button>
                    </Form.Group>
                </Form>
            </Col>
        </Row>
    </Container>
    )
}