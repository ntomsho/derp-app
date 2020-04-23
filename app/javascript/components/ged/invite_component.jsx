import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import { fetchUsers } from '../../actions/user_actions';

// Selector is still messed up, fix later

const InviteComponent = (props) => {
    const [query, setQuery] = useState("");
    const [usersList, setUsersList] = useState([]);

    useEffect(() => {
        if (query) {
            fetchUsers({"not_in_campaign_id": props.campaignId, "query": query}, (users) => setUsersList(users));
        }
    }, [query])

    return (
        <Form className="w-xs-100 w-md-50 mb-4">
            <Row>
                <Form.Label>Invite players to your campaign</Form.Label>
                <Form.Control type="text" value={query} onChange={(e) => setQuery(e.currentTarget.value)} />
            </Row>
            <Row>
                <ListGroup>
                    {usersList.map(user => {
                        if (user.id !== props.loggedInUser.id && user.username.toLowerCase().startsWith(query.toLowerCase())) {
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
