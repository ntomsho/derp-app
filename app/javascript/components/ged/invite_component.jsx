import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import InputGroup from 'react-bootstrap/InputGroup';
import Spinner from 'react-bootstrap/Spinner';
import { fetchUsers } from '../../actions/user_actions';

// Selector is still messed up, fix later

const InviteComponent = (props) => {
    const [query, setQuery] = useState("");
    const [usersList, setUsersList] = useState([]);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        if (query === "") return setUsersList([]);
        if (!searching) setSearching(true);
        const timer = (setTimeout(() => {
            processSearch(timer)
        }, 300))
    }, [query])

    const processSearch = (timer) => {
        fetchUsers({ "not_in_campaign_id": props.campaignId, "query": query }, (users) => createUsersList(users));
        clearTimeout(timer);
    }

    const createUsersList = (users) => {
        setUsersList(users);
        setSearching(false);
    }

    const spinner = () => {
        if (searching) {
            return <Spinner size="sm" animation="grow" role="status" variant="dark" />
        }
    }

    return (
        <Form className="w-xs-100 w-md-50 mb-4">
            <Row>
                <Form.Label>Invite players to your campaign</Form.Label>
                <InputGroup>
                    <InputGroup.Prepend className="justify-content-center align-items-center" style={{ height: '100%', width: '6%' }}>
                        {spinner()}
                    </InputGroup.Prepend>
                    <Form.Control type="text" value={query} onChange={(e) => setQuery(e.currentTarget.value)} />
                </InputGroup>
            </Row>
            <Row>
                <ListGroup className="ml-5">
                    {usersList.map(user => {
                        if (user.id !== props.loggedInUser.id && user.username.toLowerCase().startsWith(query.toLowerCase())) {
                            return (
                                <ListGroup.Item key={user.id} type="button" onClick={() => props.selector(user)}>
                                    {props.selectedIds.includes(user.id) ? "✓" : ""} {user.username}
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
