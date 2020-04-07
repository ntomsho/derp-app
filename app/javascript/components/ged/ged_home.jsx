import React, { useState, useEffect } from 'react';
import { fetchUsers } from '../../actions/user_actions';
import { fetchCampaigns } from '../../actions/campaign_actions';

const GEDHome = () => {
    const [usersList, setUsersList] = useState([]);
    const [campaignsList, setCampaignsList] = useState([]);

    const usersListDisp = () => {
        if (usersList.length > 0) {
            return (
                <div>
                    <h2>Users</h2>
                    <ul>
                        {usersList.map((user, i) => {
                            return (
                                <li key={i}>
                                    <div>{user.username}</div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )
        } else {
            return (
                <div>Loading Users...</div>
            )
        }
    }

    const campaignsListDisp = () => {
        if (campaignsList.length > 0) {
            let myCampaigns = [];
            let otherCampaigns = [];
            campaignsList.forEach(campaign => {
                debugger
                if (campaign.subs.some(sub => sub.user_id === window.currentUser.id)) {
                    myCampaigns.push(campaign);
                } else {
                    otherCampaigns.push(campaign)
                }
            })
            return (
                <div>
                    <h2>Your Campaigns</h2>
                    <ul>
                        {myCampaigns.map((campaign, i) => {
                            return (
                                <li key={i}>
                                    <div>{campaign.title}</div>
                                </li>
                            )
                        })}
                    </ul>
                    <h2>Other Campaigns</h2>
                    <ul>
                        {otherCampaigns.map((campaign, i) => {
                            return (
                                <li key={i}>
                                    <div>{campaign.title}</div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )
        } else {
            return (
                <div>Loading Campaigns...</div>
            )
        }
    }

    useEffect(() => {
        fetchUsers(setUsersList);
        fetchCampaigns(setCampaignsList);
    }, [])

    return (
        <div id="ged-background">
            <div>
                {usersListDisp()}
            </div>
            <div>
                {campaignsListDisp()}
            </div>
        </div>
    )

}

export default GEDHome;
