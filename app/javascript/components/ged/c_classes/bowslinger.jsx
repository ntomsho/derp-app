import React, { useState } from 'react';
import { ELEMENTS, GERUNDS, random } from '../../../dndb-tables';
import RaceTraits from '../race_traits';

export default function Bowslinger(props) {
    const { currentSpecials } = props;
    const [savableAmmo, setSavableAmmo] = useState([])
    const input = React.createRef();

    if (!currentSpecials.ammo) {
        props.updateState('currentSpecials', { 'ammo': [] })
    }

    function randomAmmo() {
        let wordCat = random([ELEMENTS, GERUNDS]);
        return random(wordCat);
    }

    function createAmmo() {
        let ammo = [];
        for(let i = 0; i < 3; i++) {
            ammo.push(randomAmmo());
        };
        setSavableAmmo([]);
        props.updateState('currentSpecials', {'ammo': ammo})
    }

    function consumeAmmo(ammoInd) {    
        if (Math.random() >= 0.5) {
            const newSavable = savableAmmo
            newSavable.push(currentSpecials.ammo[ammoInd])
            setSavableAmmo(newSavable);
        }
        let newAmmo = currentSpecials.ammo;
        newAmmo.splice(ammoInd, 1);
        props.updateState('currentSpecials', {'ammo': newAmmo});
    }

    function recoverAmmo(ammo, ind) {
        let newAmmo = currentSpecials.ammo;
        newAmmo.push(ammo);
        props.updateState(newAmmo);
        loseAmmo(ind);
    }

    function loseAmmo(ind) {
        let newSavable = savableAmmo;
        newSavable.splice(ind, 1);
        setSavableAmmo([...newSavable]);
    }

    function addCustomAmmo(randomize) {
        if (randomize) {
            let newAmmo = currentSpecials.ammo;
            newAmmo.push(randomAmmo());
            props.updateState('currentSpecials', { 'ammo': newAmmo })
        } else {
            if (input.current.value) {
                let newAmmo = currentSpecials.ammo;
                newAmmo.push(input.current.value);
                props.updateState('currentSpecials', { 'ammo': newAmmo })
            }
        }
    }

    function ammoDisp() {
        if (currentSpecials.ammo) {
            return (
                <ul className="resource-list">
                    {currentSpecials.ammo.map((shot, i) => {
                        return (
                            <li key={i} className="resource-list-entry">
                                <div><strong>{shot}</strong> Ammo</div>
                                <button onClick={() => consumeAmmo(i)}>Use</button>
                            </li>
                        )
                    })}
                </ul>
            )
        }
    }

    function savableAmmoDisp() {
        if (savableAmmo.length > 0) {
            return (
                <>
                <h3>Fired Ammo</h3>
                <ul className="resource-list">
                    {savableAmmo.map((shot, i) => {
                        return (
                            <li key={i} className="resource-list-entry">
                                <div><strong>{shot}</strong> Ammo</div>
                                <button onClick={() => recoverAmmo(shot, i)}>+</button>
                                <button onClick={() => loseAmmo(i)}>-</button>
                            </li>
                        )
                    })}
                </ul>
                </>
            )
        }
    }

    return (
        <div className="class-ability-container">
            <div className="class-info">
                <div className="class-desc">A sharpshooting bounty hunter who constructs special ammunition for their ranged weapon.</div>
                <br />
                <div className="ability-desc">
                    <div className="ability-desc-scrollbox">
                        <div>Magic Ability:<br /><strong>Magic Ammo</strong></div>
                        <div>You are skilled in adding magical properties to arrows, bullets, and throwing weapons. Whenever you rest, you construct three shots of magic ammo, each with a magical property that activates when fired.</div>
                        <div>After firing a piece of ammo, there is a 50% chance it remains intact and can be recovered, but any unused ammo becomes inert when you rest.</div>
                        <br/>
                        <div>Resource Item:<br/><strong>Weapon Oil</strong></div>
                        <div>Spend a Weapon Oil to create ammo with the oil's property.</div>
                        <br/>
                    </div>
                </div>
                <RaceTraits raceString={props.raceString} raceTraits={props.raceTraits} updateState={props.updateState} />
            </div>
            <div className="class-ability-display">
                <div className="resource-lists-container">
                    <div id="bowslinger-ammo">
                        {ammoDisp()}
                    </div>
                    <div id="savable-ammo">
                        {savableAmmoDisp()}
                    </div>
                </div>
                <div className="ability-management-container">
                    <div className="custom-add-row">
                        <div className="custom-add-row">
                            <div>Add Ammo: </div>
                            <div className="custom-add-field">
                                <input type="text" ref={input}></input>
                                <button onClick={() => addCustomAmmo(false)}>+</button>
                                <button onClick={() => addCustomAmmo(true)}>🎲</button>
                            </div>
                        </div>
                    </div>
                    <button className="ability-randomize-button" onClick={createAmmo}>Create Ammo<br/>(On rest)</button>
                </div>
            </div>
        </div>
    )
}