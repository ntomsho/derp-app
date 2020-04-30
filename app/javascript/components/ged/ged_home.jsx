import React, { useState, useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import CampaignFinder from './campaign_finder';
import { fetchCampaigns } from '../../actions/campaign_actions';
import { Link } from 'react-router-dom';

const GEDHome = (props) => {

    const [myCampaigns, setMyCampaigns] = useState("Loading")

    useEffect(() => {
        fetchCampaigns({'user_id': props.loggedInUser.id}, loadCampaigns);
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
                <div>
                    <h2>Campaigns You Direct</h2>
                    <div>
                        <div className="mb-3" style={{maxHeight: '40%'}}>
                            <Button className="mb-3"><Link to="/ged/campaigns/new">+ New Campaign</Link></Button>
                            <ListGroup className="overflow-auto" style={{maxHeight: "75%"}}>
                                {myCampaigns.directing.map((campaign, i) => {
                                    return (
                                        <Link key={i} to={`/ged/campaigns/${campaign.id}`}>
                                            <ListGroup.Item action variant="light">
                                                <strong>{campaign.title}</strong>
                                            </ListGroup.Item>
                                        </Link>
                                    )
                                })}
                            </ListGroup>
                        </div>
                    </div>
                    <h2>Campaigns You Play In</h2>
                    <div>
                        <div style={{maxHeight: '40%'}}>
                            <Button className="mb-3"><Link to="/ged/characters/new">+ New Character</Link></Button>
                            <ListGroup className="overflow-auto h-75">
                                {myCampaigns.playing.map(campaign => {
                                    return (
                                        <Link key={campaign.id} to={`/ged/campaigns/${campaign.id}`}>
                                            <ListGroup.Item action variant="light">
                                                <strong>{campaign.title}</strong>
                                                <div>Directed by: {campaign.director.username}</div>
                                            </ListGroup.Item>
                                        </Link>
                                    )
                                })}
                            </ListGroup>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div style={{ height: '92vh' }} className="d-flex bg-light w-100 justify-content-center align-items-center">
                    <h1>Loading Your Campaigns...</h1>
                    <Spinner animation="grow" role="status" variant="dark" />
                </div>
            )
        }
    }

    return (
        <Container style={{ height: '92vh' }} className="bg-light overflow-auto">
            <Row style={{height: '92vh'}}>
                <Col className="d-flex" style={{maxHeight: '100%'}} md={6}>
                    {myCampaignsListDisp()}
                </Col>
                <Col className="d-flex h-100" md={6}>
                    <div >
                        <h2>Resources</h2>
                        <div style={{height: '12%'}}>
                            <ListGroup className="overflow h-75">
                                <ListGroup.Item action variant="light">
                                    Coming soon
                                </ListGroup.Item>
                            </ListGroup>
                        </div>
                        <CampaignFinder loggedInUser={props.loggedInUser} />
                    </div>
                </Col>
            </Row>
        </Container>
    )

}

export default GEDHome;
