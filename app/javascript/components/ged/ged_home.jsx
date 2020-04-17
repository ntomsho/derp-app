import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { fetchUsers } from '../../actions/user_actions';
import { fetchCampaigns } from '../../actions/campaign_actions';
import { fetchCharacters } from '../../actions/character_actions';
import { Link } from 'react-router-dom';

const GEDHome = () => {
    const [usersList, setUsersList] = useState([]);
    const [campaignsList, setCampaignsList] = useState([]);
    const [charactersList, setCharactersList] = useState([]);

    const usersListDisp = () => {
        if (usersList.length > 0) {
            return (
                <div>
                    <h2>Users</h2>
                    <ul>
                        {usersList.map((user, i) => {
                            if (!window.currentUser || user.id !== window.currentUser.id) {
                                return (
                                    <li key={i}>
                                        <div>{user.username}</div>
                                    </li>
                                )
                            }
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
                if (window.currentUser && campaign.subs.some(sub => sub.user_id === window.currentUser.id)) {
                    myCampaigns.push(campaign);
                } else {
                    otherCampaigns.push(campaign)
                }
            })
            let userCampaigns;
            if (myCampaigns.length > 0) {
                userCampaigns = (
                    <>
                    <h2>Your Campaigns</h2>
                    <ul>
                        {myCampaigns.map((campaign, i) => {
                            return (
                                <li key={i}>
                                    <Link to={`/ged/campaigns/${campaign.id}`}>{campaign.title}</Link>
                                </li>
                            )
                        })}
                    </ul>
                    </>
                )
            }
            return (
                <div>
                    <Link to="/ged/campaigns/new"><button>New Campaign</button></Link>
                    {userCampaigns}
                    <h2>Other Campaigns</h2>
                    <ul>
                        {otherCampaigns.map(campaign => {
                            return (
                                <li key={campaign.id}>
                                    <Link to={`/ged/campaigns/${campaign.id}`}>{campaign.title}</Link>
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

    const findCampaign = (campaignId) => {
        for (let i = 0; i < campaignsList.length; i++) {
            if (campaignsList[i].id === campaignId) return campaignsList[i]
        }
        return {title: "None"}
    }

    const CharactersListDisp = () => {
        return (
            <div>
                <Link to="/ged/characters/new"><button>New Character</button></Link>
                <h2>Your Characters</h2>
                <ul>
                    {charactersList.map(character => {
                        return (
                            <li key={character.id}>
                                <Link to={`/ged/characters/${character.id}`} >
                                    <div>{character.name}</div>
                                    <div>Campaign: {findCampaign(character.campaign_id).title}</div>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }

    useEffect(() => {
        // Look into useReducer to combine these
        fetchUsers(setUsersList);
        fetchCampaigns(setCampaignsList);
        if (window.currentUser) fetchCharacters(window.currentUser.id, setCharactersList)
    }, [])

    if (!window.currentUser) {
        return (
            <div>Login to see more</div>
        )
    } else {
        return (
            <div id="ged-background">
                <div>
                    {usersListDisp()}
                </div>
                <div>
                    {campaignsListDisp()}
                </div>
                <div>
                    {CharactersListDisp()}
                </div>
            </div>
        )
    }

}

export default GEDHome;
