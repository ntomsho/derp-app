import React from 'react';
import { randomMagicItem } from '../../../dndb-tables';
import RaceTraits from '../race_traits';

export default function Neerdowell(props) {
    const { currentSpecials } = props;
    const input = React.createRef();

    if (!currentSpecials.items) {
        props.updateState('currentSpecials', { 'items': [] })
    }

    function createItems() {
        let items = [];
        for (let i = 0; i < 4; i++) {
            items.push(randomMagicItem());
        };
        props.updateState('currentSpecials', { 'items': items })
    }

    function consumeItem(itemInd) {
        let newItems = currentSpecials.items;
        newItems.splice(itemInd, 1);
        props.updateState('currentSpecials', { 'items': newItems });
    }

    function addCustomItem(randomize) {
        let newItems = currentSpecials.items;
        newItems.push(randomize ? randomMagicItem() : input.current.value);
        props.updateState('currentSpecials', { 'items': newItems })
    }

    function itemsDisp() {
        if (currentSpecials.items) {
            return (
                <ul className="resource-list">
                    {currentSpecials.items.map((item, i) => {
                        return (
                            <li key={i} className="resource-list-entry">
                                <div><strong>{item}</strong></div>
                                <button onClick={() => consumeItem(i)}>Use</button>
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
                <div className="class-desc">A roguish thief with a vast collection of stolen trinkets and devices.</div>
                <br />
                {/* Add stealing system for adding to bag of tricks*/}
                <div className="ability-desc">
                    <div className="ability-desc-scrollbox">
                        <div>Magic Ability:<br /><strong>Bag of Tricks</strong></div>
                        <div>The Ne'erdowell never leaves home without a seemingly bottomless bag of single-use magic items of dubious provenance.</div>
                        <div>Whenever you rest, a new set of four magic items is available for use from the bag.</div>
                        <ul>
                            <li>Activate its magical property for one action</li>
                            <li>Change its weapon type or its magical property</li>
                        </ul>
                        <br/>
                    </div>
                </div>
                <RaceTraits raceString={props.raceString} raceTraits={props.raceTraits} updateState={props.updateState} />
            </div>
            <div className="class-ability-display">
                <div className="resource-lists-container" id="item-list">
                    {itemsDisp()}
                </div>
                <div className="ability-management-container">
                    <div className="custom-add-row">
                        <div>Add Item: </div>
                        <div className="custom-add-field">
                            <input type="text" ref={input}></input>
                            <button onClick={() => addCustomItem(false)}>+</button>
                            <button onClick={() => addCustomItem(true)}>🎲</button>
                        </div>
                    </div>
                    <button className="ability-randomize-button" onClick={createItems}>Generate Random Items<br/>(On rest)</button>
                </div>
            </div>
        </div>
    )
}