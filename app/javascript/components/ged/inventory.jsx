import React, { useState, useEffect } from 'react';
import { random, EQUIPMENT, STARTING_ITEMS, WEAPONS, randomMagicItem, randomResourceItem } from '../../dndb-tables';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function Inventory(props) {

    function moveToStash(num) {
        if (props.inventory[num] === "") return;
        let newInventory = Object.assign({}, props.inventory);
        let freeSpace = false;
        for (let i = 3; i < 12; i++) {
            if (!props.inventory[i]) {
                newInventory[i] = props.inventory[num];
                newInventory[num] = "";
                freeSpace = true;
                break;
            }
        }
        if (freeSpace) props.updateState("inventory", newInventory);
    }

    function moveToCarried(num) {
        if (props.inventory[num] === "") return;
        let newInventory = Object.assign({}, props.inventory);
        let freeSpace = false;
        for (let i = 0; i < 3; i++) {
            if (!props.inventory[i]) {
                newInventory[i] = props.inventory[num];
                newInventory[num] = "";
                freeSpace = true;
                break;
            }
        }
        if (freeSpace) props.updateState("inventory", newInventory);
    }

    function handleChange(event) {
        let newInventory = props.inventory;
        newInventory[parseInt(event.target.name)] = event.target.value;
        props.updateState('inventory', newInventory);
    }

    function createInventoryRow(stashed, startingInd) {
        let spaces = [];
        for (let i = 0; i < 3; i++) {
            spaces.push(
                <Col xs={12} md={4} key={i}>
                    <InputGroup>
                        <Form.Control onChange={handleChange} 
                            name={startingInd + i} 
                            id={stashed ? `stashed-${startingInd + i - 3}` : `carried-${i}`}
                            value={props.inventory[startingInd + i] || ""} />
                        <InputGroup.Append>
                            <Button variant="outline-secondary" 
                                onClick={stashed ? () => moveToCarried(startingInd + i) : () => moveToStash(i)}>
                                    {stashed ? "Carry" : "Stash"}
                            </Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Col>
            )
        }
        return spaces;
    }

    return (
        <Container>
            <Row>
                <h2>Inventory</h2>
            </Row>
            <Row>
                <Col xs={12}>
                    <Row>
                    <h3>Carried Gear</h3>
                    </Row>
                    <Row>
                        {createInventoryRow(false, 0)}
                    </Row>
                </Col>
                <Col xs={12}>
                    <Row>
                        <h3>Stashed Gear</h3>
                    </Row>
                    <Row>
                        {createInventoryRow(true, 3)}
                    </Row>
                    <Row>
                        {createInventoryRow(true, 6)}
                    </Row>
                    <Row>
                        {createInventoryRow(true, 9)}
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}