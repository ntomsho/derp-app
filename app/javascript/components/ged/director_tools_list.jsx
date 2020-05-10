import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const DirectorToolsList = (props) => {

    function dropdown() {
        if (props.give) {
            return (
                <Dropdown as={ButtonGroup}>
                    <Dropdown.Toggle variant="secondary" split />
                    <Dropdown.Menu>
                        {Object.keys(props.characters).map(id => {
                            return (
                                <Dropdown.Item key={id} onClick={() => props.give(id, item)}>
                                    Give to {props.characters[id].character.name}
                                </Dropdown.Item>
                            )
                        })}
                    </Dropdown.Menu>
                </Dropdown>
            )
        }
    }

    return (
        <Row className="justify-content-center">
            <Col xs={12} md={8}>
                <ListGroup className="w-100">
                    {props.list.map((item, i) => {
                        return (
                            <ListGroup.Item className="d-flex justify-content-between align-items-center" variant="secondary" key={i}>
                                {item}
                                {dropdown()}
                            </ListGroup.Item>
                        )
                    })}
                </ListGroup>
            </Col>
        </Row>
    )

}

export default DirectorToolsList;