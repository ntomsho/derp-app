import React from 'react';

export default function RulesModal(props) {
    return (
        <div className={`rules-modal-container ${props.extended ? '' : ' hidden'}`}>
            <div className="rules-modal-main">
                
                <button onClick={() => props.setModalOut(false)}
                    style={{position: 'absolute', height: '5vh', width: '4vw', right: '0', top: '0'}}
                >
                    X
                </button>
                <h1 className="rules-modal-header" style={{color: 'orangered'}}>Dungeons & Douchebags</h1>
                <h2 className="rules-modal-header" style={{textDecoration: 'underline'}}>THE RULES</h2>
                
                <h2 className="rules-modal-header">TAKING AN ACTION</h2>
                <h2 className="rules-modal-header">Roll 1d20 + Advantage Dice (d6s)</h2>
                
                <div className="rules-modal-row">
                    <strong className="rules-modal-left-tab">9-</strong><span>Failure: You fail; take a Consequence</span>
                </div>
                <div className="rules-modal-row">
                    <strong className="rules-modal-left-tab">10-17</strong><span>Pass: You succeed or make Progress (2), but take a Consequence</span>
                </div>
                <div className="rules-modal-row">
                    <strong className="rules-modal-left-tab">18+</strong><span>Success: You succeed or make Progress (2)</span>
                </div>
                <div className="rules-modal-row">
                    <strong className="rules-modal-left-tab">Nat 1</strong><span>Critical Failure: You fail, hard; take a Serious Consequence</span>
                </div>
                <div className="rules-modal-row">
                    <strong className="rules-modal-left-tab">Nat 20</strong><span>Critical Success: You succeed or make Progress (2) and then some</span>
                </div>

                <h2 className="rules-modal-header">ADVANTAGE & DIFFICULTY</h2>
                <h3 className="rules-modal-header">3 sources of Advantage - Each gives 1 Advantage Die</h3>
                <h3 className="rules-modal-header">GM gives 0-3 Difficulty - Each removes 1 Advantage Die</h3>
                <div className="rules-modal-header"><strong>(If there is more Difficulty than you have Advantage, Roll 1d20 - 1d6)</strong></div>
                
                <br/>

                <div className="rules-modal-columns-container">
                    <div className="rules-modal-single-column">
                        <div>❑</div><div style={{width: '65%'}}>Are you trained in the Skill that applies to the roll?</div>
                    </div>
                    <div className="rules-modal-single-column">
                        <div>❑</div><div style={{ width: '65%' }}>Do you have a Class Feature or Magic Item that helps?</div>
                    </div>
                    <div className="rules-modal-single-column">
                        <div>❑</div><div style={{ width: '65%' }}>Are circumstances in your favor?</div>
                    </div>
                </div>

                <br/>

                <div><strong>After rolling: Spend a Plot Point to increase your result one level (Fail > Pass > Succeed > Critical)</strong></div>

                <br/>

                <div className="rules-modal-columns-container">
                    <div className="rules-modal-column">
                        <h3 className="rules-modal-header">HEALTH AND DAMAGE</h3>
                        <div>Resting restores 1 Health</div>
                        <div>Everything else: 1d6 Health</div>
                        <br/>
                        <div>Regular Consequences:</div>
                        <ul>
                            <li>1 Damage</li>
                            <li>Lose a standard item</li>
                            <li>+1 to a Countdown</li>
                            <li>Threatened (+1 Difficulty, Regular Consequences become Serious)</li>
                        </ul>
                        <br/>
                        <div>Serious Consequences:</div>
                        <ul>
                            <li>1d6 Damage</li>
                            <li>Lose a magic item</li>
                            <li>+2 to a Countdown</li>
                            <li>Things get way worse</li>
                        </ul>
                        <br/>
                        <div>Escalate a Consequence to Serious or add a second Regular Consequence to add a Plot Point to the pool</div>
                    </div>
                    <div className="rules-modal-column">
                        <h3 className="rules-modal-header">MAGIC FEATURES AND ITEMS</h3>
                        <div>When rolling or using class features, decide with the Director what the effect is based on the keywords rolled.</div>
                        <br/>
                        <div>Magic Items are either good for one action, or last for one scene, agreed upon with the Director.</div>
                        <br/>
                        <div>If a Magic Item or Feature is utterly useless, using it anyway in a tense situation is treated as an Escalation.</div>
                        <br/>
                        <div>1 cash item is worth:</div>
                        <ul>
                            <li>3 standard items</li>
                            <li>1 magic item</li>
                            <li>Live the high life (gain 1 Plot Point)</li>
                            <li>A hefty bribe</li>
                            <li>Any other substantial purchase or payment</li>
                        </ul>
                    </div>
                    <div className="rules-modal-column">
                        <h3 className="rules-modal-header">PLOT POINTS AND EXPERIENCE</h3>
                        <div>When you take a Regular Consequence, you can add a Plot Point to the pool by Escalating:</div>
                        <ul>
                            <li>Turn the Consequence into a Serious Consequence</li>
                            <li>Take a second Regular Consequence</li>
                        </ul>
                        <br/>
                        <div>Whenever you Escalate or your Derp creates a new Consequence, add a Plot Point to the pool</div>
                        <br/>
                        <div>When the pool has Plot Points equal to the number of players, empty it and each player:</div>
                        <ul>
                            <li>Gains a Plot Point</li>
                            <li>Marks Experience</li>
                        </ul>
                        <br/>
                        <div>When returning to town, divide Treasure by number of players rounded up. Each player marks that much Experience and gets that much cash to spend</div>
                        <br/>
                        <div>Take an Advance when Experience is full</div>
                    </div>
                </div>

            </div>
        </div>
    )
}