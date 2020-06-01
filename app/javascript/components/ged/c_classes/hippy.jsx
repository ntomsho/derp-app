import React, { useState, useEffect } from 'react';
import { randomAnimal, MUTATIONS, random } from '../../../dndb-tables';
import ClassDescription from '../class_description';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function Hippy(props) {
    const { currentSpecials } = props;
    const [currentForm, setCurrentForm] = useState(null);
    const [currentMutation, setCurrentMutation] = useState(null);
    const [goodberries, setGoodberries] = useState(0);
    const input1 = React.createRef();
    const input2 = React.createRef();

    useEffect(() => {
        if (!currentSpecials.forms) {
            createFormsAndGifts();
        }
    })

    function createFormsAndGifts() {
        let forms = [];
        let gifts = [];
        for (let i = 0; i < 3; i++) {
            let newForm = randomAnimal();
            while (forms.includes(newForm)) {
                newForm = randomAnimal();
            }
            forms.push(newForm);
        };
        for (let i = 0; i < 5; i++) {
            let newGift = random(MUTATIONS);
            while (gifts.includes(newGift)) {
                newGift = random(MUTATIONS);
            }
            gifts.push(newGift);
        }
        props.updateState('currentSpecials', { 'forms': forms, 'gifts': gifts }, { rest: true });
    }

    function sacrificeForm(formInd) {
        let newResources = Object.assign({}, currentSpecials);
        const lostResource = newResources.forms.splice(formInd, 1);
        newResources.gifts.push(random(MUTATIONS));
        props.updateState('currentSpecials', newResources, { lose_resource: { ind: ['forms'], string: lostResource } });
    }

    function mutationDisp() {
        if (currentMutation) {
            return(
                <>
                <Row className="justify-content-center">
                    <div className="grenze">Current Available Mutation</div>
                </Row>
                <Row className="justify-content-center align-items-center">
                    <h3>
                        Mutation: {currentMutation}
                    </h3>
                    <Button size="sm" className="absolute-button-right" variant="secondary" onClick={() => setCurrentMutation(null)}>End Scene</Button>
                </Row>
                </>
            )
        }
    }

    function consumeGift(giftInd, goodberry) {
        if (goodberry) setGoodberries(goodberries + Math.floor(Math.random() * 6) + 1);
        let newResources = Object.assign({}, currentSpecials);
        const lostGift = newResources.gifts.splice(giftInd, 1);
        props.updateState('currentSpecials', newResources, { lose_resource: { ind: ['gifts'], string: lostGift } })
    }

    function activateGift(giftInd) {
        setCurrentForm(null);
        setCurrentMutation(currentSpecials.gifts[giftInd])
        consumeGift(giftInd);
    }

    function addCustomForm(randomize) {
        let newResources = currentSpecials;
        const newForm = randomize ? randomAnimal() : input1.current.value
        newResources.forms.push(newForm);
        props.updateState('currentSpecials', newResources, { gain_resource: { category: "Form", string: newForm } })
    }

    function addCustomGift(randomize) {
        let newResources = currentSpecials;
        const newGift = randomize ? random(MUTATIONS) : input2.current.value
        newResources.gifts.push(newGift);
        props.updateState('currentSpecials', newResources, { gain_resource: { category: "Gift", string: newGift } })
    }

    function changeForm(form) {
        if (!currentForm) {
            setCurrentForm(form);
        } else {
            if (currentForm === form) setCurrentForm(null);
        }
    }

    function formsDisp() {
        if (currentSpecials.forms && currentSpecials.forms.length > 0) {
            return (
                <>
                <div className="grenze">Animal Forms</div>
                {currentSpecials.forms.map((form, i) => {
                    return (
                        <InputGroup key={i} className="my-1">
                            <Button variant={currentForm ? currentForm === form ? "success" : "secondary" : "outline-success" } onClick={() => changeForm(form)} className="w-75"><div><strong>{currentMutation ? currentMutation + " " : ""}{form}</strong> Form</div></Button>
                            <Button variant="danger" onClick={() => sacrificeForm(i)}>X</Button>
                        </InputGroup>
                    )
                })}
                <InputGroup className="my-1">
                    <Button variant={currentForm ? "outline-success" : "success"} onClick={() => setCurrentForm(null)}><div><strong>{props.raceString}</strong> Form</div></Button>
                </InputGroup>
                </>
            )
        }
    }

    function eatGoodberry() {
        if (props.health >= props.maxHealth) return;
        setGoodberries(goodberries - 1)
        props.updateState('health', props.health + 1);
    }

    function goodberriesDisp() {
        if (goodberries) {
            return (
                <InputGroup>
                    <InputGroup.Text>
                        Goodberries: {goodberries}
                    </InputGroup.Text>
                    <InputGroup.Append>
                        <Button variant="success" onClick={eatGoodberry}>Nom</Button>
                        <Button variant="warning" onClick={() => setGoodberries(goodberries - 1)}>Give</Button>
                    </InputGroup.Append>
                </InputGroup>
            )
        }
    }

    function giftsDisp() {
        if (currentSpecials.gifts && currentSpecials.gifts.length > 0) {
            return (
                <>
                <div className="grenze">Nature's Gifts</div>
                {currentSpecials.gifts.map((gift, i) => {
                    return (
                        <InputGroup key={i} className="my-1">
                            <InputGroup.Text className="w-50"><strong>{gift}</strong></InputGroup.Text>
                            <InputGroup.Append>
                                <Button variant="outline-secondary" onClick={() => activateGift(i)}>Use</Button>
                                <Button variant="success" onClick={() => consumeGift(i, true)}>🍏</Button>
                                <Button variant="danger" onClick={() => consumeGift(i, false)}>X</Button>
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
                <em>A totally chill master of nature who can shapeshift into animals.</em>
            </Row>
            <Row>
                <Col xs={12} md={5} className="mt-3">
                    <ClassDescription>
                        <div>Magic Ability:<br /><strong>Nature's Gifts & Animal Forms</strong></div>
                        <div>Whenever you rest, you are given a set of three animal forms and three Gifts, each of which is associated with a mutation.</div>
                        <div>Once per scene, you can change into one of your animal forms or you can spend a Gift to change into one of your forms with the Gift's mutation applied to it.</div>
                        <div>When in an animal form, you gain Magic Advantage on any actions the form is well suited for. You can give up one of your animal forms to gain a new random Gift.</div>
                        <div>You can spend a Gift to: </div>
                        <ul>
                            <li>Change one of your forms to a new random animal.</li>
                            <li>Produce 1d6 healing Goodberries. Eating one within a day of its creation restores 1 Health.</li>
                        </ul>
                        <br/>
                        <strong className="grenze">Casting Skills</strong>
                        <div><strong>Cardio:</strong> Any roll in animal form that would use Brute Force or Rad Moves</div>
                        <div><strong>Man vs. Wild:</strong> Any roll in animal form that wouldn't use Brute Force or Rad Moves</div>
                        <br/>
                        <div>Resource Item:<br/><strong>Animal Totems</strong></div>
                        <div>Spend an Animal Totem to gain a form that is the totem's animal.</div>
                    </ClassDescription>
                </Col>
                <Col xs={12} md={7} className="mt-3">
                    {mutationDisp()}
                    <Row>
                        <Col>
                            {formsDisp()}
                            {giftsDisp()}
                            {goodberriesDisp()}
                        </Col>
                    </Row>
                    <Form>
                        <InputGroup>
                            <InputGroup.Prepend><InputGroup.Text>Add Animal Form</InputGroup.Text></InputGroup.Prepend>
                            <Form.Control ref={input1}></Form.Control>
                        </InputGroup>
                        <Form.Group className="d-flex justify-content-around">
                            <Button size="lg" variant="dark" onClick={() => addCustomForm(false)}>+</Button>
                            <Button size="lg" variant="dark" onClick={() => addCustomForm(true)}>🎲</Button>
                        </Form.Group>
                    </Form>
                    <Form>
                        <InputGroup>
                            <InputGroup.Prepend><InputGroup.Text>Add Gift</InputGroup.Text></InputGroup.Prepend>
                                <Form.Control ref={input2}></Form.Control>
                        </InputGroup>
                        <Form.Group className="d-flex justify-content-around">
                            <Button size="lg" variant="dark" onClick={() => addCustomGift(false)}>+</Button>
                            <Button size="lg" variant="dark" onClick={() => addCustomGift(true)}>🎲</Button>
                        </Form.Group>
                        <Form.Group className="d-flex justify-content-center">
                            <Button variant="success" className="ability-randomize-button" onClick={createFormsAndGifts}>Rest<br/>Refresh Gifts and Forms</Button>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}