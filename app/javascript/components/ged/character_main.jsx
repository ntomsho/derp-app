import React from 'react';
import { CLASSES, random, randomRace, BACKGROUNDS, APPEARANCES, DERPS } from '../../dndb-tables';
import RulesModal from './rules_modal';
import DiceRoller from './dice_roller';
import Skills from './skills';
import ClassMain from './class_main';
import Inventory from './inventory';
import Advancement from './advancement';
import { snakeToCamel, camelToSnake } from '../../case_converter';
import { fetchCharacter, updateCharacter } from '../../actions/character_actions';

class CharacterMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            char: {
                name: "",
                cClass: "",
                raceString: "Human",
                raceTraits: [],
                background: "",
                appearance: "",
                derp: "",
                health: 7,
                maxHealth: 7,
                plotPoints: 1,
                selectedFightingSkill: "",
                trainedSkills: [],
                currentSpecials: {},
                inventory: ["", "", "", "", "", "", "", "", "", "", "", ""],
                level: 1,
                experience: 0,
                advancements: [],
                savedTag: "",
                favoriteTags: [],
                rerolls: 0,
                regulation: true
            }
        }
        this.updateState = this.updateState.bind(this);
        this.loadCharacter = this.loadCharacter.bind(this);
        this.saveCharacter = this.saveCharacter.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        fetchCharacter(this.props.match.params.id, this.loadCharacter);
    }

    loadCharacter(character) {
        const JSONValues = ["race_traits", "trained_skills", "current_specials", "inventory", "advancements", "favorite_tags"];
        let newState = {};
        Object.keys(character).forEach(key => {
            JSONValues.includes(key) ? 
                newState[snakeToCamel(key)] = JSON.parse(character[key]) : 
                newState[snakeToCamel(key)] = character[key];
        });
        //Temporary until polymorphic assoc is figured out
        newState.favoriteTags = [];
        debugger
        this.setState({ char: newState });
    }

    saveCharacter() {
        const JSONValues = ["raceTraits", "trainedSkills", "currentSpecials", "inventory", "advancements", "favoriteTags"];
        let newState = {};
        Object.keys(this.state.char).forEach(key => {
            debugger
            newState[camelToSnake(key)] = JSONValues.includes(key) ? 
                JSON.stringify(this.state.char[key]) : 
                this.state.char[key]
        });
        debugger
        updateCharacter(newState, this.props.match.params.id);
    }

    updateState(key, val) {
        let newState = Object.assign({}, this.state.char);
        newState[key] = val;
        this.setState({ char: newState });
    }

    handleChange(event) {
        if (event.target.name === "cClass") {
            let newState = Object.assign({}, char);
            newState['currentSpecials'] = {};
            newState['cClass'] = event.target.value
            this.setState({ char: newState });
        } else {
            this.updateState(event.target.name, event.target.value)
        }
    }

    updateHealth(num) {
        this.setState({ health: this.state.char.health === num ? num - 1 : num });
    }

    healthTrackerDisp() {
        const hearts = [];
        for (let i = 0; i < this.props.maxHealth; i++) {
            hearts.push(
                <div key={i}>
                <img key={i}
                    id={`heart-${i + 1}`}
                    alt="Health"
                    className="heart-container"
                    onClick={() => this.updateHealth(i + 1)}
                    src={this.state.char.health >= i + 1 ?
                        "http://icons.iconarchive.com/icons/designbolts/free-valentine-heart/256/Heart-icon.png" : 
                        "http://icons.iconarchive.com/icons/icons8/windows-8/256/Gaming-Hearts-icon.png"}
                />
                </div>
            )
        }
        return (
            <div style={{display: 'flex'}}>
                {hearts}
            </div>
        )
    }

    updatePlotPoints(num) {
        this.setState({ plotPoints: this.state.char.plotPoints === num ? num - 1 : num });
    }

    plotPointsTrackerDisp() {
        const pp = [];
        for (let i = 0; i < 3; i++) {
            pp.push(
                <span key={i}
                    id={`pp-${i + 1}`}
                    className="pp-container"
                    onClick={() => this.updatePlotPoints(i + 1)}
                >
                    {this.state.char.plotPoints >= i + 1 ? "⦿" : "⦾"}
                </span>
            )
        }
        return (
            <div style={{ display: 'flex' }}>
                {pp}
            </div>
        )
    }

    rulesModal() {
        return (
            <div className="rules-modal hidden" style={{display: 'fixed'}}>
                <embed src="dndb_onesheet.pdf" style={{width: '90vw', height: '90vh'}}/>
            </div>
        )
    }

    render() {
        if (!this.state.char.name) {
            return (
                <div id="dndb-main">
                    Loading Character...
                </div>
            )
        }
        return (
            <div id="dndb-main">
                <RulesModal setModalOut={this.props.setModalOut} extended={this.props.modalOut} />
                <DiceRoller setRollerOut={this.props.setRollerOut} extended={this.props.rollerOut} />
                <div id="dndb-sheet-container">
                    <div id="sheet-header">
                        <h1 className="color-header">GED:<br/>Guild of Expendable Dungeoneers</h1>
                    </div>
                    <div id="main-button-row">
                        <button onClick={() => this.props.setModalOut(true)}>Show Rules</button>
                        <button onClick={this.saveCharacter}>Save Character</button>
                        <button onClick={() => this.props.setRollerOut(true)}>Roll Dice</button>
                    </div>

                    <div id="main-section">
                        <div className="sheet-row">
                            <div className="field-container">
                                <div className="field-header">Name: </div>
                                <input type="text" name="name" id="name-input" onChange={this.handleChange} value={this.state.char.name}></input>
                            </div>
                            <div className="field-container">
                                <div className="field-header">Class: </div>
                                <div className="sub-field">
                                    <select name="cClass" onChange={this.handleChange} value={this.state.char.cClass}>
                                        <option value="" disabled>Select Class</option>
                                        {CLASSES.map((c, i) => {
                                            return (
                                                <option key={i} value={c}>{c}</option>
                                            )
                                        })}
                                    </select>
                                    <button className="randomize-button" onClick={() => this.props.updateState('cClass', random(CLASSES))}>🎲</button>
                                </div>
                            </div>
                            <div className="field-container">
                                <div className="field-header">Race <span style={{fontSize: '9px'}}>(but not in like a racist way)</span>:</div>
                                <div className="sub-field">
                                    <input type="text" name="raceString" id="race-input" value={this.state.char.raceString} onChange={this.handleChange} placeholder="Name your race"></input>
                                    <button className="randomize-button" onClick={() => this.updateState('raceString', randomRace() === "Human" ? "Human" : "")}>🎲</button>
                                </div>
                            </div>
                        </div>
                        <div className="sheet-row">
                            <div className="field-container">
                                <div className="field-header">Background: </div>
                                <div className="sub-field">
                                    <input type="text" name="background" onChange={this.handleChange} value={this.state.char.background} id="background-input"></input>
                                    <button className="randomize-button" onClick={() => this.updateState('background', random(BACKGROUNDS))}>🎲</button>
                                </div>
                            </div>
                            <div className="field-container">
                                <div className="field-header">Appearance: </div>
                                <div className="sub-field">
                                    <input type="text" name="appearance" onChange={this.handleChange} value={this.state.char.appearance} id="appearance-input"></input>
                                    <button className="randomize-button" onClick={() => this.updateState('appearance', random(APPEARANCES))}>🎲</button>
                                </div>
                            </div>
                            <div className="field-container">
                                <div className="field-header">Derp: </div>
                                <div className="sub-field">
                                    <input type="text" name="derp" onChange={this.handleChange} value={this.state.char.derp} id="derp-input"></input>
                                    <button className="randomize-button" onClick={() => this.updateState('derp', random(DERPS))}>🎲</button>
                                </div>
                            </div>
                        </div>
                        <div className="sheet-row">
                            <div className="health-tracker">
                                <div className="field-header">Health</div>
                                {this.healthTrackerDisp()}
                            </div>
                            <div className="plot-points-tracker">
                                <div className="field-header">Plot Points</div>
                                {this.plotPointsTrackerDisp()}
                            </div>
                        </div>
                    </div>
                    <div id="class-section">
                        <ClassMain {...this.state.char} updateState={this.updateState} />
                    </div>
                    <div id="skills-section">
                        <Skills {...this.state.char} updateState={this.updateState} />
                    </div>
                    <div id="inventory-section">
                        <Inventory {...this.state.char} updateState={this.updateState} />
                    </div>
                    <div id="advancement-section">
                        <Advancement {...this.state.char} updateState={this.updateState} />
                    </div>
                </div>
            </div>
        )
    }
}

export default CharacterMain;