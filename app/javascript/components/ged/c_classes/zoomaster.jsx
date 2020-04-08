import React, {useState} from 'react';
import { randomAnimal, random, MUTATIONS, ADJECTIVE_MUTATIONS } from '../../../dndb-tables';
import RaceTraits from '../race_traits';

export default function Zoomaster(props) {
    const { currentSpecials } = props;
    const [currentBeast, setCurrentBeast] = useState(null);
    const input1 = React.createRef();
    const input2 = React.createRef();

    if (!currentSpecials.beasts) {
        props.updateState('currentSpecials', { 'beasts': [] })
    }

    function randomBeast() {
        return {'beast': beastString(randomAnimal(), random(MUTATIONS)), 'name': ""};
    }

    function beastString(animal, mutation) {
        if (ADJECTIVE_MUTATIONS.includes(mutation)) {
            return mutation + " " + animal;
        }
        return animal + " with " + mutation;
    }

    function createBeasts() {
        let beasts = [];
        for (let i = 0; i < 3; i++) {
            beasts.push(randomBeast());
        }
        props.updateState('currentSpecials', { 'beasts': beasts });
    }

    function addCustomBeast(randomize) {
        let newBeasts = currentSpecials.beasts;
        newBeasts.push(randomize ? randomBeast() : {'beast': beastString(input1.current.value, input2.current.value), 'name': ""})
        props.updateState('currentSpecials', {'beasts': newBeasts});
    }

    function releaseBeast(beastIndex) {
        let newBeasts = currentSpecials.beasts;
        setCurrentBeast(currentSpecials.beasts[beastIndex]);
        newBeasts.splice(beastIndex, 1);
        props.updateState('currentSpecials', {'beasts': newBeasts});
    }

    function currentBeastDisp() {
        if (currentBeast) {    
            return (
                <>
                <div>
                    Current Beast: <><div>{currentBeast.name}</div><strong>{currentBeast.beast}</strong></>
                </div>
                <button onClick={() => setCurrentBeast(null)}>End Scene</button>
                </>
            )
        }
    }

    function changeBeastName(event) {
        let newBeasts = currentSpecials.beasts;
        newBeasts[event.target.name].name = event.target.value;
        props.updateState('currentSpecials', {'beasts': newBeasts});
    }

    function beastsDisp() {
        if (currentSpecials.beasts && currentSpecials.beasts.length > 0) {
            return (
                <>
                    <h3>Beasts</h3>
                    <ul className="resource-list">
                        {currentSpecials.beasts.map((beast, i) => {
                            return (
                                <li key={i} className="resource-list-entry">
                                    <div>
                                        <strong>{beast.beast}</strong>
                                        <br/>
                                        <span style={{color: 'darkgreen'}}>Name</span>
                                        <br/>
                                        <input type="text" onChange={changeBeastName} name={i} value={beast.name}></input>
                                    </div>
                                    <button onClick={() => releaseBeast(i)}>Go!</button>
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
                <div className="class-desc">A tamer of beasts with a collection of chimeric animal companions.</div>
                <br />
                <div className="ability-desc">
                    <div className="ability-desc-scrollbox">
                        <div>Magic Ability:<br /><strong>Chimeric Beasts</strong></div>
                        <div>You carry a menagerie of exotic creatures frozen in tiny crystal globes. Whenever you rest, you randomly select three of them for your team for the day.</div>
                        <div>You can release each beast for one scene. It obeys your commands and you gain Magic Advantage for any roll that the beast makes or assists you with that it is particularly well suited for.</div>
                        <div>The beast returns to the wild at the end of the scene or as a Consequence if it is hurt or scared.</div>
                        <br />
                        <div>Resource Item:<br/><strong></strong></div>
                        <div>Spend an Animal Totem to add a new beast with its animal type and mutation to your current team.</div>
                    </div>
                </div>
                <RaceTraits raceString={props.raceString} raceTraits={props.raceTraits} updateState={props.updateState} />
            </div>
            <div className="class-ability-display">
                <div className="ability-main">
                    {currentBeastDisp()}
                </div>
                <div className="resource-lists-container" id="form-list">
                    <div id="beasts-display">
                        {beastsDisp()}
                    </div>
                </div>
                <div>
                    <div className="ability-management-container">
                        <div className="custom-add-row">
                            <div>Add Beast: </div>
                            <div>Base Animal</div>
                            <div className="custom-add-field">
                                <input type="text" ref={input1}></input>
                            </div>
                            <div>Mutation</div>
                            <div className="custom-add-field">
                                <input type="text" ref={input2}></input>
                                <button onClick={() => addCustomBeast(false, false)}>+</button>
                                <button onClick={() => addCustomBeast(true, false)}>🎲</button>
                            </div>
                        </div>
                        <button className="ability-randomize-button" onClick={createBeasts}>Generate New Beasts<br />(On rest)</button>
                    </div>
                </div>
            </div>
        </div>
    )
}