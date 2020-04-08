import React from 'react';
import { random, SKILLS } from '../../../dndb-tables';
import RaceTraits from '../race_traits';

export default function KnightOfTushuze(props) {
    let { currentSpecials } = props;
    const input = React.createRef();

    if (!currentSpecials.blessings) {
        props.updateState('currentSpecials', { 'blessings': [] })
    }

    function randomBlessing() {
        return random(SKILLS);
    }

    function createBlessings() {
        let blessings = [];
        for (let i = 0; i < 4; i++) {
            blessings.push(randomBlessing());
        };
        props.updateState('currentSpecials', { 'blessings': blessings })
    }

    function consumeBlessing(blessingInd) {
        let newBlessings = currentSpecials.blessings;
        newBlessings.splice(blessingInd, 1);
        props.updateState('currentSpecials', { 'blessings': newBlessings });
    }

    function addCustomBlessing(randomize) {
        let newBlessings = currentSpecials.blessings;
        newBlessings.push(randomize ? randomBlessing() : input.current.value);
        props.updateState('currentSpecials', { 'blessings': newBlessings });
    }

    function blessingVirtues(blessing) {
        //Formatting looks bad on desktop, but so does a lot of it
        switch (blessing) {
            case "Believe in Yourself":
            case "Cardio":
            case "Creepin'":
                return (
                    <>
                    <li style={{listStyle: 'none'}}>Bravery</li>
                    <li>Holy Light</li>
                    </>
                )
            case "Brute Force":
            case "Rad Moves":
            case "Spottin'":
                return (
                    <>
                    <li style={{ listStyle: 'none' }}>Compassion</li>
                    <li>Lay on Hands (1d6 healing)</li>
                    </>
                )
            case "Macgyver":
            case "Man vs. Wild":
            case "Thinkiness":
                return (
                    <>
                    <li style={{ listStyle: 'none' }}>Honor</li>
                    <li>Divine Shield</li>
                    </>
                )
        }
    }

    function blessingsDisplay() {
        if (currentSpecials.blessings) {
            return (
                <ul className="resource-list">
                    {currentSpecials.blessings.map((blessing, i) => {
                        return (
                            <li key={i} className="resource-list-entry">
                                <div>
                                    Blessing of <strong>{blessing}</strong>
                                    <ul className="resource-subfield">
                                        {blessingVirtues(blessing)}
                                    </ul>
                                </div>
                                <button onClick={() => consumeBlessing(i)}>Use</button>
                            </li>
                        )
                    })}
                </ul>
            )
        }
    }

    return (
        <div className="class-ability-container">
            <div className="class-info">
                <div className="class-desc">A knight of a righteous and goodly order, doing good deeds and providing nice blessings.</div>
                <br />
                <div className="ability-desc">
                    <div className="ability-desc-scrollbox">
                        <div>Magic Ability:<br /><strong>Blessings of Tushuze</strong></div>
                        <div>Members of the order gain five blessings per day, each of which is tied to a Skill and a Virtue of Tushuze.</div>
                        <br/>
                        <div>You can spend a Blessing to:</div>
                        <ul>
                            <li>(Any) Give yourself or an ally Magic Advantage on an action that uses the listed Skill</li>
                            <li>(Bravery) Create an intensely bright light that evil things hate for the duration of the scene</li>
                            <li>(Compassion) Lay hands on yourself or an ally to heal them for 1d6 Health</li>
                            <li>(Honor) Create a divine shield to protect yourself or an ally</li>
                        </ul>
                        <br />
                    </div>
                </div>
                <RaceTraits raceString={props.raceString} raceTraits={props.raceTraits} updateState={props.updateState} />
            </div>
            <div className="class-ability-display">
                <div className="resource-lists-container" id="blessing-list">
                    {blessingsDisplay()}
                </div>
                <div className="ability-management-container">
                    <div className="custom-add-row">
                        <div className="custom-add-row">
                            <div>Add Blessing: </div>
                            <div className="custom-add-field">
                                <select ref={input}>
                                    <option value="Believe in Yourself">Believe in Yourself (Bravery)</option>
                                    <option value="Brute Force">Brute Force (Compassion)</option>
                                    <option value="Cardio">Cardio (Bravery)</option>
                                    <option value="Creepin'">Creepin' (Bravery)</option>
                                    <option value="Man vs. Wild">Man vs. Wild (Honor)</option>
                                    <option value="Macgyver">Macgyver (Honor)</option>
                                    <option value="Rad Moves">Rad Moves (Compassion) </option>
                                    <option value="Shootin'">Shootin' (Compassion)</option>
                                    <option value="Thinkiness">Thinkiness (Honor)</option>
                                </select>
                                <button onClick={() => addCustomBlessing(false)}>+</button>
                                <button onClick={() => addCustomBlessing(true)}>🎲</button>
                            </div>
                        </div>
                    </div>
                    <button className="ability-randomize-button" onClick={createBlessings}>Generate Blessings<br/>(On rest)</button>
                </div>
            </div>
        </div>
    )
}