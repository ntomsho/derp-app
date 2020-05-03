import React, {useState} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { EQUIPMENT, WEAPONS, STARTING_ITEMS, random, randomMagicItem, randomResourceItem } from '../../dndb-tables';

export default function CharGenEquipment(props) {
    const itemPackage = STARTING_ITEMS[props.cClass];
    const [startingChoicesMade, setStartingChoicesMade] = useState(JSON.stringify(props.inventory) !== JSON.stringify(["", "", "", "", "", "", "", "", "", "", "", ""]));
    
    const randomRequired = ["Melee Weapon", "Ranged Weapon", "Weapon Oil", "Animal Totem", "Scroll of Power", "Command Scroll", "Songbook", "Holy Symbol", "Alchemical Ingredient", "Magic Item"];

    function createStartingInv() {
        if (props.inventoryStartingChoices.length !== itemPackage.length) return;
        let newInv = props.inventoryStartingChoices;
        let standardItems = [];
        for (let i = 0; i < 8 - itemPackage.length; i++) {
            standardItems.push(random(EQUIPMENT));
        }
        newInv = newInv.concat(standardItems);
        setStartingChoicesMade(true);
        for (let i = 0; i < props.inventoryStartingChoices.length; i++) {
            if (randomRequired.includes(newInv[i])) newInv[i] = randomizeItem(i);
        }
        props.updateSelection("inventory", newInv);
    }
    
    function startingEquipmentDisp() {
        if (props.cClass && JSON.stringify(props.inventory) === JSON.stringify(["", "", "", "", "", "", "", "", "", "", "", ""])) {
            return (
                <>
                    {itemPackage.map((choices, i) => {
                        return (
                            <Row key={i} className="my-2 justify-content-center">
                                {choiceField(choices, i)}
                            </Row>
                        )
                    })}
                    <Row className="justify-content-center">
                        <Button
                            disabled={props.inventoryStartingChoices.length !== itemPackage.length}
                            variant="primary"
                            onClick={createStartingInv}
                        >
                            Generate Starting Inventory
                        </Button>
                    </Row>
                </>
            )
        }
    }

    function choiceField(choices, ind) {
        return (
            <>
                {choices.map((choice, i) => {
                    return (
                        <Col key={i} xs={6} className={choices.length === 1 ? 'text-center' : i === 0 ? 'text-right' : 'text-left'}>
                            <Button
                                active={props.inventoryStartingChoices[ind] === choice}
                                onClick={() => startingChoice(choice, ind)}
                                variant="secondary"
                            >
                                {choice}
                            </Button>
                        </Col>
                    )
                })}
            </>
        )
    }

    function startingChoice(choice, ind) {
        let newChoices = props.inventoryStartingChoices;
        newChoices[ind] = choice;
        props.updateSelection('inventoryStartingChoices', newChoices, false);
    }

    function typeSpace(event) {
        let newInv = props.inventory;
        newInv[parseInt(event.target.name)] = event.target.value;
        props.updateSelection('inventory', newInv);
    }

    function randomizeSpace(index, reroll) {
        let newInv = props.inventory;
        newInv[index] = randomizeItem(index);
        props.updateSelection('inventory', newInv, reroll);
    }

    function randomizeItem(index) {
        switch (props.inventoryStartingChoices[index]) {
            case "Melee Weapon":
                return random(WEAPONS.slice(0, 18));
            case "Ranged Weapon":
                return random(WEAPONS.slice(19, 36));
            case "Weapon Oil":
            case "Animal Totem":
            case "Songbook":
            case "Command Scroll":
            case "Scroll of Power":
            case "Holy Symbol":
            case "Alchemical Ingredient":
                return randomResourceItem(props.inventoryStartingChoices[index])
            case "Magic Item":
                return randomMagicItem();
            default:
                return random(EQUIPMENT);
        }
        return 
    }

    function rerollButton(i) {
        if (randomRequired.includes(props.inventoryStartingChoices[i])) {
            return <Button variant="outline-dark" onClick={() => randomizeSpace(i, true)}>Reroll {props.inventoryStartingChoices[i]}</Button>
        } else if (i >= itemPackage.length) {
            return <Button variant="outline-dark" onClick={() => randomizeSpace(i, true)}>Reroll Equipment</Button>
        }
    }

    function finalEquipmentDisp() {
        return (
            <Container>
                {props.inventory.slice(0,8).map((inv, i) => {
                    return (
                        <Row key={i} className="my-1">
                            <InputGroup>
                                <Form.Control onChange={typeSpace} name={i} type="text" value={props.inventory[i]}></Form.Control>
                                <InputGroup.Append>
                                    {rerollButton(i)}
                                </InputGroup.Append>
                            </InputGroup>
                        </Row>
                    )
                })}
            </Container>
        )
    }

    if (startingChoicesMade) {
        return finalEquipmentDisp()
    } else {
        return startingEquipmentDisp()
    }
}