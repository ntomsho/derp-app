import React, {useState} from 'react';
import { Redirect } from 'react-router-dom';
import { CLASS_COLORS } from '../../dndb-tables';
import { createCharacter } from '../../actions/character_actions';
import { camelToSnake } from '../../case_converter';

export default function CharGenConfirm(props) {
    let character = props.char;
    // Why won't this destructuring work?
    // let { character: char } = props;
    const allSkills = character.trainedSkills;
    if (character.selectedFightingSkill) allSkills.unshift(character.seletedFightingSkill);
    const [newCharId, setNewCharId] = useState(null);
    const [campaignId, setCampaignId] = useState(null);

    function handleChange(event) {
        props.updateSelection(event.target.name, event.target.value);
    }

    function raceTraits() {
        if (character.raceTraits !== "Human") {
            return (
                <div>
                    <span>{character.raceTraits[0]} </span><span> {character.raceTraits[1]}</span>
                </div>
            )
        }
    }

    function confirm() {
        if (character.name) {
            let charCopy = {};
            Object.keys(character).forEach(key => {
                if (key !== "inventoryStartingChoices") charCopy[camelToSnake(key)] = character[key];
            });
            // charCopy.campaign_id = campaignId;
            charCopy.campaign_id = 2;
            charCopy.health = 7;
            charCopy.plot_points = 1;
            charCopy.current_specials = JSON.stringify({});
            charCopy.regulation = props.rerolls > 0 ? true : false;
            createCharacter(charCopy).then((newChar) => setNewCharId(newChar.id));
        }
    }

    if (newCharId) {
        return (
            <Redirect to={`/ged/characters/${newCharId}`} />
        )
    }

    return (
        <div>
            <div>
                <span>Name: </span><input onChange={handleChange} type="text" name="name" value={character.name}></input>
            </div>
            <div style={{color: CLASS_COLORS[character.cClass]}}>
                <span>Class: </span><span>{character.cClass}</span>
            </div>
            <div>
                <span>Race (but not in like a racist way): </span><span>{character.raceString}</span>
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
                <span>Background: </span><span>{character.background}</span>
            </div>
            <div>
                <span>Appearance: </span><span>{character.appearance}</span>
            </div>
            <div>
                <span>Derp: </span><span>{character.derp}</span>
            </div>
            <div>
                {character.inventory.map((item, i) => {
                    return (
                        <span key={i}> {item} </span>
                    )
                })}
            </div>
            <button disabled={character.name === ""} onClick={confirm}>Confirm Character</button>
        </div>
    )
}