import React, { useState, useEffect } from 'react';
import InviteComponent from './invite_component';
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const campaign = Object.assign({}, { title: title, description: description });
        createCampaign(campaign).then(newCampaign => setCampaignId(newCampaign.id));
    }

    const processInvites = () => {
        invitedUsers.forEach(user => {
            createInvite({ requester_type: 'Campaign', requester_id: campaignId, requested_type: 'User', requested_id: user });
        });
        setFinished(true);
    }

    const addUser = (user) => {
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

    const update = (stateSetter) => {
        return e => {
            stateSetter(e.currentTarget.value);
        };
    }

    if (finished) {
        return <Redirect to={`/ged/campaigns/${campaignId}`} />
    }

    if (campaignId) {
        return (
            <div>
                <InviteComponent users={allUsers} selector={addUser} />
                <div>
                    <ul>
                        {invitedUsers.map(user => {
                            return (
                                <li key={user.id} onClick={addUser(user)}>
                                    {user.username}
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <button onClick={processInvites} className="session-submit">Done</button>
            </div>
        )
    }

    return (
        <div id="campaign-new-background">
            <h1>Create a New Campaign</h1>
            <form onSubmit={handleSubmit} className="session-form-box">
                <input type="text" placeholder="Title" value={title} onChange={update(setTitle)} className="session-input" />
                <input type="text" placeholder="Description" value={description} onChange={update(setDescription)} className="session-input" />
                <input type="submit" value="Submit" className="session-submit" />
            </form>
        </div>
    )
}

export default CampaignNew;
