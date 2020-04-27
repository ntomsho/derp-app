import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Spinner from 'react-bootstrap/Spinner';
import { fetchCampaigns } from '../../actions/campaign_actions';

const CampaignFinder = (props) => {

    const [query, setQuery] = useState("");
    const [campaignsList, setCampaignsList] = useState([]);
    const [searching, setSearching] = useState(false)
    const [initialList, setInitialList] = useState(false);

    useEffect(() => {
        if (!initialList) fetchCampaigns({ "user_not_playing": props.loggedInUser.id, "limit": 5 }, (campaigns) => setInitialList(campaigns))
        if (query === "") return;
        if (!searching) setSearching(true);
        const timer = (setTimeout(() => {
            processSearch(timer)
        }, 300))
    }, [query])

    const processSearch = (timer) => {
        fetchCampaigns({ "user_not_playing": props.loggedInUser.id, "query": query }, (campaigns) => createCampaignsList(campaigns));
        clearTimeout(timer);
    }

    const createCampaignsList = (campaigns) => {
        setCampaignsList(campaigns);
        setSearching(false);
    }

    const spinner = () => {
        if (searching) {
            return <Spinner size="sm" animation="grow" role="status" variant="dark" />
        }
    }
    
    const useList = query === "" ? initialList === false ? [] : initialList : campaignsList;

    return (
        <div className="h-40">
            <h2>Discover New Campaigns</h2>
            <Form>
                <InputGroup>
                    <InputGroup.Prepend className="justify-content-center align-items-center" style={{ width: '12%' }}>
                        {spinner()}
                    </InputGroup.Prepend>
                    <Form.Control type="text" value={query} onChange={(e) => setQuery(e.currentTarget.value)} />
                </InputGroup>
            </Form>
            <ListGroup className="overflow-auto h-100 ml-5">
                {useList.map(campaign => {
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