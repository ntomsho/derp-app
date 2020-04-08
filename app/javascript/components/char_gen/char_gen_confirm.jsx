import React, {useState} from 'react';
import { CLASS_COLORS } from '../../dndb-tables';
import { createCharacter } from '../../actions/character_actions';

export default function CharGenConfirm(props) {
    const { char } = props;
    const allSkills = char.trainedSkills;
    if (char.selectedFightingSkill) allSkills.unshift(char.seletedFightingSkill);

    function handleChange(event) {
        props.updateSelection(event.target.name, event.target.value);
    }

    function raceTraits() {
        if (char.raceTraits !== "Human") {
            return (
                <div>
                    <span>{char.raceTraits[0]} </span><span> {char.raceTraits[1]}</span>
                </div>
            )
        }
    }

    function confirm() {
        if (char.name) {
            createCharacter(char).then((character) => props.history.push(`/.ged/characters/${character.id}`));
        }
    }

    return (
        <div>
            <div>
                <span>Name: </span><input onChange={handleChange} type="text" name="name" value={char.name}></input>
            </div>
            <div style={{color: CLASS_COLORS[char.cClass]}}>
                <span>Class: </span><span>{char.cClass}</span>
            </div>
            <div>
                <span>Race (but not in like a racist way): </span><span>{char.raceString}</span>
                {raceTraits()}
            </div>
            <div>
                {allSkills.map((skill, i) => {
                    return (
                        <span key={i}> {skill} </span>
                    )
                })}
            </div>
            <div>
                <span>Background: </span><span>{char.background}</span>
            </div>
            <div>
                <span>Appearance: </span><span>{char.appearance}</span>
            </div>
            <div>
                <span>Derp: </span><span>{char.derp}</span>
            </div>
            <div>
                {char.inventory.map((item, i) => {
                    return (
                        <span key={i}> {item} </span>
                    )
                })}
            </div>
            <button disabled={char.name === ""} onClick={confirm}>Confirm Character</button>
        </div>
    )
}