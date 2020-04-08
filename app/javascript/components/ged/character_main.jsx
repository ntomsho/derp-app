import React from 'react';
import { CLASSES, random, randomRace, BACKGROUNDS, APPEARANCES, DERPS } from '../../dndb-tables';
import RulesModal from './rules_modal';
import DiceRoller from './dice_roller';
import Skills from './skills';
import ClassMain from './class_main';
import Inventory from './inventory';
import Advancement from './advancement';

class CharacterMain extends React.Component {
    constructor(props) {
        super(props);
    }

    updateHealth(num) {
        this.props.updateState('health', this.props.loadedChar.health === num ? num - 1 : num);
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
                    src={this.props.loadedChar.health >= i + 1 ?
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
        this.props.updateState('plotPoints', this.props.loadedChar.plotPoints === num ? num - 1 : num);
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
                    {this.props.loadedChar.plotPoints >= i + 1 ? "⦿" : "⦾"}
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
                        <button onClick={() => this.props.setRollerOut(true)}>Roll Dice</button>
                    </div>

                    <div id="main-section">
                        <div className="sheet-row">
                            <div className="field-container">
                                <div className="field-header">Name: </div>
                                <input type="text" name="name" id="name-input" onChange={this.props.handleChange} value={this.props.loadedChar.name}></input>
                            </div>
                            <div className="field-container">
                                <div className="field-header">Class: </div>
                                <div className="sub-field">
                                    <select name="cClass" onChange={this.props.handleChange} value={this.props.loadedChar.cClass}>
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
                                    <input type="text" name="raceString" id="race-input" value={this.props.loadedChar.raceString} onChange={this.props.handleChange} placeholder="Name your race"></input>
                                    <button className="randomize-button" onClick={() => this.props.updateState('raceString', randomRace() === "Human" ? "Human" : "")}>🎲</button>
                                </div>
                            </div>
                        </div>
                        <div className="sheet-row">
                            <div className="field-container">
                                <div className="field-header">Background: </div>
                                <div className="sub-field">
                                    <input type="text" name="background" onChange={this.props.handleChange} value={this.props.loadedChar.background} id="background-input"></input>
                                    <button className="randomize-button" onClick={() => this.props.updateState('background', random(BACKGROUNDS))}>🎲</button>
                                </div>
                            </div>
                            <div className="field-container">
                                <div className="field-header">Appearance: </div>
                                <div className="sub-field">
                                    <input type="text" name="appearance" onChange={this.props.handleChange} value={this.props.loadedChar.appearance} id="appearance-input"></input>
                                    <button className="randomize-button" onClick={() => this.props.updateState('appearance', random(APPEARANCES))}>🎲</button>
                                </div>
                            </div>
                            <div className="field-container">
                                <div className="field-header">Derp: </div>
                                <div className="sub-field">
                                    <input type="text" name="derp" onChange={this.props.handleChange} value={this.props.loadedChar.derp} id="derp-input"></input>
                                    <button className="randomize-button" onClick={() => this.props.updateState('derp', random(DERPS))}>🎲</button>
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
                        <ClassMain {...this.props.loadedChar} updateState={this.props.updateState} />
                    </div>
                    <div id="skills-section">
                        <Skills {...this.props.loadedChar} updateState={this.props.updateState} />
                    </div>
                    <div id="inventory-section">
                        <Inventory {...this.props.loadedChar} updateState={this.props.updateState} />
                    </div>
                    <div id="advancement-section">
                        <Advancement {...this.props.loadedChar} updateState={this.props.updateState} />
                    </div>
                </div>
            </div>
        )
    }
}

export default CharacterMain;