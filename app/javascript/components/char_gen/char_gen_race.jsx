import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { random, RACE_TRAITS, randomRace } from '../../dndb-tables';

export default function CharGenRace(props) {
    const [raceFirstRoll, setRaceFirstRoll] = useState(!props.raceTraits);
    //selection: {0: null, 1: Human, 2: Nonhuman}
    const [selection, setSelection] = useState(0);
    const [nonHumanString, setNonHumanString] = useState("");
    const [traits, setTraits] = useState(["", ""]);

    function rollRace() {
        if (raceFirstRoll || props.rerolls > 0) {
            const newRaceTraits = randomRace();
            let newRaceString;
            if (newRaceTraits === "Human") {
                newRaceString = "Human";
                setSelection(1);
            } else {
                newRaceString = nonHumanString;
                setSelection(2)
                setTraits(newRaceTraits)
            }
            props.updateSelection(["raceString", "raceTraits"], [newRaceString, newRaceTraits], !raceFirstRoll);
            if (raceFirstRoll) setRaceFirstRoll(false);
        }
    }

    function setRace(human) {
        let trait1 = traits[0];
        let trait2 = traits[1];
        if (human) {
            setSelection(1)
        } else {
            setSelection(2)
            if (traits[0] === "") {
                trait1 = random(RACE_TRAITS);
                trait2 = random(RACE_TRAITS);
                while (trait1 === trait2) {
                    trait2 = random(RACE_TRAITS);
                }
                setTraits([trait1, trait2]);
            }
        }
        props.updateSelection(['raceString', "raceTraits"], [human ? "Human" : nonHumanString, human ? "Human" : [trait1, trait2]]);
    }

    function update(e) {
        const newString = e.currentTarget.value;
        setNonHumanString(newString);
        props.updateSelection('raceString', newString);
    }

    function randomizeTrait(index) {
        let newTraits = traits;
        newTraits[index] = random(RACE_TRAITS);
        while (newTraits[0] === newTraits[1]) {
            newTraits[index] = random(RACE_TRAITS);
        }
        props.updateSelection('raceTraits', newTraits, true);
    }

    function raceDisplay() {
        if (selection === 1) {
            return (
                <Col xs={12}>
                    <h2 className="text-center">Human</h2>
                    <div>You gain training in an additional Skill. You can choose your second Class Skill, or roll a random Civilized Skill on the next screen</div>
                </Col>
            )
        }
        if (selection === 2) {
            return (
                <Col xs={12}>
                    <h2 className="text-center">Non-human</h2>
                    <InputGroup className="my-3">
                        <InputGroup.Prepend className="w-25 grenze">Race Name</InputGroup.Prepend>
                        <Form.Control value={nonHumanString} onChange={update} />
                    </InputGroup>
                    <Col className="justify-content-center">
                        <div className="mb-2">You have the following traits that give you Magic Advantage when relevant:</div>
                        <InputGroup className="justify-content-center">
                            <InputGroup.Text className="w-md-50-xs-75"><strong>{traits[0]}</strong></InputGroup.Text>
                            <InputGroup.Append>
                                <Button disabled={!traits[0]} variant="secondary" onClick={() => randomizeTrait(0)}>Reroll</Button>
                            </InputGroup.Append>
                        </InputGroup>
                        <InputGroup className="justify-content-center">
                            <InputGroup.Text className="w-md-50-xs-75"><strong>{traits[1]}</strong></InputGroup.Text>
                            <InputGroup.Append>
                                <Button disabled={!traits[1]} variant="secondary" onClick={() => randomizeTrait(1)}>Reroll</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Col>
                </Col>
            )
        }
    }

    return (
        <>
            <Row className="justify-content-center mb-4">
                <Button className="grenze w-25" variant="secondary" onClick={() => setRace(true)}>Human</Button>
                <Button style={{height: '70px'}} size="lg" className="grenze w-50" variant="dark" onClick={rollRace}>
                    {raceFirstRoll ? <span>Roll Race</span> : <span>Reroll Race<br /><small style={{fontSize: '60%'}}>(oh, you think you're better than them?)</small></span>}
                </Button>
                <Button className="grenze w-25" variant="secondary" onClick={() => setRace(false)}>Non-human</Button>
            </Row>
            <Row>
                {raceDisplay()}
            </Row>
        </>
    )
}