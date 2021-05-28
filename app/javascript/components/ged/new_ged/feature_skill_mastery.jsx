import React, { useState } from 'react';
import * as tables from '../../../ged-tables';
import CharacterFeature from './character_feature';
import Button from 'react-bootstrap/Button'
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';

class FeatureSkillMastery extends CharacterFeature {
    titleComp() {
        return <>
            <h3>Skill Mastery</h3>
            <div>Your mastery of one of the Civilized Skills has given you access to an advanced discipline within that field.</div>
        </>
    }

    resourceComp() {
        if (!props.feature.resource) return null;
        let resource = props.feature.resource;
        return <>
            <div className="grenze">{resource.name}</div>
            <Button disabled={resource.current <= 0} variant="outline-light" onClick={() => updateResource(false)}>-</Button>
            <span className="grenze">{resource.current}</span>
            <Button disabled={resource.current >= resource.max} variant="outline-dark" onClick={() => updateResource(true)}>+</Button>
        </>
    }

    updateResource(increment) {
        let newCurrent = props.feature.resource.current;
        if (increment && props.feature.resource.max && props.feature.resource.current < props.feature.resource.max) {
            newCurrent++;
        } else if (!increment && props.feature.resource.current > 0) {
            newCurrent--;
        }
        props.setField("currentCharge", newCurrent);
    }

    masteryComp() {
        if (!props.feature.mastery) return null;
        const skillMastery = props.feature.mastery;
        return (
            <>
            <div className="grenze">{skillMastery.name}</div>
            <div>{skillMastery.description}</div>
            <ul>
                {skillMastery.traits.forEach(trait => {
                    return <li>{trait}</li>
                })}
            </ul>
            </>
        )
    }

    setMastery(mastery) {
        let newState = Object.assign({}, props.feature);
        newState[mastery] = tables.SKILL_MASTERIES[props.feature.trainedSkill][mastery];
        newstate[mastery].name = mastery;
        props.updateFeature(newState, props.index, false);
    }

    featureComp() {
        if (!props.feature.trainedSkill) {
            return <>
                <Button className="random-button" disabled={props.rerolls <= 0 && props.feature.trainedSkill} variant="outline-dark" onClick={() => randomize("trainedSkill")}>Roll Trained Skill</Button>
            </>
        } else {
            return <>
                <h3>{props.feature.trainedSkill}</h3>
                {this.resourceComp()}
                {this.masteryComp()}
                <Dropdown>
                    <Dropdown.Toggle variant="light">{props.feature.mastery ? props.feature.mastery : "Choose a Mastery from your Trained Skill"}</Dropdown.Toggle>
                    <Dropdown.Menu>
                        {Object.keys(tables.SKILL_MASTERIES[props.feature.trainedSkill]).forEach(mastery => {
                            return (
                                <Dropdown.Item as="button" onClick={() => props.setField("mastery", tables.SKILL_MASTERIES[props.feature.trainedSkill][mastery])}>{mastery} - {tables.SKILL_MASTERIES[props.feature.trainedSkill][mastery].description}</Dropdown.Item>
                            )
                        })}
                    </Dropdown.Menu>
                </Dropdown>
                <Button className="random-button" disabled={props.rerolls <= 0 && props.feature.trainedSkill} variant="outline-dark" onClick={() => randomize("trainedSkill")}>Reroll Trained Skill</Button>
            </>
        }
    }
}

export default FeatureSkillMastery;