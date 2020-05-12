import React, { useEffect } from 'react';
import { random, SKILLS } from '../../../dndb-tables';
import ClassDescription from '../class_description';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

export default function KnightOfTushuze(props) {
    let { currentSpecials } = props;
    const input = React.createRef();

    useEffect(() => {
        if (!currentSpecials.blessings) {
            createBlessings();
        }
    })

    function randomBlessing() {
        return random(SKILLS);
    }

    function createBlessings() {
        let blessings = [];
        for (let i = 0; i < 4; i++) {
            blessings.push(randomBlessing());
        };
        props.updateState('currentSpecials', { 'blessings': blessings }, { rest: true })
    }

    function consumeBlessing(blessingInd) {
        let newBlessings = currentSpecials.blessings;
        const lostBlessing = newBlessings.splice(blessingInd, 1);
        props.updateState('currentSpecials', { 'blessings': newBlessings }, { lose_resource: { ind: ['blessings'], string: lostBlessing } });
    }

    function addCustomBlessing(randomize) {
        let newBlessings = currentSpecials.blessings;
        const newBlessing = randomize ? randomBlessing() : input.current.value
        newBlessings.push(newBlessing);
        props.updateState('currentSpecials', { 'blessings': newBlessings }, { gain_resource: { category: "Blessing", string: newBlessing } });
    }

    function blessingVirtues(blessing, i) {
        //Formatting looks bad on desktop, but so does a lot of it
        switch (blessing) {
            case "Believe in Yourself":
            case "Cardio":
            case "Creepin'":
                return (
                    <>
                    <Dropdown.Item as="button" onClick={() => consumeBlessing(i)}>Magic Advantage</Dropdown.Item>
                    <Dropdown.Item as="button" onClick={() => consumeBlessing(i)}>Holy Light</Dropdown.Item>
                    </>
                )
            case "Brute Force":
            case "Rad Moves":
            case "Shootin'":
                return (
                    <>
                    <Dropdown.Item as="button" onClick={() => consumeBlessing(i)}>Magic Advantage</Dropdown.Item>
                    <Dropdown.Item as="button" onClick={() => consumeBlessing(i)}>Lay on Hands (1d6 healing)</Dropdown.Item>
                    </>
                )
            case "Macgyver":
            case "Man vs. Wild":
            case "Thinkiness":
                return (
                    <>
                    <Dropdown.Item as="button" onClick={() => consumeBlessing(i)}>Magic Advantage</Dropdown.Item>
                    <Dropdown.Item as="button" onClick={() => consumeBlessing(i)}>Divine Shield</Dropdown.Item>
                    </>
                )
        }
    }

    function blessingsDisplay() {
        if (currentSpecials.blessings) {
            return (
                <>
                <div className="grenze">Blessings of Tushuze</div>
                {currentSpecials.blessings.map((blessing, i) => {
                    return (
                        <InputGroup key={i} className="my-1">
                            <InputGroup.Text className="w-75"><span>Blessing of <strong>{` ${blessing}`}</strong></span></InputGroup.Text>
                            <InputGroup.Append>
                                <DropdownButton variant="secondary" title="Uses">
                                    {blessingVirtues(blessing, i)}
                                </DropdownButton>
                            </InputGroup.Append>
                        </InputGroup>
                    )
                })}
                </>
            )
        }
    }

    return (
        <Container>
            <Row>
                <em>A knight of a righteous and goodly order, doing good deeds and providing nice blessings.</em>
            </Row>
            <Row>
                <Col xs={12} md={5} className="mt-3">
                    <ClassDescription>
                        <div>Magic Ability:<br /><strong>Blessings of Tushuze</strong></div>
                        <div>Members of the order gain five blessings per day, each of which is tied to a Skill and a Virtue of Tushuze.</div>
                        <br/>
                        <div>You can spend a Blessing to:</div>
                        <ul>
                            <li>(Any) Give yourself or an ally Magic Advantage on an action that uses the listed Skill</li>
                            <li>(Bravery) Create an intensely bright light that evil things hate for the duration of the scene</li>
                            <li>(Compassion) Lay hands on yourself or an ally to heal them for 1d6 Health</li>
                            <li>(Honor) Create a divine shield to protect yourself or an ally</li>
                        </ul>
                    </ClassDescription>
                </Col>
                <Col xs={12} md={7} className="mt-3">
                    {blessingsDisplay()}
                    <Form>
                        <InputGroup>
                            <InputGroup.Prepend><InputGroup.Text>Add Blessing</InputGroup.Text></InputGroup.Prepend>
                            <Form.Control as="select" ref={input}>
                                <option value="Believe in Yourself">Believe in Yourself (Bravery)</option>
                                <option value="Brute Force">Brute Force (Compassion)</option>
                                <option value="Cardio">Cardio (Bravery)</option>
                                <option value="Creepin'">Creepin' (Bravery)</option>
                                <option value="Man vs. Wild">Man vs. Wild (Honor)</option>
                                <option value="Macgyver">Macgyver (Honor)</option>
                                <option value="Rad Moves">Rad Moves (Compassion) </option>
                                <option value="Shootin'">Shootin' (Compassion)</option>
                                <option value="Thinkiness">Thinkiness (Honor)</option>
                            </Form.Control>
                        </InputGroup>
                        <Form.Group className="d-flex justify-content-around">
                            <Button size="lg" variant="dark" onClick={() => addCustomBlessing(false)}>+</Button>
                            <Button size="lg" variant="dark" onClick={() => addCustomBlessing(true)}>🎲</Button>
                        </Form.Group>
                        <Form.Group className="d-flex justify-content-center">
                            <Button variant="success" className="ability-randomize-button" onClick={createBlessings}>Rest<br/>Refresh Blessings</Button>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}