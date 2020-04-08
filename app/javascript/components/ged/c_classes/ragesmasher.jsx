import React, { useState } from 'react';
import { randomAnimal } from '../../../dndb-tables';
import RaceTraits from '../race_traits';

export default function Ragesmasher(props) {
    const { currentSpecials } = props;
    const [currentActive, setCurrentActive] = useState(null);
    const input = React.createRef();

    if (!currentSpecials.totems) {
        props.updateState('currentSpecials', { 'totems': [] })
    }

    function createTotems() {
        let totems = [];
        while (totems.length < 3) {
            totems.push(randomAnimal());
        };
        props.updateState('currentSpecials', { 'totems': totems })
    }

    function addCustomTotem(randomize) {
        let newTotems = currentSpecials.totems;
        newTotems.push(randomize ? randomAnimal() : input.current.value);
        props.updateState('currentSpecials', { 'totems': newTotems });
    }

    function activateTotem(totemInd, rage) {
        rage ? setCurrentActive("rage") : setCurrentActive(currentSpecials.totems[totemInd]);
        let newTotems = currentSpecials.totems;
        newTotems.splice(totemInd, 1);
        props.updateState('currentSpecials', { 'totems': newTotems });
    }

    function totemsDisp() {
        if (currentSpecials.totems && currentSpecials.totems.length > 0) {
            return (
                <>
                <h3>Totem Spirits</h3>
                <ul className="resource-list">
                    {currentSpecials.totems.map((totem, i) => {
                        return (
                            <li key={i} className="resource-list-entry">
                                <div><strong>{totem}</strong> Totem</div>
                                <button onClick={() => activateTotem(i, false)}>Use</button>
                                <button onClick={() => activateTotem(i, true)}>Rage!</button>
                            </li>
                        )
                    })}
                </ul>
                </>
            )
        }
    }

    function currentDisp() {
        if (currentActive === "rage") {
            return (
                <>
                    <div><strong>RAGING!</strong></div>
                    <div style={{fontWeight: 'normal', fontFamily: 'auto', fontSize: '2.5vw'}}>Gain Magic Advantage on all rolls to fight, smash, punch, or break stuff<br/>Take +1 Difficulty on anything else</div>
                    <button onClick={() => setCurrentActive(null)}>End Scene</button>
                </>
            )
        } else if (currentActive) {
            return (
                <>
                    <div>Channeling the Spirit of the:</div>
                    <div><strong>{currentActive}</strong></div>
                    <button onClick={() => setCurrentActive(null)}>End Scene</button>
                </>
            )
        }
    }

    return (
        <div className="class-ability-container">
            <div className="class-info">
                <div className="class-desc">A primal barbarian warrior who channels animal spirits when they aren’t flipping out.</div>
                <br />
                <div className="ability-desc">
                    <div className="ability-desc-scrollbox">
                        <div>Magic Ability:<br /><strong>Totem Spirits and Barbaric Rage</strong></div>
                        <div>Whenever you rest, you gain a set of three Totem Spirits. You can spend one of these totems to channel that animal spirit or rage out for the duration of the scene.</div>
                        <div>When channeling a spirit, you can do things that that animal can do and gain Magic Advantage on actions it would be associated with.</div>
                        <div>Whe raging out, you gain Magic Advantage on aggressive or destructive actions but take +1 Difficulty on any other actions.</div>
                        <br/>
                        <div>Resource Item:<br/><strong>Animal Totems</strong></div>
                        <div>Spend an Animal Totem to gain a Totem Spirit of its animal type.</div>
                        <br />
                    </div>
                </div>
                <RaceTraits raceString={props.raceString} raceTraits={props.raceTraits} updateState={props.updateState} />
            </div>
            <div className="class-ability-display">
                <div className="ability-main">
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        {currentDisp()}
                    </div>
                </div>
                <div className="resource-lists-container">
                    {totemsDisp()}
                </div>
                <div className="ability-management-container">
                    <div className="custom-add-row">
                        <div>Add Totem Spirit: </div>
                        <div className="custom-add-field">
                            <input type="text" ref={input}></input>
                            <button onClick={() => addCustomTotem(false)}>+</button>
                            <button onClick={() => addCustomTotem(true)}>🎲</button>
                        </div>
                    </div>
                    <button className="ability-randomize-button" onClick={createTotems}>Generate Random Totems<br/>(On rest)</button>
                </div>
            </div>
        </div>
    )
}