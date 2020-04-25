import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import InputGroup from 'react-bootstrap/InputGroup';

const Advancement = (props) => {
    const [levelUpModal, setLevelUpModal] = useState(false);

    const nextLevelExp = props.level + 2;

    function changeExp(increment) {
        if (increment && props.experience >= nextLevelExp) return;
        if (!increment && props.experience === 0) return;
        props.updateState('experience', increment ? props.experience + 1 : props.experience - 1)
    }

    function levelUpButton() {
        if (props.experience >= nextLevelExp) {
            return (
                <Button variant="warning" onClick={() => setLevelUpModal(true)}>Level Up!</Button>
            )
        }
    }

    return (
        <Container className="mb-2">
            <Row>
                <h1>Advancement</h1>
            </Row>
            <Row>
                <Col xs={12} md={8}>
                    <h2>Experience</h2>
                    <InputGroup className="mb-2">
                        <InputGroup.Prepend style={{ width: '10%' }}>
                            <Button block variant="outline-secondary" onClick={() => changeExp(false)}>-</Button>
                        </InputGroup.Prepend>
                        <ProgressBar style={{height: '38px'}} variant="warning" className="w-75" now={Math.floor((props.experience / nextLevelExp) * 100)} />
                        <span className="position-absolute w-100 text-center"><h3>{props.experience} / {nextLevelExp}</h3></span>
                        <InputGroup.Append style={{ width: '10%' }}>
                            <Button block variant="outline-secondary" onClick={() => changeExp(true)}>+</Button>
                        </InputGroup.Append>
                    </InputGroup>
                    <div className="grenze text-center">
                        {props.experience >= nextLevelExp ?
                        levelUpButton() :
                        "Whenever you fill the Experience bar, you level up and gain an Advancement"
                        }
                    </div>
                </Col>
                <Col xs={12} md={4}>
                    <h2>Advancements</h2>
                    <ListGroup>
                        {props.advancements.map((advancement, i) => {
                            const adv = Object.keys(advancement)[0];
                            return (
                                //temporary
                                <ListGroup.Item key={i}>
                                    Level {i + 2}: {adv}
                                </ListGroup.Item>    
                            )
                        })}
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    )

}

export default Advancement;
