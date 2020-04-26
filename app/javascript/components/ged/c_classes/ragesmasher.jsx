import React, { useState, useEffect } from 'react';
import { randomAnimal } from '../../../dndb-tables';
import ClassDescription from '../class_description';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function Ragesmasher(props) {
    const { currentSpecials } = props;
    const [currentActive, setCurrentActive] = useState(null);
    const input = React.createRef();

    useEffect(() => {
        if (!currentSpecials.totems) {
            props.updateState('currentSpecials', { 'totems': [] })
        }
    });

    function createTotems() {
        let totems = [];
        while (totems.length < 3) {
            totems.push(randomAnimal());
        };
        props.updateState('currentSpecials', { 'totems': totems }, true)
    }

    function addCustomTotem(randomize) {
        let newTotems = currentSpecials.totems;
        newTotems.push(randomize ? randomAnimal() : input.current.value);
        props.updateState('currentSpecials', { 'totems': newTotems });
    }

    function activateTotem(totemInd, rage) {
        rage ? setCurrentActive("rage") : setCurrentActive(currentSpecials.totems[totemInd]);
        let newTotems = currentSpecials.totems;
        newTotems.splice(totemInd, 1);
        props.updateState('currentSpecials', { 'totems': newTotems });
    }

    function totemsDisp() {
        if (currentSpecials.totems && currentSpecials.totems.length > 0) {
            return (
                <>
                <div className="grenze">Totem Spirits</div>
                {currentSpecials.totems.map((totem, i) => {
                    return (
                        <InputGroup key={i} className="my-1">
                            <InputGroup.Text className="w-50"><div><strong>{totem}</strong> Totem</div></InputGroup.Text>
                            <InputGroup.Append>
                                <Button variant="outline-secondary" onClick={() => activateTotem(i, false)}>Use</Button>
                                <Button variant="danger" onClick={() => activateTotem(i, true)}>Rage!</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    )
                })}
                </>
            )
        }
    }

    function currentDisp() {
        if (currentActive === "rage") {
            return (
                <>
                    <Col xs={10}>
                        <h3 style={{ color: 'darkred' }} className="text-center">RAGING!</h3>
                    </Col>
                    <Col xs={10}>
                        <small className="w-75">Gain Magic Advantage on all rolls to fight, smash, punch, or break stuff<br/>Take +1 Difficulty on anything else</small>
                    </Col>
                    <Button size="sm" className="absolute-button-right" variant="secondary" onClick={() => setCurrentActive(null)}>End Scene</Button>
                </>
            )
        } else if (currentActive) {
            return (
                <>
                    <Col xs={10}>
                        <h3 className="text-center">Channeling the Spirit of the:</h3>
                    </Col>
                    <Col xs={10}>
                        <h3 className="text-center">{currentActive}</h3>
                    </Col>
                    <Button size="sm" className="absolute-button-right" variant="secondary" onClick={() => setCurrentActive(null)}>End Scene</Button>
                </>
            )
        }
    }

    return (
        <Container>
            <Row>
                <em>A primal barbarian warrior who channels animal spirits when they aren’t flipping out.</em>
            </Row>
            <Row>
                <Col xs={12} md={5} className="mt-3">
                    <ClassDescription>
                        <div>Magic Ability:<br /><strong>Totem Spirits and Barbaric Rage</strong></div>
                        <div>Whenever you rest, you gain a set of three Totem Spirits. You can spend one of these totems to channel that animal spirit or rage out for the duration of the scene.</div>
                        <div>When channeling a spirit, you can do things that that animal can do and gain Magic Advantage on actions it would be associated with.</div>
                        <div>Whe raging out, you gain Magic Advantage on aggressive or destructive actions but take +1 Difficulty on any other actions.</div>
                        <br/>
                        <div>Resource Item:<br/><strong>Animal Totems</strong></div>
                        <div>Spend an Animal Totem to gain a Totem Spirit of its animal type.</div>
                    </ClassDescription>
                </Col>
                <Col xs={12} md={7} className="mt-3">
                    <Row className="justify-content-center">
                        <div className="grenze">Current Totem Spirit</div>
                    </Row>
                    <Row className="align-items-center">
                        {currentDisp()}
                    </Row>
                    {totemsDisp()}
                    <Form>
                        <InputGroup>
                            <InputGroup.Prepend><InputGroup.Text>Add Totem Animal</InputGroup.Text></InputGroup.Prepend>
                            <Form.Control ref={input} />
                        </InputGroup>
                        <Form.Group className="d-flex justify-content-around">
                            <Button size="lg" variant="dark" onClick={() => addCustomTotem(false)}>+</Button>
                            <Button size="lg" variant="dark" onClick={() => addCustomTotem(true)}>🎲</Button>
                        </Form.Group>
                        <Form.Group className="d-flex justify-content-center">
                            <Button variant="dark" className="ability-randomize-button" onClick={createTotems}>Rest<br/>Refresh Totems</Button>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}