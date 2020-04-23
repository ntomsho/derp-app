import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import CampaignFinder from './campaign_finder';
import { fetchCampaigns } from '../../actions/campaign_actions';
import { fetchCharacters } from '../../actions/character_actions';
import { Link } from 'react-router-dom';
import { CLASS_COLORS } from '../../dndb-tables';
//Still need a more optimal solution for responsive display here
const GEDHome = (props) => {

    const [myCampaigns, setMyCampaigns] = useState("Loading")

    useEffect(() => {
        // Look into useReducer to combine these
        fetchCampaigns({'user_id': props.loggedInUser.id}, loadCampaigns);
        // if (props.loggedInUser) fetchCharacters(props.loggedInUser.id, setCharactersList)
    }, [])

    const loadCampaigns = (campaignsList) => {
        let directing = [];
        let playing = [];
        for (let i = 0; i < campaignsList.length; i++) {
            if (campaignsList[i].director.id === props.loggedInUser.id) {
                directing.push(campaignsList[i]);
            } else {
                playing.push(campaignsList[i]);
            }
        }
        setMyCampaigns({ directing, playing });
    }

    const myCampaignsListDisp = () => {
        if (myCampaigns !== "Loading") {
            return (
                <div className="h-100">
                    <div className="h-50">
                        <h2>Campaigns You Direct</h2>
                        <Button className="mb-3"><Link to="/ged/campaigns/new">+ New Campaign</Link></Button>
                        <ListGroup className="overflow-auto h-50">
                            {myCampaigns.directing.map((campaign, i) => {
                                return (
                                    <Link key={i} to={`/ged/campaigns/${campaign.id}`}>
                                        <ListGroup.Item action variant={"light"}>
                                            <strong>{campaign.title}</strong>
                                            {/* <div>Directed by: {campaign.director.id === props.loggedInUser.id ? "You" : campaign.director.username}</div> */}
                                        </ListGroup.Item>
                                    </Link>
                                )
                            })}
                        </ListGroup>
                    </div>
                    <div className="h-50">
                        <h2>Campaigns You Play In</h2>
                        <Button className="mb-3"><Link to="/ged/characters/new">+ New Character</Link></Button>
                        <ListGroup className="overflow-auto h-50">
                            {myCampaigns.playing.map(campaign => {
                                return (
                                    <Link key={campaign.id} to={`/ged/campaigns/${campaign.id}`}>
                                        <ListGroup.Item action variant={"light"}>
                                            <strong>{campaign.title}</strong>
                                            <div>Directed by: {campaign.director.username}</div>
                                        </ListGroup.Item>
                                    </Link>
                                )
                            })}
                        </ListGroup>
                    </div>
                </div>
            )
        } else {
            return (
                <div>Loading Campaigns...</div>
            )
        }
    }

    // const CharactersListDisp = () => {
    //     return (
    //         <div className="h-100">
    //             <h2>Your Characters</h2>
    //             <Button className="mb-3"><Link to="/ged/characters/new">+ New Character</Link></Button>
    //             <ListGroup className="overflow-auto h-75">
    //                 {charactersList.map(character => {
    //                     if (!character.dead) {
    //                         return (
    //                             <Link key={character.id} to={`/ged/characters/${character.id}`} >
    //                                 <ListGroup.Item action variant={"light"}>
    //                                     <div style={{color: CLASS_COLORS[character.c_class]}}>{character.name} Level {character.level} {character.c_class}</div>
    //                                     <div>Campaign: {findCampaign(character.campaign_id).title}</div>
    //                                 </ListGroup.Item>
    //                             </Link>
    //                         )
    //                     }
    //                 })}
    //             </ListGroup>
    //         </div>
    //     )
    // }

    if (!props.loggedInUser) {
        return (
            <div>Login to see more</div>
        )
    } else {
        return (
            <Container style={{ height: '92vh' }} className="bg-light overflow-auto">
                <Row className="">
                    <Col className="d-flex" md={6}>
                        {myCampaignsListDisp()}
                    </Col>
                    <Col className="d-flex" md={6}>
                        <CampaignFinder loggedInUser={props.loggedInUser} />
                    </Col>
                </Row>
            </Container>
        )
    }

}

export default GEDHome;
