import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { fetchUsers } from '../../actions/user_actions';
import { createCampaign } from '../../actions/campaign_actions';
import { createInvite } from '../../actions/invite_actions';

const CampaignNew = (props) => {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [campaignId, setCampaignId] = useState(null);
    const [userQuery, setUserQuery] = useState("");
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

    const update = (stateSetter) => {
        return e => {
            stateSetter(e.currentTarget.value);
        };
    }

    const addUser = (user) => {
        if (!invitedUsers.includes(user.id)) {
            let newInvitedUsers = Object.assign([], invitedUsers);
            newInvitedUsers.push(user.id);
            setInvitedUsers(newInvitedUsers);
        } else {
            let newInvitedUsers = Object.assign([], invitedUsers);
            newInvitedUsers.splice(newInvitedUsers.indexOf(user.id), 1);
            setInvitedUsers(newInvitedUsers);
        }
    }

    if (finished) {
        return <Redirect to={`/ged/campaigns/${campaignId}`} />
    }

    if (campaignId) {
        return (
            <div id="campaign-new-background">
                <div>Invite players to your new campaign</div>
                <input type="text" value={userQuery} onChange={update(setUserQuery)} />
                <div>
                    <ul>
                        {allUsers.map(user => {
                            if (user.id !== window.currentUser.id && user.username.startsWith(userQuery)) {
                                return (
                                    <li key={user.id} type="button" onClick={() => addUser(user)}>
                                        {user.username}
                                    </li>
                                )
                            }
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
