import React, { useState, useEffect, useRef } from 'react';

export default function DiceRoller(props) {
    //Selection variables
    const [selectedDice, setSelectedDice] = useState([false, false, false]);
    const [difficulty, setDifficulty] = useState(0);
    const [rollHistory, setRollHistory] = useState([]);
    const [disadvantage, setDisadvantage] = useState(false);
    //the first roll in rollHistory is always the current one

    //roll "class"
    //{ 
    //  result: int (final roll),
    //  difficulty: int,
    //  dice: [mainDie, adv1, adv2, adv3],
    //  disadvantage: int if disadvantage, false if not
    //}

    const topRef = useRef(null);
    const historyRef = useRef(null);
    const blankd6 = '▢';
    const dieFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    const advantageSources = [
        "You have a Skill that applies",
        "You have Magic that applies",
        "You have a Circumstance in your favor"
    ]

    useEffect(() => {
        setDisadvantage(difficulty > numDice() ? true : false);
    }, [JSON.stringify(selectedDice), difficulty])

    useEffect(() => {
        if (rollHistory.length > 0) historyRef.current.scrollTo(0, topRef.current.offsetTop)
    }, [JSON.stringify(rollHistory)])

    function numDice() {
        let num = 0;
        for (let i = 0; i < 3; i++) {
            if (selectedDice[i]) num++;
        }
        return num;
    }

    function changeDifficulty(inc) {
        if (inc && difficulty < 3) {
            setDifficulty(difficulty + 1);
        } else if (!inc && difficulty > 0) {
            setDifficulty(difficulty - 1);
        }
    }

    function selectAdvantageDie(ind) {
        let newDice = [...selectedDice];
        newDice[ind] = newDice[ind] ? false : true;
        setSelectedDice(newDice);
    }

    function resetSelections() {
        setSelectedDice([false, false, false]);
    }

    function rollDice() {
        const mainRoll = Math.floor(Math.random() * 20 + 1);
        let mod = false;
        let newDice;
        if (disadvantage) {
            mod = -1 * Math.floor(Math.random() * 6) + 1;
            newDice = [0, 0, 0];
        } else {
            let cancels = difficulty;
            newDice = selectedDice.map(die => {
                if (cancels && die) {
                    cancels -= 1;
                    return 0;
                }
                return !!die ? Math.floor(Math.random() * 6) + 1 : 0;
            });
            mod = newDice.reduce((acc, num) => acc + num, 0);
        }
        let result = mainRoll + mod;
        const rolls = [...rollHistory];
        rolls.push({ 'result': result, 'difficulty': difficulty, 'dice': [mainRoll, ...newDice], 'disadvantage': disadvantage ? mod : false });
        setRollHistory(rolls);
    }

    function resultString(total, mainDie) {
        if (mainDie === 1) {
            return { 'main': "Critical Failure", 'sub': "You fail, hard; take a Serious Consequence" };
        } else if (mainDie === 20) {
            return { 'main': "Critical Success", 'sub': "You succeed or make Progress (2) and then some" };
        } else if (total <= 9) {
            return { 'main': "Failure", 'sub': "You fail; Take a Consequence" };
        } else if (total >= 18) {
            return { 'main': "Success", 'sub': "You succeed or make Progress (2)" };
        } else {
            return { 'main': "Pass", 'sub': "You succeed or make Progress (2), but take a Consequence" };
        }
    }

    function currentRollDisp() {
        if (rollHistory.length > 0) {
            const currentRoll = rollHistory[rollHistory.length - 1];
            const resultText = resultString(currentRoll.total, currentRoll.dice[0]);
            return (
                <div style={{width: '100%'}}>
                    <div><strong>{currentRoll.result}</strong></div>
                    <div>{resultText.main}</div>
                    <div>{resultText.sub}</div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <div className="d20">
                            <div className="d20-value">{currentRoll.dice[0]}</div>
                        </div>
                        {currentRoll.disadvantage ? 
                            <span style={{color: 'red'}} className="current-d6">{dieFaces[(currentRoll.disadvantage * -1) - 1]}</span> :
                            currentRoll.dice.map((die, i) => {
                            if (i > 0) {
                                return (
                                    <span key={i} className="current-d6">{dieFaces[die - 1]}</span>
                                )
                            }
                        })}
                    </div>
                </div>
            )
        }
    }

    function rollHistoryDisp() {
        if (rollHistory.length > 0) {
            return (
                <div ref={historyRef} className="history-box">
                    {rollHistory.map((roll, i) => {
                        return (
                            <div key={i} ref={i === rollHistory.length - 1 ? topRef : null}>
                                <div>
                                    <span><strong>{roll.result}</strong> </span>
                                    <span>{resultString(roll.result, roll.dice[0]).main}</span>
                                </div>
                                <div>
                                    <span>{roll.dice[0]}</span>
                                    {
                                        roll.disadvantage ?
                                            <span style={{color: 'red'}}>{dieFaces[(roll.disadvantage * -1) - 1]}</span> :
                                            roll.dice.slice(1, 4).map((die, j) => <span key={j}>{dieFaces[die - 1]}</span>)
                                    }
                                </div>
                                <div style={{width: '50%', borderTop: '1px solid black'}}></div>
                            </div>
                        )
                    })}
                </div>
            )
        }
    }

    function diceSelectionDisplay() {
        let cancels = difficulty;
        return (
            <>
                {selectedDice.map((die, i) => {
                    let canceled = false;
                    if (selectedDice[i] && cancels > 0) {
                        cancels -= 1;
                        canceled = true;
                    }
                    return (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                            <div>{advantageSources[i]}</div>
                            <div key={i} onClick={() => selectAdvantageDie(i)} className={selectedDice[i] ? 'advantage-die-selected' : 'advantage-die'}>
                                {blankd6}
                                <div className={`canceled-x${canceled ? '' : ' hidden'}`}>X</div>
                            </div>
                        </div>
                    )
                })}
            </>
        )
    }

    function diceSelectDisadvantage() {
        if (disadvantage) {
            return (
                <div>
                    <div>Disadvantage</div>
                    <div>
                        <div className="disadvantage-die">{blankd6}</div>
                    </div>
                </div>
            )
        }
    }

    return (
        <div className={`dice-roller-container${props.extended ? '' : ' hidden'}`}>
            <div className="dice-roller-main">
                <button onClick={() => props.setRollerOut(false)}
                    style={{ position: 'absolute', height: '5vh', width: '4vw', right: '0', top: '0' }}
                >
                    X
                </button>
                <div className="roller-top">
                    <div className="roller-top-box">
                        <h2>Result</h2>
                        {currentRollDisp()}
                    </div>
                    <div className="roller-top-box">
                        <h2>Roll History</h2>
                        {rollHistoryDisp()}
                    </div>
                </div>
                <div className="dice-selection-box">
                    <div style={{ display: 'flex' }}>
                        <div className="advantage-container">
                            {diceSelectionDisplay()}
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', width: '30%'}}>
                            <button onClick={rollDice}>Roll</button>
                            <div style={{ color: disadvantage ? 'red' : 'black', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                                <div><strong>Difficulty</strong></div>
                                <br/>
                                <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                                    <div onClick={() => changeDifficulty(false)}>-</div>
                                    <div><strong>{difficulty}</strong></div>
                                    <div onClick={() => changeDifficulty(true)}>+</div>
                                </div>
                                {diceSelectDisadvantage()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}