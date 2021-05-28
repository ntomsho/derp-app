import React, { useState } from 'react';
import * as tables from '../../../ged-tables';
import CharacterFeature from './character_feature';
import Button from 'react-bootstrap/Button'
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';

class FeatureFightingStyle extends CharacterFeature {
    titleComp() {
        return <>
            <h3>Fighting Style</h3>
            <div>You are a seasoned fighter training in a single randomly rolled Combat Skill.</div>
        </>
    }

    featureComp() {
        if (!props.feature.combatSkill) {
            return <>
                <Button className="random-button" disabled={props.rerolls <= 0 && props.feature.combatSkill} variant="outline-dark" onClick={() => randomize("combatSkill")}>Roll Combat Skill</Button>
            </>
        } else {
            return <>
                <div className="grenze">{props.feature.combatSkill}</div>
                <Dropdown>
                    <Dropdown.Toggle variant="light">{props.feature.fightingStyleBonus ? props.feature.fightingStyleBonus : "Choose a Fighting Style Bonus"}</Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item as="button" onClick={() => props.setField("fightingStyleBonus", "You gain proficiency in Armor.")}>You gain proficiency in Armor.</Dropdown.Item>
                        <Dropdown.Item as="button" onClick={() => props.setField("fightingStyleBonus", tables.FIGHTING_STYLE_BONUSES[props.feature.combatSkill])}>{tables.FIGHTING_STYLE_BONUSES[props.feature.combatSkill]}</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Button className="random-button" disabled={props.rerolls <= 0 && props.feature.combatSkill} variant="outline-dark" onClick={() => randomize("combatSkill")}>Reroll Combat Skill</Button>
            </>
        }
    }
}

export default FeatureFightingStyle;