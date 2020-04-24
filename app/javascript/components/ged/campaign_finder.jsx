import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { fetchCampaigns } from '../../actions/campaign_actions';

const CampaignFinder = (props) => {

    const [query, setQuery] = useState("");
    const [campaignsList, setCampaignsList] = useState([]);
    const [limit, setLimit] = useState(10);

    useEffect(() => {
        if (query) {
            fetchCampaigns({ "user_not_playing": props.loggedInUser.id, "query": query }, setCampaignsList);
        } else {
            setCampaignsList([]);
        }
    }, [query, limit])

    return (
        <div className="h-40">
            <h2>Discover New Campaigns</h2>
            <Form>
                <Form.Control type="text" value={query} onChange={(e) => setQuery(e.currentTarget.value)} />
            </Form>
            <ListGroup className="overflow-auto h-100">
                {campaignsList.map(campaign => {
                    return (
                        <Link key={campaign.id} to={`/ged/campaigns/${campaign.id}`} >
                            <ListGroup.Item action variant={"light"}>
                                <strong>{campaign.title}</strong>
                                <div>Directed by: {campaign.director.username}</div>
                                <em>{campaign.description.slice(0,200)}</em>
                            </ListGroup.Item>
                        </Link>
                    )
                })}
                {/* <Button variant="secondary" onClick={() => setLimit(limit + 10)}>See More</Button> */}
            </ListGroup>
        </div>
    )
}

export default CampaignFinder;