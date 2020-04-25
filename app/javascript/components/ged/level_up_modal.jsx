import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { random, CLASS_SKILLS, FIGHTING_SKILLS, CIVILIZED_SKILLS } from '../../dndb-tables';

const LevelUpModal = (props) => {

    const [selection, setSelection] = useState(null);

    const availableCivilizedSkills = CIVILIZED_SKILLS.filter((skill) => !props.trainedSkills.includes(skill));
    const availableFightingSkills = FIGHTING_SKILLS.filter((skill) => (skill != props.selectedFightingSkill && !props.trainedSkills.includes(skill)));

    function getRandomSkill(type) {
        let randomSkill = random(type === "Civilized" ? availableCivilizedSkills : availableFightingSkills);
        return randomSkill;
    }

    function processLevelUp() {
        let advObj;
        if (CIVILIZED_SKILLS.includes(selection)) {
            advObj = {'civSkill': selection}
        } else if (FIGHTING_SKILLS.includes(selection)) {
            advObj = {'fightSkill': selection}
        } else {
            switch (selection) {
                case 'health':
                    advObj = {'health': 2}
                    break;
                case 'civRandom':
                    advObj = {'civSkill': getRandomSkill("Civilized")}
                    break;
                default:
                    advObj = {'fightSkill': getRandomSkill("Fighting")}
            }
        }
        props.levelUp(advObj);
        props.onHide();
        setSelection(null);
    }

    return (
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title><h1 className="text-center">Level Up!</h1></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row><h3 className="text-center">Choose one of the advancements below.</h3></Row>
                <Accordion>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="secondary" eventKey="0">
                                <div className="grenze">Gain Training in a Random Fighting Skill</div>
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body className="d-flex justify-content-around">
                                <Button className={selection === "fightRandom" ? "selected" : ""} onClick={() => setSelection("fightRandom")}><h3>Random!</h3></Button>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="secondary" eventKey="1">
                                <div className="grenze">Gain Training in a Civilized Skill and +1 Max Health</div>
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="1">
                            <Card.Body className="d-flex justify-content-around">
                                {CLASS_SKILLS[props.cClass].map((skill, i) => {
                                    if (availableCivilizedSkills.includes(skill)) {
                                        return (
                                            <Button key={i} className={selection === skill ? "selected" : ""} onClick={() => setSelection(skill)}><h3>{ skill }</h3></Button>
                                        )
                                    }
                                })}
                                <Button className={selection === "civRandom" ? "selected" : ""} onClick={() => setSelection("civRandom")}><h3>Random!</h3></Button>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="secondary" eventKey="2">
                                <div className="grenze">Gain +2 Max Health</div>
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="2">
                            <Card.Body className="d-flex justify-content-around">
                                <Button className={selection === "health" ? "selected" : ""} onClick={() => setSelection("health")}><h3>+2 Max Health</h3></Button>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <Button  variant="warning" onClick={processLevelUp}><h2>Accept</h2></Button>
            </Modal.Footer>
        </Modal>
    )

}

export default LevelUpModal;
