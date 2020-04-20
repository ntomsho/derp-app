import React, { useState, useEffect } from 'react';
import { random, WEAPONS, GERUNDS, ELEMENTS_OF } from '../../../dndb-tables';
import RaceTraits from '../race_traits';
import FavoriteTags from '../favorite_tags';
import ClassDescription from '../class_description';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function Battlebro(props) {
    let { currentSpecials } = props;
    const [currentWeapon, setCurrentWeapon] = useState({'type': randomWeaponType()});
    const input1 = React.createRef();
    const input2 = React.createRef();
    const input3 = React.createRef();

    useEffect(() => {
        if (!currentSpecials.weapons) {
            props.updateState('currentSpecials', { 'weapons': [] });
        }
    })

    function randomWeaponType() {
        return random(WEAPONS.slice(0,18));
    }

    function randomWeapon() {
        const specialCat = random(["Verb", "Element"]);
        const special = specialCat === "Verb" ? random(GERUNDS) : random(ELEMENTS_OF);
        return { 'category': specialCat, 'special': special, 'type': randomWeaponType() }
    }

    function addCustomWeapon(randomize) {
        if (!randomize && (!input1.current.value || !input2.current.value || !input3.current.value)) return;
        let newWeapons = Object.assign([], currentSpecials.weapons);
        if (randomize) {
            newWeapons.push(randomWeapon());
        } else {
            newWeapons.push({ 'category': input1.current.value, 'special': input2.current.value, 'type': input3.current.value });
        }
        props.updateState('currentSpecials', { 'weapons': newWeapons });
    }

    function weaponString(weapon) {
        if (!weapon.special) {
            return weapon.type;
        }
        if (weapon.category === "Verb") {
            return weapon.special + " " + weapon.type;
        } else {
            return weapon.type + " of " + weapon.special;
        }
    }

    function transformWeapon(weaponInd) {
        const newWeapon = currentSpecials.weapons[weaponInd]
        setCurrentWeapon({ 'category': newWeapon.category, 'special': newWeapon.special, 'type': newWeapon.type });
        let newWeapons = currentSpecials.weapons;
        newWeapons.splice(weaponInd, 1);
        props.updateState('currentSpecials', { 'weapons': newWeapons });
    }

    function createWeaponForms() {
        setCurrentWeapon({ 'type': randomWeaponType() })
        let weapons = [];
        for (let i = 0; i < 3; i++) {
            weapons.push(randomWeapon());
        }
        props.updateState('currentSpecials', { 'weapons': weapons });
    }

    function currentWeaponDisp() {
        let endSceneButton;
        if (currentWeapon.special) endSceneButton = <Button size="sm" className="absolute-button-right" variant="secondary"
            onClick={() => {
                let nullSpecial = Object.assign({}, currentWeapon);
                nullSpecial.special = null;
                setCurrentWeapon(nullSpecial);
        }}>End Scene</Button>

        return (
            <>
            <h1>{weaponString(currentWeapon)}</h1>
            {endSceneButton}
            </>
        )
    }

    function weaponsDisp() {
        if (currentSpecials.weapons) {
            return (
                <>
                <div className="grenze">Weapon Forms</div>
                {/* <ButtonGroup> */}
                    {currentSpecials.weapons.map((weapon, i) => {
                        return (
                            <InputGroup key={i} className="my-1">
                                <InputGroup.Text className="w-75"><strong>{weaponString(weapon)}</strong></InputGroup.Text>
                                <InputGroup.Append>
                                    <Button variant="outline-secondary" onClick={() => transformWeapon(i)}>Use</Button>
                                </InputGroup.Append>
                            </InputGroup>
                        )
                    })}
                {/* </ButtonGroup> */}
                </>
            )
        }
    }

    return (
        <Container>
            <Row>
                <em>A graduate of Fighter College; a skilled combatant with a transforming magical weapon.</em>
            </Row>
            <Row>
                <Col xs={12} md={5} className="mt-3">
                    <ClassDescription>
                        <div>Magic Ability:<br/><strong>Graduate Weapon</strong></div>
                        <div>Your capstone project from Fighter College is a shapechanging weapon. Whenever you rest, it changes shape and generates a set of three weapon types, each with a magical property.</div>
                        <div>You can expend one of the other forms to transform the weapon into that shape and it takes on that magic property for the rest of the scene.</div>
                        <div>At the end of the scene, it remains in the last weapon form you gave it. Activating another form before the end of the scene overwrites the current form and magic property.</div>
                        <br/>
                        <div>Resource Item:<br/><strong>Weapon Oil</strong></div>
                        <div>Use a Weapon Oil to charge your weapon with the oil's property. You can also randomize its form.</div> 
                    </ClassDescription>
                </Col>
                {/* <FavoriteTags updateState={props.updateState} favoriteTags={props.favoriteTags} savedTag={props.savedTag} resourceName="Weapon Forms" /> */}
                <Col xs={12} md={7} className="mt-3">
                    <Row className="justify-content-center">
                        <div className="grenze">Graduate Weapon Current Form</div>
                    </Row>
                    <Row className="justify-content-center align-items-center">
                        {currentWeaponDisp()}
                    </Row>
                    {weaponsDisp()}
                    <Form>
                        <InputGroup>
                            <InputGroup.Prepend><InputGroup.Text>Add Weapon Form</InputGroup.Text></InputGroup.Prepend>
                            <Form.Control as="select" ref={input1}>
                                <option value="Verb">Verb</option>
                                <option value="Element">Element</option>
                            </Form.Control>
                        </InputGroup>
                        <InputGroup>
                            <InputGroup.Prepend><InputGroup.Text>Magic Property</InputGroup.Text></InputGroup.Prepend>
                            <Form.Control ref={input2} />
                        </InputGroup>
                        <InputGroup>
                            <InputGroup.Prepend><InputGroup.Text>Weapon Type</InputGroup.Text></InputGroup.Prepend>
                            <Form.Control ref={input3} />
                        </InputGroup>
                        <Form.Group className="d-flex justify-content-around">
                            <Button size="lg" variant="dark" onClick={() => addCustomWeapon(false)}>+</Button>
                            <Button size="lg" variant="dark" onClick={() => addCustomWeapon(true)}>🎲</Button>
                        </Form.Group>
                        <Form.Group className="d-flex justify-content-center">
                            <Button variant="dark" className="ability-randomize-button" onClick={createWeaponForms}>Generate Weapon Forms<br />(On rest)</Button>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}