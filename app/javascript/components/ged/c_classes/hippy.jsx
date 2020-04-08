import React, { useState } from 'react';
import { randomAnimal, MUTATIONS, random } from '../../../dndb-tables';
import RaceTraits from '../race_traits';

export default function Hippy(props) {
    const { currentSpecials } = props;
    const [currentForm, setCurrentForm] = useState(null);
    const [currentMutation, setCurrentMutation] = useState(null);
    const [goodberries, setGoodberries] = useState(0);
    const input1 = React.createRef();
    const input2 = React.createRef();

    if (!currentSpecials.forms) {
        props.updateState('currentSpecials', { 'forms': [], 'gifts': [] })
    }

    function createFormsAndGifts() {
        let forms = [];
        let gifts = [];
        for (let i = 0; i < 3; i++) {
            let newForm = randomAnimal();
            while (forms.includes(newForm)) {
                newForm = randomAnimal();
            }
            forms.push(newForm);
            gifts.push(random(MUTATIONS));
        };
        props.updateState('currentSpecials', { 'forms': forms, 'gifts': gifts });
    }

    function sacrificeForm(formInd) {
        setCurrentMutation(random(MUTATIONS));
        let newResources = Object.assign({}, currentSpecials);
        newResources.forms.splice(formInd, 1);
        newResources.gifts.push(random(MUTATIONS));
        props.updateState('currentSpecials', newResources);
    }

    function mutationDisp() {
        if (currentMutation) {
            return(
                <>
                <div>
                    Mutation: {currentMutation}
                </div>
                <button onClick={() => setCurrentMutation(null)}>End Scene</button>
                </>
            )
        }
    }

    function consumeGift(giftInd, goodberry) {
        if (goodberry) setGoodberries(goodberries + Math.floor(Math.random() * 6) + 1);
        let newResources = Object.assign({}, currentSpecials);
        newResources.gifts.splice(giftInd, 1);
        props.updateState('currentSpecials', newResources)
    }

    function activateGift(giftInd) {
        setCurrentMutation(currentSpecials.gifts[giftInd])
        consumeGift(giftInd);
    }

    function addCustomForm(randomize) {
        let newResources = currentSpecials;
        newResources.forms.push(randomize ? randomAnimal() : input1.current.value);
        props.updateState('currentSpecials', newResources)
    }

    function addCustomGift(randomize) {
        let newResources = currentSpecials;
        newResources.gifts.push(randomize ? random(MUTATIONS) : input2.current.value);
        props.updateState('currentSpecials', newResources)
    }

    function formsDisp() {
        if (currentSpecials.forms && currentSpecials.forms.length > 0) {
            return (
                <>
                <h3>Animal Forms</h3>
                <ul className="resource-list">
                    {currentSpecials.forms.map((form, i) => {
                        return (
                                <li key={i} className="resource-list-entry">
                                    <div onClick={() => setCurrentForm(form)} className={`form${currentForm === form ? ' selected' : ''}`}><span><strong>{form}</strong> Form</span></div>
                                    <button onClick={() => sacrificeForm(i)}>X</button>
                                </li>
                        )
                    })}
                    <div>
                        <li className="resource-list-entry">
                            <div onClick={() => setCurrentForm(null)} className={`form${currentForm === null ? ' selected' : ''}`}><strong>Human</strong> Form</div>
                        </li>
                    </div>
                </ul>
                </>
            )
        }
    }

    function goodberriesDisp() {
        if (goodberries) {
            return (
                <div>Goodberries: {goodberries} <button onClick={() => setGoodberries(goodberries - 1)}>Nom</button></div>
            )
        }
    }

    function giftsDisp() {
        if (currentSpecials.gifts && currentSpecials.gifts.length > 0) {
            return (
                <>
                <h3>Nature's Gifts</h3>
                <ul className="resource-list">
                    {currentSpecials.gifts.map((gift, i) => {
                        return (
                            <li key={i} className="resource-list-entry">
                                <div><strong>{gift}</strong></div>
                                <button onClick={() => activateGift(i)}>Use</button>
                                <button onClick={() => consumeGift(i, true)}>🍏</button>
                                <button onClick={() => consumeGift(i, false)}>X</button>
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
                <div className="class-desc">A totally chill master of nature who can shapeshift into animals.</div>
                <br />
                <div className="ability-desc">
                    <div className="ability-desc-scrollbox">
                        <div>Magic Ability:<br /><strong>Nature's Gifts & Animal Forms</strong></div>
                        <div>Whenever you rest, you are given a set of three animal forms that you can shift between at will and three Gifts associated with a mutation.</div>
                        <div>When in an animal form, you gain Magic Advantage on any actions the form is well suited for. You cna give up one of your animal forms to gain a new random Gift.</div>
                        <div>You can spend a Gift to: </div>
                        <ul>
                            <li>Apply that mutation to any of your forms for the duration of the scene.</li>
                            <li>Change one of your forms to a new random animal.</li>
                            <li>Produce 1d6 healing Goodberries. Eating one within a day of its creation restores 1 Health.</li>
                        </ul>
                        <br/>
                        <div>Resource Item:<br/><strong>Animal Totems</strong></div>
                        <div>Spend an Animal Totem to gain a form that is the totem's animal.</div>
                        <br />
                    </div>
                </div>
                <RaceTraits raceString={props.raceString} raceTraits={props.raceTraits} updateState={props.updateState} />
            </div>
            <div className="class-ability-display">
                <div className="ability-main">
                    {mutationDisp()}
                </div>
                <div className="resource-lists-container" id="form-list">
                    <div id="gifts-display">
                        {goodberriesDisp()}
                        {giftsDisp()}
                    </div>
                    <div id="forms-display">
                        {formsDisp()}
                    </div>
                </div>
                <div className="ability-management-container">
                    <div className="custom-add-row">
                        <div>Add Animal Form: </div>
                        <div className="custom-add-field">
                            <input type="text" ref={input1}></input>
                            <button onClick={() => addCustomForm(false)}>+</button>
                            <button onClick={() => addCustomForm(true)}>🎲</button>
                        </div>
                    </div>
                    <div className="custom-add-row">
                        <div>Add Gift: </div>
                        <div className="custom-add-field">
                            <input type="text" ref={input2}></input>
                            <button onClick={() => addCustomGift(false)}>+</button>
                            <button onClick={() => addCustomGift(true)}>🎲</button>
                        </div>
                    </div>
                    <button className="ability-randomize-button" onClick={createFormsAndGifts}>Generate Gifts and Forms<br/>(On rest)</button>
                </div>
            </div>
        </div>
    )
}