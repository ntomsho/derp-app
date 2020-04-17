import React, { useState, useEffect } from 'react';
import InviteComponent from './invite_component';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import { Redirect } from 'react-router-dom';
import { fetchUsers } from '../../actions/user_actions';
import { createCampaign } from '../../actions/campaign_actions';
import { createInvite } from '../../actions/invite_actions';

const CampaignNew = (props) => {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [campaignId, setCampaignId] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [invitedUsers, setInvitedUsers] = useState([]);
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        fetchUsers(setAllUsers);
    }, []);

    const handleSubmit = () => {
        const campaign = Object.assign({}, { title: title, description: description });
        createCampaign(campaign).then(newCampaign => setCampaignId(newCampaign.id));
    }

    const processInvites = () => {
        debugger
        invitedUsers.forEach(user => {
            createInvite({ requester_type: 'Campaign', requester_id: campaignId, requested_type: 'User', requested_id: user });
        });
        setFinished(true);
    }

    const addUser = (user) => {
        debugger
        if (!invitedUsers.includes(user.id)) {
            let newInvitedUsers = Object.assign([], invitedUsers);
            newInvitedUsers.push(user);
            setInvitedUsers(newInvitedUsers);
        } else {
            let newInvitedUsers = Object.assign([], invitedUsers);
            for (let i = 0; i < newInvitedUsers.length; i++) {
                if (newInvitedUsers[i].id === user.id) {
                    newInvitedUsers.splice(newInvitedUsers.indexOf(user.id), 1);
                    break;
                }
            }
            setInvitedUsers(newInvitedUsers);
        }
    }

    const update = (stateSetter, e) => {
        stateSetter(e.currentTarget.value);
    }

    if (finished) {
        return <Redirect to={`/ged/campaigns/${campaignId}`} />
    }

    if (campaignId) {
        return (
            <Container className="bg-light pl-5">
                <h1 className="display-4">Create a New Campaign</h1>
                <InviteComponent users={allUsers} selector={addUser} loggedInUser={props.loggedInUser} />
                    <ListGroup>
                        {invitedUsers.map(user => {
                            return (
                                <ListGroup.Item key={user.id} onClick={addUser(user)}>
                                    {user.username}
                                </ListGroup.Item>
                            )
                        })}
                    </ListGroup>
                <Button onClick={processInvites} className="session-submit">Done</Button>
            </Container>
        )
    }

    return (
        <Container className="bg-light pl-5">
            <Form>
                <h1 className="display-4">Create a New Campaign</h1>
                <Form.Control type="text" placeholder="Title" value={title} onChange={(e) => update(setTitle, e)} className="session-input" />
                <Form.Control as="textarea" placeholder="Description" value={description} onChange={(e) => update(setDescription, e)} className="session-input" />
                <Button type="submit" onClick={handleSubmit}>Submit</Button>
            </Form>
        </Container>
    )
}

export default CampaignNew;
