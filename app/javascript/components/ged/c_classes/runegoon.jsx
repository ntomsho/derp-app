import React, { useState, useEffect } from 'react';
import { random, RUNES, VERBS, ELEMENTS } from '../../../dndb-tables';
import ClassDescription from '../class_description';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function Runegoon(props) {
    const { currentSpecials } = props;
    const [activeRunes, setActiveRunes] = useState([]);
    const [engravedRune, setEngravedRune] = useState(null);
    const input = React.createRef();

    useEffect(() => {
        if (!currentSpecials.runes) {
            props.updateState('currentSpecials', { 'runes': [] });
        }
    });

    function randomRune() {
        return {'rune': random(RUNES), 'word': random(random([VERBS, ELEMENTS]))};
    }

    function addCustomRune(randomize) {
        let newRunes = currentSpecials.runes;
        if (randomize) {
            newRunes.push(randomRune());
        } else {
            newRunes.push({'rune': random(RUNES), 'word': input.current.value});
        }
        props.updateState('currentSpecials', { 'runes': newRunes })
    }

    function createRunes() {
        setEngravedRune(null);
        let runes = [];
        for(let i = 0; i < 5; i++) {
            runes.push(randomRune());
        }
        props.updateState('currentSpecials', {'runes': runes})
    }

    function activateRune(runeInd, engrave) {
        let newRunes = currentSpecials.runes;
        if (engrave) {
            setEngravedRune(currentSpecials.runes[runeInd]);
        } else {
            let newActiveRunes = activeRunes
            activeRunes.push(currentSpecials.runes[runeInd]);
            setActiveRunes(newActiveRunes);
        }
        newRunes.splice(runeInd, 1);
        props.updateState('currentSpecials', {'runes': newRunes});
    }

    function runesDisp() {
        if (currentSpecials.runes) {
            return (
                <>
                <div className="grenze">Prepared Runes</div>
                {currentSpecials.runes.map((r, i) => {
                    return (
                        <InputGroup key={i} className="my-1">
                            <InputGroup.Text className="w-50"><strong>{r.word}</strong></InputGroup.Text>
                            <InputGroup.Append>
                                <Button variant="outline-info" onClick={() => activateRune(i, false)}><strong>{r.rune}</strong></Button>
                                <Button variant="info" onClick={() => activateRune(i, true)}><strong>🔨</strong></Button>
                            </InputGroup.Append>
                        </InputGroup>
                    )
                })}
                </>
            )
        }
    }

    function activeRunesDisp() {
        if (activeRunes.length > 0) {
            return (
                <>
                <div className="grenze">Active Runes</div>
                {activeRunes.map((r, i) => {
                    return (
                        <InputGroup key={i} className="my-1">
                            <InputGroup.Prepend><InputGroup.Text>{r.rune}</InputGroup.Text></InputGroup.Prepend>
                            <InputGroup.Text><div><strong>{r.word}</strong> on </div><Form.Control /></InputGroup.Text>
                        </InputGroup>
                    )
                })}
                <Button size="sm" variant="secondary" onClick={() => setActiveRunes([])}>End Scene</Button>
                </>
            )
        }
    }

    function engravedRuneDisp() {
        if (engravedRune) {
            return (
                <>
                <Row className="justify-content-center">
                    <div className="grenze">Engraved Rune</div>
                </Row>
                <Row className="justify-content-center align-items-center">
                    <InputGroup>
                        <InputGroup.Prepend><InputGroup.Text>{engravedRune.rune}</InputGroup.Text></InputGroup.Prepend>
                        <InputGroup.Text><div><strong>{engravedRune.word}</strong> on </div><Form.Control /></InputGroup.Text>
                    </InputGroup>
                </Row>
                </>
            )
        }
    }
    
    return (
        <Container>
            <Row>
                <em>A crafter of magical runes that invoke an ancient arcane language.</em>
            </Row>
            <Row>
                <Col xs={12} md={5} className="mt-3">
                    <ClassDescription>
                        <div>Magic Ability:<br /><strong>Arcane Runes</strong></div>
                        <div>Whenever you rest, you gain access to a set of five ancient runes. You can activate any of them by writing, painting, or inscribing the associated rune onto something.</div>
                        <div>Whatever (or whoever) you draw the rune on is infused with the property of the runic word for the rest of the scene.</div>
                        <div>You can have one rune at a time engraved, imbuing the target with its property until the next time you rest. You spend a rune to engrave it, cancelling out any current engraving you might have.</div>
                        <br/>
                        <div>Resource Item:<br/><strong>Scrolls of Power</strong></div>
                        <div>Spend a Scroll of Power to gain a rune for its word.</div>
                    </ClassDescription>
                </Col>
                <Col xs={12} md={7} className="mt-3">
                    {engravedRuneDisp()}
                    {activeRunesDisp()}
                    {runesDisp()}
                    <Form>
                        <InputGroup>
                            <InputGroup.Prepend><InputGroup.Text>Add Rune</InputGroup.Text></InputGroup.Prepend>
                            <Form.Control ref={input} />
                        </InputGroup>
                        <Form.Group className="d-flex justify-content-around">
                            <Button size="lg" variant="dark" onClick={() => addCustomRune(false)}>+</Button>
                            <Button size="lg" variant="dark" onClick={() => addCustomRune(true)}>🎲</Button>
                        </Form.Group>
                        <Form.Group className="d-flex justify-content-center">
                            <Button variant="dark" className="ability-randomize-button" onClick={createRunes}>Generate Random Runes<br/>(On rest)</Button>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}