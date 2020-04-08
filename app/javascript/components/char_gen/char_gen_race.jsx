import React, { useState, useEffect } from 'react';
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
                <span>Human</span> :
                <><span>a er... something else. Name your race: </span><input type="text" value={props.raceString} onChange={(event) => props.updateSelection('raceString', event.target.value)}></input></>
            return (
                <div>You are {stringBox}</div>
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
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div>You have the following traits that give you Magic Advantage when relevant:</div>
                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <div>{props.raceTraits[0]}<button onClick={() => randomizeTrait(0)}>Reroll</button></div>
                            <div>{props.raceTraits[1]}<button onClick={() => randomizeTrait(1)}>Reroll</button></div>
                        </div>
                    </div>
                )
            }
        }
    }

    return (
        <>
            <h3>(but not in like a racist way)</h3>
            <button onClick={rollRace}>
                {raceFirstRoll ? "Roll Race" : "Reroll Race (oh, you think you're better than them?)"}
            </button>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {raceStringDisplay()}
                <br/>
                {raceTraitsDisplay()}
            </div>
        </>
    )
}