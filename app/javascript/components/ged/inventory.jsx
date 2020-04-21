import React, { useState, useEffect } from 'react';
import { random, EQUIPMENT, STARTING_ITEMS, WEAPONS, randomMagicItem, randomResourceItem } from '../../dndb-tables';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function Inventory(props) {
    const [startingChoices, setStartingChoices] = useState([])

    useEffect(() => {
        if (props.cClass) {
            const itemPackage = STARTING_ITEMS[props.cClass]
            let startChoiceArr = [];
            for (let i = 0; i < itemPackage.length; i++) {
                if (itemPackage[i].length === 1) {
                    startChoiceArr.push(itemPackage[i][0])
                } else {
                    startChoiceArr.push(undefined)
                }
            }
            setStartingChoices(startChoiceArr)
        }
    }, [props.cClass])

    // function startingEquipmentDisp() {
    //     if (props.cClass && JSON.stringify(props.inventory) === JSON.stringify(["", "", "", "", "", "", "", "", "", "", "", ""])) {
    //         const itemPackage = STARTING_ITEMS[props.cClass];
    //         return (
    //             <>
    //             <h3>Starting Inventory Choices</h3>
    //             <ul>
    //                 {itemPackage.map((choices, i) => {
    //                     return (
    //                         <div key={i} style={{display: 'flex', justifyContent: 'center'}}>
    //                         {choiceField(choices, i)}
    //                         </div>
    //                     )
    //                 })}
    //             </ul>
    //             <div>Plus {8 - itemPackage.length} standard items</div>
    //             <button 
    //             className="accept-button"
    //             // disabled={startingChoices.length === itemPackage.length}
    //             onClick={createStartingInv}
    //             >
    //                 Accept
    //             </button>
    //             </>
    //         )
    //     }
    // }

    // function choiceField(choices, ind) {
    //     return (
    //         <>
    //         {choices.map((choice, i) => {
    //             return (
    //                 <div key={i} 
    //                 onClick={() => startingChoice(choice, ind)}
    //                 className={`starting-items-choice${startingChoices[ind] === choice ? ' selected' : ''}`}>
    //                     {choice}
    //                 </div>
    //             )
    //         })}
    //         </>
    //     )
    // }

    // function startingChoice(choice, ind) {
    //     let newChoices = startingChoices;
    //     newChoices[ind] = choice;
    //     setStartingChoices([...newChoices]);
    // }

    // function createStartingInv() {
    //     console.log(`createStartingInv`)
    //     let newInv = [];
    //     for (let i = 0; i < startingChoices.length; i++) {
    //         let item;
    //         switch(startingChoices[i]) {
    //             case "Melee Weapon":
    //                 item = random(WEAPONS.slice(0, 18));
    //                 break;
    //             case "Ranged Weapon":
    //                 item = random(WEAPONS.slice(19, 36));
    //                 break;
    //             case "Weapon Oil":
    //             case "Animal Totem":
    //             case "Songbook":
    //             case "Scroll of Power":
    //             case "Command Scroll":
    //             case "Holy Symbol":
    //             case "Alchemical Ingredient":
    //                 item = randomResourceItem(startingChoices[i])
    //                 break;
    //             case "Magic Item":
    //                 item = randomMagicItem();
    //                 break;
    //             default:
    //                 item = startingChoices[i];
    //         }
    //         newInv.push(item);
    //     }
    //     while (newInv.length < 8) {
    //         newInv.push(random(EQUIPMENT));
    //     }
    //     props.updateState('inventory', newInv);
    // }

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
        {/* {startingEquipmentDisp()} */}
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