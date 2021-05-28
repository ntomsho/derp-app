import React, { useState } from 'react';
import * as tables from '../../../ged-tables';
import CharacterFeature from './character_feature';
import Button from 'react-bootstrap/Button'
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

class FeatureMagicArtifact extends CharacterFeature {
    titleComp() {
        return <>
            <h3>Magic Artifact</h3>
            <div>A powerful magic artifact has bound itself to you.</div>
        </>
    }

    chargeComp() {
        if (props.feature.charge && props.feature.maxCharge === undefined) {
            props.setField("maxCharge", props.feature.charge);
            props.setField("currentCharge", props.feature.baseZeroCharge ? 0 : props.feature.charge);
        }
        if (props.feature.currentCharge && props.feature.maxCharge) {
            return <>
                <div className="grenze">Charge</div>
                <Button disabled={props.feature.currentCharge <= 0} variant="outline-light" onClick={() => updateCharge(false)}>-</Button>
                <span className="grenze">{props.feature.currentCharge}</span>
                <Button disabled={props.feature.currentCharge >= props.feature.maxCharge} variant="outline-dark" onClick={() => updateCharge(true)}>+</Button>
            </>
        }
    }

    updateCharge(increment) {
        let newCharge = props.feature.currentCharge;
        if (increment && props.feature.currentChange < props.feature.maxCharge) {
            newCharge++;
        } else if (!increment && props.feature.currentChange > 0) {
            newCharge--;
        }
        props.setField("currentCharge", newCharge);
    }

    artifactComp(artifact) {
        if (props.feature.artifact === "Boomerang / Multishot Weapon") {
            if (!props.feature.weapon) {
                return <div>If this weapon is a melee weapon, it is a Boomerang Weapon. If this weapon is a ranged or thrown weapon, it is a Multishot Weapon.</div>
            } else if (tables.WEAPONS["Heavy Melee"].includes(props.feature.weapon) || tables.WEAPONS["Light Melee"].includes(props.feature.weapon)) {
                return artifactComp(artifact.boomerang);
            } else {
                return artifactComp(artifact.multishot);  
            }
        }
        return (
            <>
            <div>{tables.MAGIC_ARTIFACT_INFO[props.feature.artifact].description}</div>
            <ul>
                {tables.MAGIC_ARTIFACT_INFO[props.feature.artifact].traits.forEach(trait => {
                    return <li>{trait}</li>
                })}
            </ul>
            </>
        )
    }
    
    featureComp() {
        let components = [];
        if (props.feature.artifactType) {
            components.push(
                <div>{tables.ARTIFACT_TYPE_DESCRIPTIONS[props.feature.artifactType]}</div>
            )
        }
        if (props.feature.artifact) {
            components.push(
                <h3>{props.feature.artifact}</h3>,
                artifactComp(tables.MAGIC_ARTIFACT_INFO[props.feature.artifact])
            );

            if (props.feature.artifactType === "Magic Weapon") {
                components.push(
                    <>
                    <div>Weapon Type: {props.feature.weaponType ? props.feature["weapon"] : ""}</div>
                    <Button className="random-button" disabled={props.rerolls <= 0 && props.feature.artifact} variant="outline-dark" onClick={() => this.randomize("weapon")}>Roll Weapon Type</Button>
                    </>
                )
            }
            if (props.feature.currentCharge) {
                components.push(chargeComp());
            }

            if (props.feature.specials) {
                components.push(specialComp());
            }

            if (props.feature.specialRefresh) {
                components.push(specialRefreshComp());
            }
        }
        if (props.feature.artifactType) {
            components.push(
                <Button className="random-button" disabled={props.rerolls <= 0 && props.feature.artifact} variant="outline-dark" onClick={() => this.randomize("artifact")}>Roll Artifact</Button>
            )
        }
        components.push(
            <Button className="random-button" disabled={props.rerolls <= 0 && props.feature.artifactType} variant="outline-dark" onClick={() => this.randomize("artifactType")}>Roll Artifact Type</Button>
        )
    }
}

export default FeatureMagicArtifact;