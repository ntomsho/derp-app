import React from 'react';
import Button from 'react-bootstrap/Button'
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

const ClassDescription = (props) => {
    return (
        <Accordion>
            <Card>
                <Accordion.Toggle as={Button} variant="light" className="w-100" eventKey="0">
                    Class Features
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                    <Card.Body>
                        {props.children}
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    )

}

export default ClassDescription;