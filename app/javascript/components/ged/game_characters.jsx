import React, {useState} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { CLASS_COLORS } from '../../dndb-tables';

const GameCharacters = (props) => {
    const [healthForms, setHealthForms] = useState(createHealthForms())

    function createHealthForms() {
        let state = {}
        Object.keys(props.characters).forEach(id => state[id] = 0);
        return state;
    }

    function update(e) {
        let newHealthForms = Object.assign({}, healthForms)
        newHealthForms[e.currentTarget.name] = e.currentTarget.value.replace(/\D/, '');
        setHealthForms(newHealthForms);
    }

    const chars = props.characters

    return (
        <>
        <Row>
            <h2>Messages</h2>
        </Row>
        <Row>
            <Col>
                <Accordion>
                    {Object.keys(chars).map((id, i) => {
                        const char = chars[id].character
                        return (
                            <Card key={chars[id]}>
                                <Card.Header>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h2>{char.name}</h2>
                                        <div className="d-flex flex-column">
                                            <small style={{ color: CLASS_COLORS[char.c_class] }} className="grenze">Level {char.level} {char.c_class}</small>
                                            <small className="grenze">Played by {chars[id].username}</small>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center grenze">
                                        <div>Background: <strong>{char.background}</strong></div>
                                        <div>Appearance: <strong>{char.appearance}</strong></div>
                                        <div>Derp: <strong>{char.derp}</strong></div>
                                    </div>
                                    <Row className="my-2">
                                        <Col xs={2} sm={1}>
                                            <InputGroup>
                                                <InputGroup.Text className="game-heart-container" style={{ border: 'none', color: char.health === char.max_health ? 'lawngreen' : 'white' }}>
                                                    <div>
                                                        {char.health}
                                                    </div>
                                                </InputGroup.Text>
                                            </InputGroup>
                                        </Col>
                                        <Col xs={10} sm={5}>
                                            <InputGroup>
                                                <div style={{width: '50px'}}>
                                                    <Form.Control value={healthForms[id]} name={id} onChange={update} />
                                                </div>
                                                <InputGroup.Append>
                                                    <Button variant="danger">Damage</Button>
                                                    <Button variant="success">Healing</Button>
                                                </InputGroup.Append>
                                            </InputGroup>
                                        </Col>
                                        <Col xs={3}>
                                            <InputGroup>
                                                <InputGroup.Prepend>
                                                    <Button variant="secondary">-</Button>
                                                </InputGroup.Prepend>
                                                <InputGroup.Text style={{borderRadius: '50%'}}>
                                                    {char.plot_points}
                                                </InputGroup.Text>
                                            </InputGroup>
                                        </Col>
                                    </Row>
                                    <Accordion.Toggle as="Button" className="w-100" variant="secondary" size="sm" eventKey={i}>More</Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey={i}>
                                    <Card.Body>
                                        <h3>Resources</h3>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        )
                    })}
                </Accordion>
            </Col>
        </Row>
        </>
    )

}

export default GameCharacters;