import React, { useState } from 'react';
import * as tables from '../../../ged-tables';
import Button from 'react-bootstrap/Button'
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

class CharacterFeature extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.randomize = this.randomize.bind(this);
        this.setField = this.setField.bind(this);
        this.getTable = this.getTable.bind(this);
        this.updateCustomSpecial = this.updateCustomSpecial.bind(this);
        this.updateSpecial = this.updateSpecial.bind(this)
        this.updateRefreshSpecial = this.updateRefreshSpecial.bind(this);
        this.specialComp = this.specialComp.bind(this);
        this.specialRefreshComp = this.specialRefreshComp.bind(this);
    }

    randomize(field) {
        let newState = Object.assign({}, props.feature);
        const table = getTable(field);
        newState[field] = table[Math.floor(Math.random() * table.length)];
        props.updateFeature(newState, props.index, !!props.feature[field]);
    }

    setField(field, value) {
        let newState = Object.assign({}, props.feature);
        newState[field] = value;
        props.updateFeature(newState, props.index, false);
    }

    getTable(field) {
        switch (field) {
            case "combatSkill": return tables.FIGHTING_SKILLS
            case "artifactType": return tables.MAGIC_ARTIFACTS
            case "artifact":
                if (props.feature.artifactType === "Magic Garb") return tables.MAGIC_GARB
                if (props.feature.artifactType === "Magic Object") return tables.MAGIC_ARTIFACTS
                else return tables.MAGIC_WEAPONS
            case "trainedSkill": return tables.CIVILIZED_SKILLS
            case "skillMastery": return tables.SKILL_MASTERIES
            case "weaponType":
                return tables.WEAPON_TYPES[Math.floor(Math.random() * tables.WEAPON_TYPES.length)]
            case "element":
                return tables.ELEMENTS
            case "animal":
                return tables.ANIMAL_TYPES[Math.floor(Math.random() * tables.ANIMAL_TYPES.length)]
        }
    }

    updateCustomSpecial(event, specialIndex, listIndex) {
        const newState = Object.assign({}, this.state);
        newState[`customSpecial_${specialIndex}_${listIndex}`] = event.target.value;
        this.setState(newState);
    }

    updateSpecial(specialType, index) {
        let newSpecials;
        if (!props.feature.chosenSpecials) {
            newSpecials = new Array(props.feature.specials.length);
        } else {
            newSpecials = Object.assign([], props.feature.chosenSpecials);
        }

        const table = getTable(specialType);
        newSpecials[index] = table[Math.floor(Math.random() * table.length)];
        props.setField("specials", newSpecials);
    }

    updateRefreshSpecial(specialIndex, listIndex, value) {
        let newSpecials = Object.assign({}, props.feature.specialRefresh.currentSpecials);
        if (!newSpecials.currentSpecials) {
            newSpecials.currentSpecials[specialIndex] = new Array(props.feature.specialRefresh.currentSpecials[specialIndex].number);
        } else {
            newSpecials.currentSpecials[specialIndex] = Object.assign([], props.feature.specialRefresh[specialIndex].currentSpecials);
        }
        if (value) {
            newSpecials.currentSpecials[specialIndex].currentSpecials[listIndex] = value;
        } else {
            const table = getTable(props.feature.specialRefresh[specialIndex].specialType);
            newSpecials.currentSpecials[specialIndex].currentSpecials[listIndex] = table[Math.floor(Math.random() * table.length)];
            props.setField("specialRefresh", newSpecials);
        }
    }

    specialComp() {
        if (props.feature.specials !== undefined) {
            let specialComps = [];
            props.feature.specials.forEach((special, i) => {
                let thisComp = [];
                thisComp.push(
                    <span className="grenze">{special}: </span>
                )
                if (props.feature.chosenSpecials[i]) {
                    thisComp.push(<>
                        <span>{chosenSpecials[i]}</span>
                    </>)
                }
                thisComp.push(
                    <Button className="random-button" disabled={props.rerolls <= 0 && props.feature.combatSkill} variant="outline-dark" onClick={() => updateSpecial(special, i)}>Roll {special}</Button>
                )
                specialComps.push(thisComp);
            });
            return specialComps;
        }
    }

    setFavoriteSpecial(index) {
        let newSpecials = Object.assign({}, props.feature.specialRefresh.currentSpecials);
        const favorite = newSpecials.splice(j,1)[0];
        setField("favoriteSpecial", favorite);
        setField()
    }

    specialRefreshComp() {
        if (props.feature.specialRefresh) {
            let specialComps = [];
            if (props.feature.favoriteSpecial === "") {
                specialComps.push(<div>Choose one to be your favorite special</div>);
            }
            props.feature.specialRefresh.forEach((special, i) => {
                let thisComp = [];
                for (let j = 0; j < props.feature.favoriteSpecial !== undefined ? special.number + 1 : special.number; j++) {
                    if (special.currentSpecials[j]) {
                        if (props.feature.favoriteSpecial === "") {
                            thisComp.push(<>
                                <Button variant="success" onClick={() => setFavoriteSpecial(j)}>{special.currentSpecials[j]}</Button>
                            </>)
                        }
                        thisComp.push(<>
                            <div>{special.currentSpecials[j]}</div>
                            <Button variant="light" onClick={() => updateRefreshSpecial(i,j,null)}>X</Button>
                        </>)
                    } else {
                        thisComp.push(<div>X</div>)
                    }
                }
                thisComp.push(
                    <Form>
                        <InputGroup>
                            <InputGroup.Prepend><InputGroup.Text>Custom {special}</InputGroup.Text></InputGroup.Prepend>
                            <Form.Control type="text" value={this.state[`customSpecial_${i}_${j}`]} onChange={(e) => this.updateCustomSpecial(e, i, j)} />
                            <InputGroup.Append><Button variant="info" onClick={() => this.updateRefreshSpecial(i,j,this.state[`currentSpecial_${i}_${j}`])}>Add custom {special}</Button></InputGroup.Append>
                        </InputGroup>
                    </Form>
                );
                specialComps.push(thisComp);
            });
            return specialComps;
        }
    }
    
    render() {
        return (
            <Card>
                <Accordion.Collapse eventKey={this.props.index}>
                    <Card.Body>
                        {titleComp()}
                        {featureComp()}
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        )
    }
}

export default CharacterFeature;