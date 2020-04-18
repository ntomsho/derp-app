import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { random, RACE_TRAITS, randomRace } from '../../dndb-tables';

export default function CharGenRace(props) {
    const [raceFirstRoll, setRaceFirstRoll] = useState(!props.raceTraits);

    function rollRace() {
        if (raceFirstRoll || props.rerolls > 0) {
            const newRaceTraits = randomRace();
            let newRaceString;
            if (newRaceTraits === "Human") {
                newRaceString = "Human";
            } else {
                newRaceString = "";
            }
            props.updateSelection(["raceString", "raceTraits"], [newRaceString, newRaceTraits], !raceFirstRoll);
            if (raceFirstRoll) setRaceFirstRoll(false);
        }
    }

    function randomizeTrait(index) {
        let newTraits = props.raceTraits;
        newTraits[index] = random(RACE_TRAITS);
        while (newTraits[0] === newTraits[1]) {
            newTraits[index] = random(RACE_TRAITS);
        }
        props.updateSelection('raceTraits', newTraits, true);
    }

    function raceStringDisplay() {
        if (props.raceTraits) {
            const stringBox = props.raceTraits === "Human" ?
                <span><strong>Human</strong></span> :
                <>
                    <span>a er... something else. Name your race: </span><Form.Control type="text" value={props.raceString} onChange={(event) => props.updateSelection('raceString', event.target.value)}></Form.Control>
                </>
            return (
                <div className="mb-3">You are {stringBox}</div>
            )
        }
    }

    function raceTraitsDisplay() {
        if (props.raceTraits) {
            if (props.raceTraits === "Human") {
                return (
                    <div>You gain training in an additional Skill. You can choose your second Class Skill, or roll a random Civilized Skill on the next screen</div>
                )
            } else {
                return (
                    <>
                    <Row>
                        <div>You have the following traits that give you Magic Advantage when relevant:</div>
                    </Row>
                    <Row className="w-100">
                        <Col className="text-center">
                            <div><strong>{props.raceTraits[0]}</strong></div>
                            <Button onClick={() => randomizeTrait(0)}>Reroll</Button>
                        </Col>
                        <Col className="text-center">
                            <div><strong>{props.raceTraits[1]}</strong></div>
                            <Button onClick={() => randomizeTrait(1)}>Reroll</Button>
                        </Col>
                    </Row>
                    </>
                )
            }
        }
    }

    return (
        <>
            <Row className="mt-4">
                <h3>(but not in like a racist way)</h3>
            </Row>
            <Row className="justify-content-center mb-4">
                <Button block size="lg" variant="dark" onClick={rollRace}>
                    {raceFirstRoll ? <p>Roll Race</p> : <p>Reroll Race<br/><small>(oh, you think you're better than them?)</small></p>}
                </Button>
            </Row>
            <Row>
                {raceStringDisplay()}
            </Row>
            <Row>
                {raceTraitsDisplay()}
            </Row>
        </>
    )
}