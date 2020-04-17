import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';

// Selector is still messed up, fix later

const InviteComponent = (props) => {
    const [query, setQuery] = useState("");
    let searchNum = 5;

    return (
        <Form className="w-xs-100 w-md-50 mb-4">
            <Row>
                <Form.Label>Invite players to your campaign</Form.Label>
                <Form.Control type="text" value={query} onChange={(e) => setQuery(e.currentTarget.value)} />
            </Row>
            <Row>
                <ListGroup>
                    {props.users.slice(0,searchNum).map(user => {
                        if (query.length > 0 && user.id !== props.loggedInUser.id && user.username.toLowerCase().startsWith(query.toLowerCase())) {
                            return (
                                <ListGroup.Item key={user.id} type="button" onClick={() => props.selector(user)}>
                                    {user.username}
                                </ListGroup.Item>
                            )
                        }
                    })}
                </ListGroup>
            </Row>
        </Form>
    )
}

export default InviteComponent;
