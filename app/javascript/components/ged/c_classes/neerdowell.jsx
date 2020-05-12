import React, { useEffect } from 'react';
import { randomMagicItem } from '../../../dndb-tables';
import ClassDescription from '../class_description';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function Neerdowell(props) {
    const { currentSpecials } = props;
    const input = React.createRef();

    useEffect(() => {
        if (!currentSpecials.items) {
            createItems();
        }
    })

    function createItems() {
        let items = [];
        for (let i = 0; i < 4; i++) {
            items.push(randomMagicItem());
        };
        props.updateState('currentSpecials', { 'items': items }, { rest: true })
    }

    function consumeItem(itemInd) {
        let newItems = currentSpecials.items;
        const lostItem = newItems.splice(itemInd, 1);
        props.updateState('currentSpecials', { 'items': newItems }, { lose_resource: { ind: ["items"], string: lostItem } });
    }

    function addCustomItem(randomize) {
        let newItems = currentSpecials.items;
        const newItem = randomize ? randomMagicItem() : input.current.value;
        newItems.push(newItem);
        props.updateState('currentSpecials', { 'items': newItems }, { gain_resource: { category: "Stolen Item", string: newItem } })
    }

    function itemsDisp() {
        if (currentSpecials.items) {
            return (
                <>
                <div className="grenze">Legitimately Acquired Items</div>
                {currentSpecials.items.map((item, i) => {
                    return (
                        <InputGroup key={i} className="my-1">
                            <InputGroup.Text className="w-75"><strong>{item}</strong></InputGroup.Text>
                            <InputGroup.Append>
                                <Button variant="outline-secondary" onClick={() => consumeItem(i)}>Use</Button>
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
                <em>A roguish thief with a vast collection of stolen trinkets and devices.</em>
            </Row>
            <Row>
                <Col xs={12} md={5} className="mt-3">
                    <ClassDescription>
                        <div>Magic Ability:<br /><strong>Bag of Tricks</strong></div>
                        <div>The Ne'erdowell never leaves home without a seemingly bottomless bag of single-use magic items of dubious provenance.</div>
                        <div>Whenever you rest, a new set of four magic items is available for use from the bag.</div>
                        <ul>
                            <li>Activate its magical property for one action</li>
                            <li>Change its weapon type or its magical property</li>
                        </ul>
                    </ClassDescription>
                </Col>
                <Col xs={12} md={5} className="mt-3">
                    {itemsDisp()}
                    <Form>
                        <InputGroup>
                            <InputGroup.Prepend><InputGroup.Text>Add Item</InputGroup.Text></InputGroup.Prepend>
                            <Form.Control ref={input} />
                        </InputGroup>
                        <Form.Group className="d-flex justify-content-around">
                            <Button size="lg" variant="dark" onClick={() => addCustomItem(false)}>+</Button>
                            <Button size="lg" variant="dark" onClick={() => addCustomItem(true)}>🎲</Button>
                        </Form.Group>
                        <Form.Group className="d-flex justify-content-center">
                            <Button variant="success" className="ability-randomize-button" onClick={createItems}>Rest<br/>Refresh Stolen Items</Button>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}