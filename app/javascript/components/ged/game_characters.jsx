import React, {useState} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import { CLASS_COLORS, CLASS_RESOURCES } from '../../dndb-tables';
import resourceString from '../../resource_string';

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

    function makeChange(charId, change) {
        let newState = Object.assign({}, props.characters);
        const key = Object.keys(change)[0]
        switch (key) {
            case "health":
            case "plot_points":
                newState[charId].character[key] += change[key];
                break;
            case "lose_item":
                newState[charId].character.inventory = JSON.parse(newState[charId].character.inventory)
                newState[charId].character.inventory[change[key].ind] = "";
                newState[charId].character.inventory = JSON.stringify(newState[charId].character.inventory)
                break;
            case "lose_resource":
                newState[charId].character.current_specials = JSON.parse(newState[charId].character.current_specials);
                newState[charId].character.current_specials[change[key].ind[0]].splice(change[key].ind[1], 1);
                newState[charId].character.current_specials = JSON.stringify(newState[charId].character.current_specials);
                break;
            default:
                return;
        }
        change['charId'] = charId;
        props.charChange(newState, change)
    }

    function populateSpecials(specials, cClass, id) {
        return (
            <>
            <Col xs={12} md={6}>
                {Object.keys(specials).map((category, i) => {
                    return (
                        <div key={i}>
                        <h3>{category.toUpperCase()}</h3>
                        <ListGroup>
                            {specials[category].map((special, i) => {
                                return (
                                    <ListGroup.Item className="d-flex justify-content-between align-items-center" variant="secondary" key={i}>
                                        {resourceString(special, cClass)}
                                        <Dropdown as={ButtonGroup}>
                                            <Dropdown.Toggle variant="secondary" split />
                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => makeChange(id, { lose_resource: { ind: [category, i], string: resourceString(special, cClass) } })}>Remove</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </ListGroup.Item>
                                )
                            })}
                        </ListGroup>
                        </div>
                    )
                })}
            </Col>
            </>
        )
    }

    const chars = props.characters

    return (
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
                                    <div className="d-flex justify-content-between">
                                        <Col xs={4}>
                                        <small>Background</small><br/><strong className="grenze">{char.background}</strong>
                                        </Col>
                                        <Col xs={4}>
                                        <small>Appearance</small><br/><strong className="grenze">{char.appearance}</strong>
                                        </Col>
                                        <Col xs={4}>
                                        <small>Derp</small><br/><strong className="grenze">{char.derp}</strong>
                                        </Col>
                                    </div>
                                    <Row className="my-2">
                                        <Col xs={2} sm={1}>
                                            <InputGroup>
                                                <InputGroup.Text className="game-heart-container mb-1" style={{ border: 'none', color: char.health === char.max_health ? 'lawngreen' : 'white' }}>
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
                                                    <Button variant="danger" onClick={() => makeChange(id, { health: parseInt(healthForms[id]*-1) })}>Damage</Button>
                                                    <Button variant="success" onClick={() => makeChange(id, { health: parseInt(healthForms[id]) })}>Healing</Button>
                                                </InputGroup.Append>
                                            </InputGroup>
                                        </Col>
                                        <Col>
                                            <InputGroup>
                                                <InputGroup.Prepend>
                                                    <Button variant="secondary">-</Button>
                                                </InputGroup.Prepend>
                                                <InputGroup.Text style={{borderRadius: '50%'}}>
                                                    {char.plot_points}
                                                </InputGroup.Text>
                                                <InputGroup.Append className="grenze">
                                                    <InputGroup.Text>
                                                        Derp Points
                                                    </InputGroup.Text>
                                                </InputGroup.Append>
                                            </InputGroup>
                                        </Col>
                                    </Row>
                                    <Accordion.Toggle as={Button} className="w-100" variant="secondary" size="sm" eventKey={i}>More</Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey={i}>
                                    <Card.Body className="d-flex flex-wrap">
                                        {populateSpecials(JSON.parse(char.current_specials), char.c_class, id)}
                                        <Col xs={12} md={6}>
                                            <h3>INVENTORY</h3>
                                            <div className="grenze">Carried Items</div>
                                            <ListGroup>
                                                {JSON.parse(char.inventory).slice(0,3).map((item, i) => {
                                                    if (item) {
                                                        return (
                                                            <ListGroup.Item className="d-flex justify-content-between align-items-center" variant="secondary" key={i}>
                                                                {item}
                                                                <Dropdown as={ButtonGroup}>
                                                                    <Dropdown.Toggle variant="secondary" split />
                                                                    <Dropdown.Menu>
                                                                        <Dropdown.Item onClick={() => makeChange(id, { lose_item: { ind: i, string: item } })}>Remove</Dropdown.Item>
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            </ListGroup.Item>
                                                        )
                                                    }
                                                })}
                                            </ListGroup>
                                            <div className="grenze">Stashed Items</div>
                                            <ListGroup>
                                                {JSON.parse(char.inventory).slice(3).map((item, i) => {
                                                    if (item) {
                                                        return (
                                                            <ListGroup.Item className="d-flex justify-content-between align-items-center" variant="secondary" key={i}>
                                                                {item}
                                                                <Dropdown as={ButtonGroup}>
                                                                    <Dropdown.Toggle variant="secondary" split />
                                                                    <Dropdown.Menu>
                                                                        <Dropdown.Item onClick={() => makeChange(id, { lose_item: { ind: i + 3, string: item } })}>Remove</Dropdown.Item>
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            </ListGroup.Item>
                                                        )
                                                    }
                                                })}
                                            </ListGroup>
                                        </Col>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        )
                    })}
                </Accordion>
            </Col>
        </Row>
    )

}

export default GameCharacters;