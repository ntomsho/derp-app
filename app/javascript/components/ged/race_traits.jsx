import React from 'react';
import { random, RACE_TRAITS } from '../../dndb-tables';

export default function RaceTraits(props) {
    
    function updateTraits(event) {
        let newTraits = props.raceTraits;
        newTraits[parseInt(event.target.name)] = event.target.value;
        props.updateState('raceTraits', newTraits);
    }
    
    if (props.raceString !== "Human") {
        return (
            <div>
                <h3>Race Traits</h3>
                <div>
                    <input type="text" name="0" onChange={updateTraits} value={props.raceTraits[0] || ""}></input>
                    <button className="randomize-button" onClick={() => props.updateState('raceTraits', [random(RACE_TRAITS), props.raceTraits[1] || ""])}>🎲</button>
                    <input type="text" name="1" onChange={updateTraits} value={props.raceTraits[1] || ""}></input>
                    <button className="randomize-button" onClick={() => props.updateState('raceTraits', [props.raceTraits[0] || "", random(RACE_TRAITS)])}>🎲</button>
                </div>
                <div>You gain Magic Advantage on any rolls where either of these is helpful.</div>
            </div>
        )
    } else {
        return null
    }
}