import React, { useState } from 'react';
import { random, RUNES, VERBS, ELEMENTS } from '../../../dndb-tables';
import RaceTraits from '../race_traits';

export default function Runegoon(props) {
    const { currentSpecials } = props;
    const [activeRunes, setActiveRunes] = useState([]);
    const [engravedRune, setEngravedRune] = useState(null);
    const input = React.createRef();

    if (!currentSpecials.runes) {
        props.updateState('currentSpecials', { 'runes': [] });
    }

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
                <ul className="resource-list">
                    {currentSpecials.runes.map((r, i) => {
                        return (
                            <li key={i} className="resource-list-entry">
                                <div><strong>{r.word}</strong></div>
                                <button onClick={() => activateRune(i, false)}><strong>{r.rune}</strong></button>
                                <button onClick={() => activateRune(i, true)}><strong>🔨</strong></button>
                            </li>
                        )
                    })}
                </ul>
            )
        }
    }

    function activeRunesDisp() {
        if (activeRunes.length > 0) {
            return (
                <>
                <h3>Active Runes</h3>
                <ul className="resource-list">
                    {activeRunes.map((r, i) => {
                        return (
                            <li key={i} className="resource-list-entry">
                                <div>{r.rune} <strong>{r.word}</strong> on <input className="rune-on-input" type='text' /></div>
                            </li>
                        )
                    })}
                </ul>
                <button onClick={() => setActiveRunes([])}>End Scene</button>
                </>
            )
        }
    }

    function engravedRuneDisp() {
        if (engravedRune) {
            return (
                <>
                <h3>Engraved Rune</h3>
                <div>{engravedRune.rune} <strong>{engravedRune.word}</strong> on <input className="rune-on-input" type="text" /></div>
                </>
            )
        }
    }
    
    return (
        <div className="class-ability-container">
            <div className="class-info">
                <div className="class-desc">A crafter of magical runes that invoke an ancient arcane language.</div>
                <br />
                <div className="ability-desc">
                    <div className="ability-desc-scrollbox">
                        <div>Magic Ability:<br /><strong>Arcane Runes</strong></div>
                        <div>Whenever you rest, you gain access to a set of four ancient runes. You can activate any of them by writing, painting, or inscribing the associated rune onto something.</div>
                        <div>Whatever (or whoever) you draw the rune on is infused with the property of the runic word for the rest of the scene.</div>
                        <div>You can have one rune at a time engraved, imbuing the target with its property until the next time you rest. You spend a rune to engrave it, cancelling out any current engraving you might have.</div>
                        <br/>
                        <div>Resource Item:<br/><strong>Scrolls of Power</strong></div>
                        <div>Spend a Scroll of Power to gain a rune for its word.</div>
                        <br />
                    </div>
                </div>
                <RaceTraits raceString={props.raceString} raceTraits={props.raceTraits} updateState={props.updateState} />
            </div>
            <div className="class-ability-display">
                <div className="resource-lists-container">
                    <div id="active-runes">
                        {activeRunesDisp()}
                        {engravedRuneDisp()}
                    </div>
                    <div id="current-runes">
                        {runesDisp()}
                    </div>
                </div>
                <div className="ability-management-container">
                    <div className="custom-add-row">
                        <div>Add Rune: </div>
                        <div className="custom-add-field">
                            <input type="text" ref={input}></input>
                            <button onClick={() => addCustomRune(false)}>+</button>
                            <button onClick={() => addCustomRune(true)}>🎲</button>
                        </div>
                    </div>
                    <button className="ability-randomize-button" onClick={createRunes}>Generate Random Runes<br/>(On rest)</button>
                </div>
            </div>
        </div>
    )
}