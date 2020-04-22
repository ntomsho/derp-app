import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import { fetchUsers } from '../../actions/user_actions';
import { fetchCampaigns } from '../../actions/campaign_actions';
import { fetchCharacters } from '../../actions/character_actions';
import { Link } from 'react-router-dom';
import { CLASS_COLORS } from '../../dndb-tables';
//Still need a more optimal solution for responsive display here
const GEDHome = (props) => {
    const [campaignsList, setCampaignsList] = useState([]);
    const [charactersList, setCharactersList] = useState([]);
    const [numCampaigns, setNumCampaigns] = useState(5);

    useEffect(() => {
        // Look into useReducer to combine these
        fetchCampaigns(setCampaignsList);
        if (props.loggedInUser) fetchCharacters(props.loggedInUser.id, setCharactersList)
    }, [])

    const campaignsListDisp = () => {
        if (campaignsList.length > 0) {
            let myCampaigns = [];
            let otherCampaigns = [];
            campaignsList.forEach(campaign => {
                if (props.loggedInUser && campaign.subs.some(sub => sub.user_id === props.loggedInUser.id)) {
                    myCampaigns.push(campaign);
                } else {
                    otherCampaigns.push(campaign)
                }
            });
            let userCampaigns;
            if (myCampaigns.length > 0) {
                userCampaigns = (
                    <div className="h-50">
                        <h2>Your Campaigns</h2>
                        <Button className="mb-3"><Link to="/ged/campaigns/new">+ New Campaign</Link></Button>
                        <ListGroup className="overflow-auto h-50">
                            {myCampaigns.map((campaign, i) => {
                                return (
                                    <Link key={i} to={`/ged/campaigns/${campaign.id}`}>
                                        <ListGroup.Item action variant={"light"}>
                                            <strong>{campaign.title}</strong>
                                            <div>Directed by: {campaign.director.id === props.loggedInUser.id ? "You" : campaign.director.username}</div>
                                        </ListGroup.Item>
                                    </Link>
                                )
                            })}
                        </ListGroup>
                    </div>
                )
            }
            return (
                <>
                <div className="h-100">
                {userCampaigns}
                <div className="h-50">
                    <h2>Other Campaigns</h2>
                    <ListGroup className="overflow-auto h-50">
                        {otherCampaigns.slice(0,numCampaigns).map(campaign => {
                            return (
                                <Link key={campaign.id} to={`/ged/campaigns/${campaign.id}`}>
                                    <ListGroup.Item action variant={"light"}>
                                        <strong>{campaign.title}</strong>
                                        <div>Directed by: {campaign.director.username}</div>
                                        <div><em>{campaign.description}</em></div>
                                    </ListGroup.Item>
                                </Link>
                            )
                        })}
                        {numCampaigns < otherCampaigns.length ?
                            <ListGroup.Item action variant={"light"} onClick={() => setNumCampaigns(numCampaigns + 5)}>See More</ListGroup.Item> : null}
                    </ListGroup>
                </div>
                </div>
                </>
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
            <div className="h-100">
                <h2>Your Characters</h2>
                <Button className="mb-3"><Link to="/ged/characters/new">+ New Character</Link></Button>
                <ListGroup className="overflow-auto h-75">
                    {charactersList.map(character => {
                        if (!character.dead) {
                            return (
                                <Link key={character.id} to={`/ged/characters/${character.id}`} >
                                    <ListGroup.Item action variant={"light"}>
                                        <div style={{color: CLASS_COLORS[character.c_class]}}>{character.name} Level {character.level} {character.c_class}</div>
                                        <div>Campaign: {findCampaign(character.campaign_id).title}</div>
                                    </ListGroup.Item>
                                </Link>
                            )
                        }
                    })}
                </ListGroup>
            </div>
        )
    }

    if (!props.loggedInUser) {
        return (
            <div>Login to see more</div>
        )
    } else {
        return (
            <Container style={{ height: '92vh' }} className="bg-light overflow-auto">
                <Row className="">
                    <Col className="d-flex" md={6}>
                        {campaignsListDisp()}
                    </Col>
                    <Col className="d-flex" md={6}>
                        {CharactersListDisp()}
                    </Col>
                </Row>
            </Container>
        )
    }

}

export default GEDHome;
