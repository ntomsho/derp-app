import React from 'react';
import { random, BACKGROUNDS, APPEARANCES, DERPS, CLASS_FIGHTING_SKILLS } from '../../dndb-tables';
import CharGenClass from './char_gen_class';
import CharGenRace from './char_gen_race';
import CharGenSkills from './char_gen_skills';
import CharGenEquipment from './char_gen_equipment';
import CharGenDetails from './char_gen_details';
import CharGenConfirm from './char_gen_confirm';

class CharGen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stage: 1,
            rerolls: 4,
            char: {
                name: "",
                cClass: "",
                raceString: "",
                raceTraits: null,
                background: random(BACKGROUNDS),
                appearance: random(APPEARANCES),
                derp: random(DERPS),
                selectedFightingSkill: "",
                trainedSkills: [],
                inventoryStartingChoices: [],
                inventory: ["", "", "", "", "", "", "", "", "", "", "", ""],
                regulation: true
            }
        }
        this.updateSelection = this.updateSelection.bind(this);
    }

    componentDidUpdate() {
        if (this.state.stage <= 0) {
            // this.props.setCharGen(false);
        }
    }

    updateSelection(field, value, reroll) {
        let newChar = Object.assign({}, this.state.char);
        if (field instanceof Array) {
            for (let i = 0; i < field.length; i++) {
                newChar[field[i]] = value[i];
            }
        } else {
            newChar[field] = value;
        }
        let newRerolls = this.state.rerolls;
        if (reroll) newRerolls -= 1;
        this.setState({ rerolls: newRerolls, char: newChar});
    }

    canProceed() {
        switch (this.state.stage) {
            case 1:
                return !!this.state.char.cClass;
            case 2:
                return (!!this.state.char.raceString && !!this.state.char.raceTraits);
            case 3:
                if (CLASS_FIGHTING_SKILLS[this.state.char.cClass]) {
                    return this.state.char.raceTraits === "Human" ?
                        (!!this.state.char.selectedFightingSkill && this.state.char.trainedSkills.length >= 1) :
                        (!!this.state.char.selectedFightingSkill)
                } else {
                    return this.state.char.raceTraits === "Human" ?
                        (this.state.char.trainedSkills.length >= 2) : 
                        (this.state.char.trainedSkills.length >= 1);
                };
            case 4:
                return (JSON.stringify(this.props.inventory) !== JSON.stringify(["", "", "", "", "", "", "", "", "", "", "", ""]));
            case 5:
                return (!!this.state.char.background && !!this.state.char.appearance && !!this.state.char.derp);
            default:
                return false
        }
    }

    progress() {
        switch (this.state.stage) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            default:
                return;
        }
    }

    stageText() {
        switch (this.state.stage) {
            case 1:
                return "Class";
            case 2:
                return "Race";
            case 3:
                return "Skills";
            case 4:
                return "Equipment";
            case 5:
                return "Details";
            case 6:
                return "Confirmation";
            default:
                return;
        }
    }

    selectionArea() {
        switch (this.state.stage) {
            case 1:
                return <CharGenClass
                    cClass={this.state.char.cClass}
                    updateSelection={this.updateSelection}
                    rerolls={this.state.rerolls}
                />
            case 2:
                return <CharGenRace
                    raceString={this.state.char.raceString}
                    raceTraits={this.state.char.raceTraits}
                    updateSelection={this.updateSelection}
                    rerolls={this.state.rerolls}
                />
            case 3:
                return <CharGenSkills
                    cClass={this.state.char.cClass}
                    trainedSkills={this.state.char.trainedSkills}
                    selectedFightingSkill={this.state.char.selectedFightingSkill}
                    raceTraits={this.state.char.raceTraits}
                    updateSelection={this.updateSelection}
                    rerolls={this.state.rerolls}
                />
            case 4:
                return <CharGenEquipment
                    cClass={this.state.char.cClass}
                    inventoryStartingChoices={this.state.char.inventoryStartingChoices}
                    inventory={this.state.char.inventory}
                    updateSelection={this.updateSelection}
                    rerolls={this.state.rerolls}
                />
            case 5:
                return <CharGenDetails
                    background={this.state.char.background}
                    appearance={this.state.char.appearance}
                    derp={this.state.char.derp}
                    updateSelection={this.updateSelection}
                    rerolls={this.state.rerolls}
                />
            case 6:
                return <CharGenConfirm
                    char={this.state.char}
                    updateSelection={this.updateSelection}
                    rerolls={this.state.rerolls}
                />
            default:
                return;
        }
    }

    render() {
        return (
            <div id="char-gen-main">
                <div className="rerolls-container">
                    <h3>{this.state.rerolls}</h3>
                    <h3>Rerolls Remaining</h3>
                </div>
                <button onClick={() => this.setState({stage: 0})}>X</button>
                <div id="char-gen-progress">
                    {this.progress()}
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <button onClick={() => this.setState({stage: this.state.stage - 1})}>{this.state.stage != 1 ? "<<" : ""}</button>
                    <h1>{this.stageText()}</h1>
                    <button disabled={!this.canProceed()} onClick={() => this.setState({stage: this.state.stage + 1})}>{">>"}</button>
                </div>
                <div id="char-gen-selection-area">
                    {this.selectionArea()}
                </div>
            </div>
        )
    }
}

export default CharGen;