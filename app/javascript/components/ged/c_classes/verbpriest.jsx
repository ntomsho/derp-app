import React, {useState} from 'react';
import { random, COMMANDS } from '../../../dndb-tables';
import RaceTraits from '../race_traits';

export default function Verbpriest(props) {
    const { currentSpecials } = props;
    const [faith, setFaith] = useState(3);
    const input = React.createRef();

    if (!currentSpecials.words) {
        props.updateState('currentSpecials', { 'words': [] });
    }

    function randomWord() {
        return random(COMMANDS);
    }

    function createWords() {
        let words = [];
        for (let i = 0; i < 4; i++) {
            let newWord = randomWord();
            while (currentSpecials.words.includes(newWord)) {
                newWord = randomWord();
            }
            words.push(randomWord());
        }
        props.updateState('currentSpecials', { 'words': words });
    }

    function addCustomWord(randomize) {
        let newWords = currentSpecials.words;
        newWords.push(randomize ? randomWord() : input.current.value);
        props.updateState('currentSpecials', { 'words': newWords });
    }

    function consumeCommand(wordInd) {
        if (faith < 3) {
            setFaith(3);
            let newWords = currentSpecials.words;
            newWords.splice(wordInd, 1);
            props.updateState('currentSpecials', { 'words': newWords });
        }
    }

    function updateFaith(num) {
        setFaith(faith === num ? faith - 1 : num);
    }

    function faithDisp() {
        let buttons = [];
        for (let i = 0; i < 3; i++) {
            buttons.push(
                <button key={i}
                    id={`faith-${i + 1}`}
                    className="faith-container"
                    onClick={() => updateFaith(i + 1)}
                >
                    {faith >= i + 1 ? "⦿" : "⦾"}
                </button>
            )
        }
        return (
            <div className="class-radio-container">
                {buttons}
            </div>
        )
    }

    function wordsDisp() {
        if (currentSpecials.words) {
            return (
                <ul className="resource-list">
                    {currentSpecials.words.map((w, i) => {
                        return (
                            <li key={i} className="resource-list-entry">
                                <div><strong>{w}</strong></div>
                                <button onClick={() => consumeCommand(i)}>X</button>
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
                <div className="class-desc">A speaker of sacred words that command both living and inanimate things.</div>
                <br />
                <div className="ability-desc">
                    <div className="ability-desc-scrollbox">
                        <div>Magic Ability:<br /><strong>Sacred Words</strong></div>
                        <div>Whenever you rest, you recall 4 Words of Power in the ancient language of the gods and your Faith is refreshed to 3.</div>
                        <div>When you speak one of the Words at a creature or object (with a target if required), spend 1 Faith and it is compelled to attempt to perform the action until completed or at least attempt to do so for a few minutes.</div>
                        <div>You can sacrifice one of your Command Words, removing it from your list, to bring your Faith back to 3.</div>
                        <div>For each of the additional bonuses below, you must spend an additional point of Faith.</div>
                        <ul>
                            <li>Adding additional words (targets, conditions, etc.) to the command</li>
                            <li>Commanding a creature that is openly hostile to you</li>
                            <li>Commanding something particularly large, powerful, complex, or magical</li>
                            <li>Making the Command last for the duration of the scene</li>
                        </ul>
                        <br/>
                        <div>Resource Item:<br/><strong>Command Scrolls</strong></div>
                        <div>Spend a Command Scroll to gain a Command with that word.</div>
                        <br />
                    </div>
                </div>
                <RaceTraits raceString={props.raceString} raceTraits={props.raceTraits} updateState={props.updateState} />
            </div>
            <div className="class-ability-display">
                <h2>Faith</h2>
                {faithDisp()}
                <div className="resource-lists-container" id="word-list">
                    {wordsDisp()}
                </div>
                <div className="ability-management-container">
                    <div className="custom-add-row">
                        <div>Add Word: </div>
                        <div className="custom-add-field">
                            <input type="text" ref={input}></input>
                            <button onClick={() => addCustomWord(false)}>+</button>
                            <button onClick={() => addCustomWord(true)}>🎲</button>
                        </div>
                    </div>
                    <button className="ability-randomize-button" onClick={createWords}>Generate Random Words<br/>(On rest)</button>
                </div>
            </div>
        </div>
    )
}