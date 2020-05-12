import React, { useState, useEffect } from 'react';
import { random, EQUIPMENT, STARTING_ITEMS, WEAPONS, randomMagicItem, randomResourceItem } from '../../dndb-tables';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';

export default function Inventory(props) {

    const [newItemForm, setNewItemForm] = useState("");

    function compressInv(inv, section) {
        const start = section === "stashed" ? 2 : 0;
        const end = section === "carried" ? 2 : 11;
        let changed = false;
        for (let i = start; i < end; i++) {
            if (!inv[i]) {
                let looped = false;
                for (let j = i + 1; j < end + 1; j++) {
                    if (!!inv[j]) {
                        inv[i] = inv[j]
                        inv[j] = "";
                        changed = true;
                        looped = true;
                        break;
                    }
                }
                if (!looped) break;
            }
        }
        return inv;
    }

    function freeSpace(section) {
        //Checks section: returns index of first free space or false
        const start = section === "stashed" ? 3 : 0
        const end = section === "carried" ? 3 : 12
        for (let i = start; i < end; i++) {
            if (!props.inventory[i]) return i;
        }
        return false;
    }

    function moveItem(num, destination) {
        if (props.inventory[num] === "") return;
        let newInventory = Object.assign({}, props.inventory);
        const space = freeSpace(destination);
        if (space) {
            newInventory[space] = props.inventory[num];
            newInventory[num] = "";
            newInventory = compressInv(newInventory, destination === "stashed" ? "carried" : "stashed");
            props.updateState("inventory", newInventory, { no_op: true })
        }
    }

    function createItem(e) {
        e.preventDefault();
        const space = freeSpace("all")
        if (space) {
            let newInventory = props.inventory;
            newInventory[space] = newItemForm;
            props.updateState('inventory', newInventory, { gain_item: { item: newInventory[space] } });
            setNewItemForm("");
        }
    }

    function discardItem(ind) {
        let newInventory = props.inventory;
        const itemString = props.inventory[ind];
        newInventory[ind] = "";
        newInventory = compressInv(newInventory, ind < 3 ? "carried" : "stashed");
        props.updateState('inventory', newInventory, { lose_item: { ind: ind, string: itemString } });
    }

    function itemDropdownDisp(stashed, ind) {
        if (props.inventory[ind]) {
            return (
                <InputGroup.Append>
                    <Dropdown as={ButtonGroup}>
                        <Dropdown.Toggle split variant="secondary" />
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => moveItem(ind, stashed ? "carried" : "stashed")}>
                                {stashed ? "Carry" : "Stash"}
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={() => discardItem(ind)}>
                                Discard
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </InputGroup.Append>
            )
        }
    }

    function createInventoryRow(stashed, startingInd) {
        let spaces = [];
        for (let i = 0; i < 3; i++) {
            spaces.push(
                <Col xs={12} md={4} key={i}>
                    <InputGroup>
                        <Form.Control
                            readOnly
                            name={startingInd + i} 
                            id={stashed ? `stashed-${startingInd + i - 3}` : `carried-${i}`}
                            value={props.inventory[startingInd + i] || ""} />
                        {itemDropdownDisp(stashed, startingInd + i)}
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
                <Form onSubmit={createItem}>
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text className="grenze">Add Item</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control value={newItemForm} onChange={(e) => setNewItemForm(e.currentTarget.value)} />
                        <InputGroup.Append>
                            <Button type="submit" variant="secondary">Add</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Form>
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