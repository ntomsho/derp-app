import React, { useState } from 'react';
import { random, BASES, GERUNDS, ELEMENTS, ELEMENTS_OF } from '../../../dndb-tables';
import RaceTraits from '../race_traits';

export default function Mixologist(props) {
    let { currentSpecials } = props;
    let { bases, catalysts } = currentSpecials;

    const [keepComp, setKeepComp] = useState(null);
    const [lastClicked, setLastClicked] = useState("Base");
    //currentConcoction[0] === base;
    //currentConcoction[1] === catalyst;
    const [selectedBase, setSelectedBase] = useState(null);
    const [selectedCatalyst, setSelectedCatalyst] = useState(null);

    const input1 = React.createRef();
    const input2 = React.createRef();
    const input3 = React.createRef();

    if (!currentSpecials.bases && !currentSpecials.catalysts) {
        props.updateState('currentSpecials', { 'bases': [], 'catalysts': [] });
    }

    function randomBase() {
        return random(BASES);
    }

    function randomCatalyst() {
        return random([
            {'comp': `${random(GERUNDS)}`, 'compCat': 'verb'},
            {'comp': `${random(ELEMENTS)}`, 'compCat': 'element'}
        ]);
    }

    function createComponents() {
        let newBases = [];
        let newCatalysts = [];
        for(let i = 0; i < 5; i++) {
            newBases.push(randomBase());
            newCatalysts.push(randomCatalyst());
        }
        props.updateState('currentSpecials', { 'bases': newBases, 'catalysts': newCatalysts });
    }

    function addCustomComponent(randomize, compCat) {
        if (compCat === "base") {
            let newBases = bases;
            newBases.push(randomize ? randomBase() : input1.current.value);
            props.updateState('currentSpecials', { 'bases': newBases, 'catalysts': catalysts });
        } else {
            let newCatalysts = catalysts;
            if (randomize) {
                newCatalysts.push(randomCatalyst());
            } else {
                newCatalysts.push({'comp': input2.current.value, 'compCat': input3.current.value});
            }
            props.updateState('currentSpecials', { 'bases': bases, 'catalysts': newCatalysts });
        }
    }

    function selectComponent(category, i) {
        if (category === "Base") {
            if (selectedBase === i) {
                setKeepComp(null);
            }
            setSelectedBase(selectedBase === i ? null : i);
            setLastClicked("Base");
        } else {
            if (selectedCatalyst === i) {
                setKeepComp(null);
            }
            setSelectedCatalyst(selectedCatalyst === i ? null : i);
            setLastClicked("Catalyst");
        }
    }

    function consumeCurrentConcoction() {
        const newBases = bases;
        const newCatalysts = catalysts;
        keepComp === "Base" ?
            newCatalysts.splice(selectedCatalyst, 1) : 
            newBases.splice(selectedBase, 1);
        setKeepComp(null);
        setSelectedBase(null);
        setSelectedCatalyst(null);
        setLastClicked(null);
        props.updateState('currentSpecials', { 'bases': newBases, 'catalysts': newCatalysts });
    }

    function consumeButton() {
        if (selectedBase !== null && selectedCatalyst !== null && keepComp !== null) {
            return (
                <button className="ability-main-button" onClick={consumeCurrentConcoction}>Create Concoction</button>
            )
        }
    }

    function currentConcoctionDisp() {
        if (selectedBase !== null && selectedCatalyst === null) {
            return (
                <>{bases[selectedBase]}</>
            );
        } else if (selectedBase === null && selectedCatalyst !== null) {
            return (
                <>{catalysts[selectedCatalyst].comp}</>
            );
        } else if (selectedBase !== null && selectedCatalyst !== null) {
            const base = bases[selectedBase]
            const catalyst = catalysts[selectedCatalyst].comp
            const catalystCat = catalysts[selectedCatalyst].compCat;
            if (catalystCat === 'verb') {
                return (
                    <>
                        <div className="wizcaster-spell-word" style={{display: 'flex', flexDirection: 'column'}}>
                            <div className="wizcaster-spell-word">{catalyst} </div>
                            <button className={`keepword${keepComp === "Catalyst" ? ' selected' : ''}`} onClick={() => setKeepComp("Catalyst")}>Keep?</button>
                        </div>
                        <div className="wizcaster-spell-word" style={{display: 'flex', flexDirection: 'column'}}>
                            <div className="wizcaster-spell-word">{base} </div>
                            <button className={`keepword${keepComp === "Base" ? ' selected' : ''}`} onClick={() => setKeepComp("Base")}>Keep?</button>
                        </div>
                    </>
                );
            } else {
                return lastClicked === "Base" ?
                    <>
                        <div className="wizcaster-spell-word" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="wizcaster-spell-word">{catalyst} </div>
                            <button className={`keepword${keepComp === "Catalyst" ? ' selected' : ''}`} onClick={() => setKeepComp("Catalyst")}>Keep?</button>
                        </div>
                        <div className="wizcaster-spell-word" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="wizcaster-spell-word">{base} </div>
                            <button className={`keepword${keepComp === "Base" ? ' selected' : ''}`} onClick={() => setKeepComp("Base")}>Keep?</button>
                        </div>
                    </>
                    :
                    <>
                        <div className="wizcaster-spell-word" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="wizcaster-spell-word">{base} </div>
                            <button className={`keepword${keepComp === "Base" ? ' selected' : ''}`} onClick={() => setKeepComp("Base")}>Keep?</button>
                        </div>
                        <div className="wizcaster-spell-word">
                            <div className="wizcaster-spell-word"> of </div>
                        </div>
                        <div className="wizcaster-spell-word" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="wizcaster-spell-word">{ELEMENTS.includes(catalyst) ? ELEMENTS_OF[ELEMENTS.indexOf(catalyst)] : catalyst } </div>
                            <button className={`keepword${keepComp === "Catalyst" ? ' selected' : ''}`} onClick={() => setKeepComp("Catalyst")}>Keep?</button>
                        </div>
                    </>
            }
        }
        else {
            return <></>
        }
    }
    
    function componentsList() {
        if ((bases && bases.length > 0) || (catalysts && catalysts.length > 0)) {
            return (
                <>
                <div>
                    <h3>Bases</h3>
                    <ul className="resource-list">
                        {bases.map((b, i) => {
                            return (
                                <li key={i} className="resource-list-entry">
                                    <div className={`comp${selectedBase === i ? ' selected' : ''}`} onClick={() => selectComponent("Base", i)}>{b}</div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div>
                    <h3>Catalysts</h3>
                    <ul className="resource-list">
                        {catalysts.map((c, i) => {
                            return (
                                <li key={i} className="resource-list-entry">
                                    <div className={`comp${selectedCatalyst === i ? ' selected' : ''}`} onClick={() => selectComponent("Catalyst", i)}>{c.comp}</div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                </>
            )
        }
    }
    
    return (
        <div className="class-ability-container">
            <div className="class-info">
                <div className="class-desc">An alchemist and apothecary who can craft a variety of useful concoctions.</div>
                <br />
                <div className="ability-desc">
                    <div className="ability-desc-scrollbox">
                        <div>Magic Ability:<br /><strong>Alchemical Concoctions</strong></div>
                        <div>You carry with you a supply of 5 alchemical Bases and 5 Catalysts with you that inexplicably replenishes itself when you rest.</div>
                        <div>Combine a Base and a Catalyst to create a Concoction you can use immediately. Select one of those components to keep, the other is expended.</div>
                        <br/>
                        <div>Resource Item:<br/><strong>Alchemical Ingredients</strong></div>
                        <div>Spend an alchemical ingredient to add it your current lists of Bases or Catalysts.</div>
                        <br />
                    </div>
                </div>
                <RaceTraits raceString={props.raceString} raceTraits={props.raceTraits} updateState={props.updateState} />
            </div>
            <div className="class-ability-display">
                <div className="ability-main">
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <div style={{display: 'flex'}}>
                            {currentConcoctionDisp()}
                        </div>
                        {consumeButton()}
                    </div>
                </div>
                <div className="resource-lists-container">
                    {componentsList()}
                </div>
                <div>
                    <div className="ability-management-container">
                        <div className="custom-add-row">
                            <div>Add Base: </div>
                            <div className="custom-add-field">
                                <select ref={input1}>
                                    {BASES.map((base, i) => {
                                        return (
                                            <option key={i} value={base}>{base}</option>
                                            )
                                        })}
                                </select>
                                <button onClick={() => addCustomComponent(false, 'base')}>+</button>
                                <button onClick={() => addCustomComponent(true, 'base')}>🎲</button>
                            </div>
                        </div>
                        <br/>
                        <div className="custom-add-row">
                            <div>Add Catalyst: </div>
                            <div className="custom-add-field">
                                <input style={{width: '30vw'}} type="text" ref={input2}></input>
                                <select ref={input3}>
                                    <option value="Element">Element</option>
                                    <option value="Verb">Verb</option>
                                </select>
                                <button onClick={() => addCustomComponent(false, 'catalyst')}>+</button>
                                <button onClick={() => addCustomComponent(true, 'catalyst')}>🎲</button>
                            </div>
                        </div>
                        <button className="ability-randomize-button" onClick={() => createComponents()}>Generate New Components<br/>(On rest)</button>
                    </div>
                </div>
            </div>
        </div>
    )
}