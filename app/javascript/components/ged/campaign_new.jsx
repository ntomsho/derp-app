import React, { useState, useEffect } from 'react';
import Errors from '../errors';
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

    const [errors, setErrors] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [campaignId, setCampaignId] = useState(null);
    const [invitedUsers, setInvitedUsers] = useState([]);
    const [finished, setFinished] = useState(false);

    const create = () => {
        const campaign = Object.assign({}, { title: title, description: description });
        createCampaign(campaign, findId, setErrors);
    }

    const findId = (campaign) => {
        setCampaignId(campaign.id)
    }

    const processInvites = () => {
        invitedUsers.forEach(user => {
            createInvite({ requester_type: 'Campaign', requester_id: campaignId, requested_type: 'User', requested_id: user.id })
        });
        setFinished(true);
    }

    const addUser = (user) => {
        let matchingUserInd = null;
        for (let i = 0; i < invitedUsers.length; i++) {
            if (invitedUsers[i].id === user.id) {
                matchingUserInd = i;
                break;
            }
        };
        if (matchingUserInd === null) {
            let newInvitedUsers = Object.assign([], invitedUsers);
            newInvitedUsers.push(user);
            setInvitedUsers(newInvitedUsers);
        } else {
            let newInvitedUsers = Object.assign([], invitedUsers);
            newInvitedUsers.splice(matchingUserInd, 1);
            setInvitedUsers(newInvitedUsers);
        }
    }

    const update = (e) => {
        if (e.target.name === "title") {
            setTitle(e.currentTarget.value);
        } else {
            setDescription(e.currentTarget.value);
        }
    }

    if (finished) {
        return <Redirect to={`/ged/campaigns/${campaignId}`} />
    }

    if (campaignId) {
        return (
            <Container className="bg-light pl-5">
                <h1 className="display-4">Create a New Campaign</h1>
                <InviteComponent selector={addUser} selectedIds={invitedUsers.map((user) => user.id)} campaignId={campaignId} loggedInUser={props.loggedInUser} />
                    <ListGroup>
                        {invitedUsers.map(user => {
                            return (
                                <ListGroup.Item key={user.id} onClick={() => addUser(user)}>
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
                <Errors errors={errors} />
                <Form.Control type="text" placeholder="Title" name="title" value={title} onChange={update} className="session-input" />
                <Form.Control as="textarea" rows="3" placeholder="Description" name="description" value={description} onChange={update} className="session-input" />
                <Button onClick={create}>Submit</Button>
            </Form>
        </Container>
    )
}

export default CampaignNew;
